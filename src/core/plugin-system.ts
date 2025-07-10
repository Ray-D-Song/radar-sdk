import { isFunction, isString } from 'lodash-es';
import { EventEmitter } from '../utils/event-emitter';
import { Interceptor, SensorsPlugin, StageProcessor } from '../interfaces';
import { RadarAnalytics } from './radar-analytics';

export class StageProcessorImpl implements StageProcessor {
  private name: string;
  private interceptors: Interceptor[] = [];

  constructor(name: string) {
    this.name = name;
  }

  registerInterceptor(interceptor: Interceptor): void {
    if (!interceptor || !isFunction(interceptor.process)) {
      return;
    }

    this.interceptors.push(interceptor);
    this.sortInterceptors();
  }

  private sortInterceptors(): void {
    this.interceptors.sort((a, b) => {
      const priorityA = a.priority || 0;
      const priorityB = b.priority || 0;
      return priorityB - priorityA;
    });
  }

  process(stageName: string, data: any): any {
    if (!data || stageName !== this.name) {
      return data;
    }

    let result = data;

    for (const interceptor of this.interceptors) {
      try {
        const processed = interceptor.process(result);
        
        if (processed === false || processed === null) {
          return false;
        }
        
        if (processed !== undefined) {
          result = processed;
        }
      } catch (error) {
        console.error(`Error in interceptor ${interceptor.name || 'unknown'} at stage ${this.name}:`, error);
      }
    }

    return result;
  }

  getInterceptors(): Interceptor[] {
    return [...this.interceptors];
  }
}

export class PluginManager {
  private plugins: Record<string, SensorsPlugin> = {};
  private eventEmitter: EventEmitter;
  private sdk: RadarAnalytics;
  private stageProcessors: Record<string, StageProcessor> = {};

  constructor(sdk: RadarAnalytics, eventEmitter: EventEmitter) {
    this.sdk = sdk;
    this.eventEmitter = eventEmitter;
    this.initStageProcessors();
  }

  private initStageProcessors(): void {
    this.stageProcessors = {
      dataStage: new StageProcessorImpl('dataStage'),
      businessStage: new StageProcessorImpl('businessStage'),
      sendStage: new StageProcessorImpl('sendStage'),
      viewStage: new StageProcessorImpl('viewStage')
    };
  }

  registerPlugin(plugin: SensorsPlugin, config?: any): boolean {
    if (!plugin || !isString(plugin.plugin_name)) {
      console.error('Invalid plugin format');
      return false;
    }

    const pluginName = plugin.plugin_name;

    if (this.plugins[pluginName]) {
      console.warn(`Plugin ${pluginName} is already registered`);
      return false;
    }
    this.plugins[pluginName] = plugin;

    if (this.sdk.readyState && this.sdk.readyState.state > 0) {
      this.initPlugin(pluginName, config);
    }

    return true;
  }

  initPlugin(pluginName: string, config?: any): boolean {
    const plugin = this.plugins[pluginName];
    
    if (!plugin || plugin.plugin_is_init) {
      return false;
    }

    try {
      plugin.init(this.sdk, config);
      
      plugin.plugin_is_init = true;
      
      this.eventEmitter.emit('plugin_initialized', pluginName, plugin);
      
      return true;
    } catch (error) {
      console.error(`Failed to initialize plugin ${pluginName}:`, error);
      return false;
    }
  }

  initPlugins(configs?: Record<string, any>): void {
    for (const pluginName in this.plugins) {
      if (Object.prototype.hasOwnProperty.call(this.plugins, pluginName)) {
        const config = configs ? configs[pluginName] : undefined;
        this.initPlugin(pluginName, config);
      }
    }
  }

  getPlugin(pluginName: string): SensorsPlugin | null {
    return this.plugins[pluginName] || null;
  }

  getAllPlugins(): Record<string, SensorsPlugin> {
    return { ...this.plugins };
  }

  getStageProcessor(stageName: string): StageProcessor | null {
    return this.stageProcessors[stageName] || null;
  }

  processStage(stageName: string, data: any): any {
    const processor = this.getStageProcessor(stageName);
    
    if (!processor) {
      return data;
    }
    
    return processor.process(stageName, data);
  }

  registerInterceptor(stageName: string, interceptor: Interceptor): boolean {
    const processor = this.getStageProcessor(stageName);
    
    if (!processor) {
      console.error(`Stage ${stageName} does not exist`);
      return false;
    }
    
    processor.registerInterceptor(interceptor);
    return true;
  }
}
