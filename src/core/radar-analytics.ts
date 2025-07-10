import { 
  extend2Lev, now, encodeDates, getDeviceInfo, getBrowserInfo,
  getProtocol, getReferrer
} from '../utils/index';
import { isString, isObject, isNumber, isBoolean, isArray, isDate } from 'lodash-es';
import { EventEmitter } from '../utils/event-emitter';
import { StorageManager } from '../utils/storage';
import { IdentityManager } from '../utils/identity';
import { DataSenderFactory } from '../utils/data-sender';
import { PluginManager } from './plugin-system';
import { PageLeave } from './page-leave';
import { RadarDataConfig, EventProperties, UserProperties, EventData } from '../interfaces';


enum ReadyState {
  UNINITIALIZED = 0,
  INITIALIZING = 1,
  INITIALIZED = 2
}

export class RadarAnalytics {
  public VERSION = '1.0.0';
  
  private config: RadarDataConfig | null = null;
  
  private eventEmitter: EventEmitter;
  private storageManager: StorageManager;
  private identityManager: IdentityManager;
  private dataSenderFactory: DataSenderFactory;
  private pluginManager: PluginManager;
  private pageLeave: PageLeave | null = null;
  
  private _readyState = {
    state: ReadyState.UNINITIALIZED,
    stateInfo: {}
  };
  private presetProperties: Record<string, any> = {};
  private registerProperties: Record<string, any> = {};
  private pageRegisterProperties: Record<string, any> = {};
  private sessionRegisterProperties: Record<string, any> = {};
  private isDebug = false;

  constructor(config: RadarDataConfig) {
    this.initConfig(config);
    
    this.eventEmitter = new EventEmitter();
    this.storageManager = new StorageManager({
      domain: this.config?.cross_subdomain_domain,
      secure: this.config?.secure_cookie,
      crossSubdomain: this.config?.cross_subdomain
    });
    
    this.identityManager = new IdentityManager({
      storage: this.storageManager,
      cookieName: this.config?.cookie_name,
      cookieDomain: this.config?.cross_subdomain_domain,
      crossSubdomain: this.config?.cross_subdomain
    });
    
    this.dataSenderFactory = new DataSenderFactory();
    this.pluginManager = new PluginManager(this, this.eventEmitter);
    
    this._readyState.state = ReadyState.INITIALIZING;
    
    this.initPresetProperties();
    
    if (this.config?.track_page_leave) {
      this.pageLeave = new PageLeave(this, this.eventEmitter, {
        debug: this.isDebug
      });
    }
    
    this._readyState.state = ReadyState.INITIALIZED;
    
    this.eventEmitter.emit('ready');
    
    this.pluginManager.initPlugins(this.config?.plugins);
    
    if (this.config?.is_track_page_view) {
      this.trackPageView();
    }
    
    this.log('SDK initialized', this.config);
  }

  private initConfig(config: RadarDataConfig): void {
    const defaultConfig: RadarDataConfig = {
      server_url: '',
      is_debug: false,
      cross_subdomain: true,
      send_type: 'image',
      heatmap: false,
      max_string_length: 500,
      preset_properties: {
        latest_referrer: true,
        latest_referrer_host: true,
        latest_search_keyword: true,
        latest_traffic_source_type: true,
        latest_landing_page: true,
        url: true,
        title: true
      },
      is_track_single_page: false,
      is_track_page_view: true,
      is_track_link_click: false,
      is_compliance_enabled: false,
      app_js_bridge: false,
      track_page_leave: true,
      cookie_name: 'sensorsdata2015jssdkcross',
      plugins: {}
    };
    
    this.config = extend2Lev(defaultConfig, config);
    
    this.isDebug = !!this.config.is_debug;
  }

  private initPresetProperties(): void {
    const presetProps = this.config?.preset_properties;
    
    if (!isObject(presetProps)) {
      return;
    }
    
    if (presetProps.$device_info !== false) {
      this.presetProperties.$device_info = getDeviceInfo();
    }
    
    if (presetProps.$browser_info !== false) {
      this.presetProperties.$browser_info = getBrowserInfo();
    }
    
    if (presetProps.$protocol !== false) {
      this.presetProperties.$protocol = getProtocol();
    }
    
    if (presetProps.latest_referrer !== false) {
      this.presetProperties.$latest_referrer = getReferrer();
    }
    
    if (presetProps.latest_referrer_host !== false && this.presetProperties.$latest_referrer) {
      try {
        this.presetProperties.$latest_referrer_host = new URL(this.presetProperties.$latest_referrer).hostname;
      } catch (e) {
        this.presetProperties.$latest_referrer_host = '';
      }
    }
    
    if (presetProps.$first_visit_time !== false) {
      const firstVisitTime = this.storageManager.get('$first_visit_time');
      if (!firstVisitTime) {
        const currentTime = now();
        this.storageManager.set('$first_visit_time', currentTime);
        this.presetProperties.$first_visit_time = currentTime;
      } else {
        this.presetProperties.$first_visit_time = firstVisitTime;
      }
    }
    
    if (presetProps.$first_referrer !== false) {
      const firstReferrer = this.storageManager.get('$first_referrer');
      if (!firstReferrer) {
        const currentReferrer = getReferrer();
        this.storageManager.set('$first_referrer', currentReferrer);
        this.presetProperties.$first_referrer = currentReferrer;
      } else {
        this.presetProperties.$first_referrer = firstReferrer;
      }
    }
    
    if (presetProps.$first_referrer_host !== false) {
      const firstReferrerHost = this.storageManager.get('$first_referrer_host');
      if (!firstReferrerHost && this.presetProperties.$first_referrer) {
        try {
          const host = new URL(this.presetProperties.$first_referrer).hostname;
          this.storageManager.set('$first_referrer_host', host);
          this.presetProperties.$first_referrer_host = host;
        } catch (e) {
          this.presetProperties.$first_referrer_host = '';
        }
      } else {
        this.presetProperties.$first_referrer_host = firstReferrerHost;
      }
    }
  }

  getPresetProperties(): Record<string, any> {
    const properties = { ...this.presetProperties };
    
    if (this.config?.preset_properties?.url !== false) {
      properties.$url = window.location.href;
    }
    
    if (this.config?.preset_properties?.title !== false) {
      properties.$title = document.title;
    }
    
    return properties;
  }

  private getCommonProperties(): Record<string, any> {
    const properties: Record<string, any> = {};
    
    Object.assign(properties, this.getPresetProperties());
    
    Object.assign(properties, this.registerProperties);
    Object.assign(properties, this.sessionRegisterProperties);
    Object.assign(properties, this.pageRegisterProperties);
    
    properties.$lib = 'js';
    properties.$lib_version = this.VERSION;
    properties.$lib_method = 'code';
    
    properties.$time = now();
    
    return properties;
  }

  private processProperties(properties: EventProperties): EventProperties {
    if (!isObject(properties)) {
      return {};
    }
    
    const result: EventProperties = {};
    const maxLength = this.config?.max_string_length || 500;
    
    for (const key in properties) {
      if (!Object.prototype.hasOwnProperty.call(properties, key)) {
        continue;
      }
      
      if (key.charAt(0) === '$' && !this.isValidPresetProperty(key)) {
        continue;
      }
      
      let value = properties[key];
      
      if (isString(value)) {
        if (value.length > maxLength) {
          value = value.slice(0, maxLength);
        }
        result[key] = value;
      } else if (isNumber(value) || isBoolean(value)) {
        result[key] = value;
      } else if (isDate(value)) {
        result[key] = value.toISOString();
      } else if (isArray(value)) {
        result[key] = value;
      } else if (isObject(value)) {
        try {
          const jsonStr = JSON.stringify(value);
          if (jsonStr.length > maxLength) {
            result[key] = JSON.stringify(value, null, 0).slice(0, maxLength);
          } else {
            result[key] = value;
          }
        } catch (e) {
          result[key] = String(value).slice(0, maxLength);
        }
      } else {
        result[key] = String(value).slice(0, maxLength);
      }
    }
    
    return result;
  }

  private isValidPresetProperty(property: string): boolean {
    const validProperties = [
      '$url', '$title', '$referrer', '$referrer_host',
      '$url_path', '$device_info', '$browser_info', '$protocol',
      '$latest_referrer', '$latest_referrer_host', '$first_visit_time',
      '$first_referrer', '$first_referrer_host', '$lib', '$lib_version',
      '$lib_method', '$time', '$screen_height', '$screen_width',
      '$viewport_width', '$viewport_height', '$device_id', '$user_agent'
    ];
    
    return validProperties.indexOf(property) !== -1;
  }

  private prepareEventData(type: string, event: string, properties: EventProperties = {}): EventData {
    const commonProps = this.getCommonProperties();
    
    const eventProps = this.processProperties(properties);
    const mergedProps = Object.assign({}, commonProps, eventProps);
    
    const eventData: EventData = {
      type,
      event,
      properties: mergedProps,
      distinct_id: this.identityManager.getDistinctId(),
      time: now()
    };
    
    const firstId = this.identityManager.getFirstId();
    if (firstId && firstId !== eventData.distinct_id) {
      eventData.first_id = firstId;
    }
    
    eventData.identities = this.identityManager.getIdentities();
    
    return eventData;
  }

  private sendEventData(eventData: EventData): void {
    const dataStageResult = this.pluginManager.processStage('dataStage', eventData);
    if (dataStageResult === false) {
      this.log('Event intercepted at dataStage', eventData);
      return;
    }
    
    const businessStageResult = this.pluginManager.processStage('businessStage', dataStageResult);
    if (businessStageResult === false) {
      this.log('Event intercepted at businessStage', dataStageResult);
      return;
    }
    
    const sendStageResult = this.pluginManager.processStage('sendStage', businessStageResult);
    if (sendStageResult === false) {
      this.log('Event intercepted at sendStage', businessStageResult);
      return;
    }
    
    const data = this.formatData(sendStageResult);
    
    const sender = this.dataSenderFactory.getSender(this.config?.send_type || 'image');
    if (!sender) {
      this.log('No available sender', { sendType: this.config?.send_type });
      return;
    }
    
    const url = this.buildRequestUrl(data);
    
    sender.send({ url })
      .then(() => {
        this.log('Event sent successfully', { event: eventData.event, url });
      })
      .catch((error) => {
        this.log('Event sending failed', { event: eventData.event, error });
      });
  }

  private formatData(eventData: EventData): Record<string, any> {
    const data = encodeDates(eventData);
    
    const jsonData = JSON.stringify(data);
    
    const base64Data = btoa(encodeURIComponent(jsonData).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    
    return {
      data: base64Data,
      gzip: 0
    };
  }

  private buildRequestUrl(data: Record<string, any>): string {
    const serverUrl = this.config?.server_url;
    const separator = serverUrl?.indexOf('?') !== -1 ? '&' : '?';
    
    return `${serverUrl}${separator}data=${data.data}&gzip=${data.gzip}`;
  }

  private log(message: string, data?: any): void {
    if (this.isDebug) {
      console.log(`[SensorsData] ${message}`, data || '');
    }
  }

  get readyState(): { state: number; stateInfo: Record<string, any> } {
    return { ...this._readyState };
  }

  debug(debug: boolean): void {
    this.isDebug = debug;
    if (this.config) {
      this.config.is_debug = debug;
    }
  }

  on(event: string, callback: Function): void {
    this.eventEmitter.on(event, callback);
  }

  off(event: string, callback?: Function): void {
    this.eventEmitter.off(event, callback);
  }

  once(event: string, callback: Function): void {
    this.eventEmitter.once(event, callback);
  }

  emit(event: string, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args);
  }

  track(event: string, properties?: EventProperties): void {
    if (!isString(event) || !event) {
      this.log('Invalid event name', { event });
      return;
    }
    
    const eventData = this.prepareEventData('track', event, properties);
    
    this.sendEventData(eventData);
  }

  trackPageView(properties?: EventProperties): void {
    this.track('$pageview', properties);
  }

  trackSignup(distinctId: string, properties?: EventProperties): void {
    if (!isString(distinctId) || !distinctId) {
      this.log('Invalid user ID', { distinctId });
      return;
    }
    
    const eventData = this.prepareEventData('track_signup', '$SignUp', properties);
    
    eventData.distinct_id = distinctId;
    
    this.sendEventData(eventData);
    
    this.identityManager.login(distinctId);
  }

  setProfile(properties: UserProperties): void {
    if (!isObject(properties) || Object.keys(properties).length === 0) {
      this.log('Invalid user properties', { properties });
      return;
    }
    
    const eventData = this.prepareEventData('profile_set', '$profile_set', properties);
    
    this.sendEventData(eventData);
  }

  setOnceProfile(properties: UserProperties): void {
    if (!isObject(properties) || Object.keys(properties).length === 0) {
      this.log('Invalid user properties', { properties });
      return;
    }
    
    const eventData = this.prepareEventData('profile_set_once', '$profile_set_once', properties);
    
    this.sendEventData(eventData);
  }

  appendProfile(properties: UserProperties): void {
    if (!isObject(properties) || Object.keys(properties).length === 0) {
      this.log('Invalid user properties', { properties });
      return;
    }
    
    const eventData = this.prepareEventData('profile_append', '$profile_append', properties);
    
    this.sendEventData(eventData);
  }

  incrementProfile(properties: UserProperties): void {
    if (!isObject(properties) || Object.keys(properties).length === 0) {
      this.log('Invalid user properties', { properties });
      return;
    }
    
    const eventData = this.prepareEventData('profile_increment', '$profile_increment', properties);
    
    this.sendEventData(eventData);
  }

  deleteProfile(): void {
    const eventData = this.prepareEventData('profile_delete', '$profile_delete');
    
    this.sendEventData(eventData);
  }

  unsetProfile(properties: string[] | Record<string, boolean>): void {
    let props: Record<string, boolean> = {};
    
    if (isArray(properties)) {
      properties.forEach(prop => {
        if (isString(prop)) {
          props[prop] = true;
        }
      });
    } else if (isObject(properties)) {
      props = properties;
    }
    
    if (Object.keys(props).length === 0) {
      this.log('Invalid user properties', { properties });
      return;
    }
    
    const eventData = this.prepareEventData('profile_unset', '$profile_unset', props);
    
    this.sendEventData(eventData);
  }

  identify(distinctId: string): void {
    if (!isString(distinctId) || !distinctId) {
      this.log('Invalid user ID', { distinctId });
      return;
    }
    
    this.identityManager.setIdentity('$identity_anonymous_id', distinctId);
  }

  resetAnonymousIdentity(): string {
    return this.identityManager.resetAnonymousId();
  }

  login(loginId: string): void {
    if (!isString(loginId) || !loginId) {
      this.log('Invalid login ID', { loginId });
      return;
    }
    
    this.identityManager.login(loginId);
  }

  loginWithKey(keyName: string, loginId: string): void {
    if (!isString(keyName) || !keyName.startsWith('$identity_') || !isString(loginId) || !loginId) {
      this.log('Invalid key name or login ID', { keyName, loginId });
      return;
    }
    
    this.identityManager.setIdentity(keyName, loginId);
  }

  logout(): void {
    this.identityManager.logout();
  }

  register(properties: EventProperties): void {
    if (!isObject(properties)) {
      this.log('Invalid public properties', { properties });
      return;
    }
    
    Object.assign(this.registerProperties, properties);
  }

  registerOnce(properties: EventProperties): void {
    if (!isObject(properties)) {
      this.log('Invalid public properties', { properties });
      return;
    }
    
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key) && 
          !Object.prototype.hasOwnProperty.call(this.registerProperties, key)) {
        this.registerProperties[key] = properties[key];
      }
    }
  }

  registerPage(properties: EventProperties): void {
    if (!isObject(properties)) {
      this.log('Invalid page public properties', { properties });
      return;
    }
    
    Object.assign(this.pageRegisterProperties, properties);
  }

  registerPageOnce(properties: EventProperties): void {
    if (!isObject(properties)) {
      this.log('Invalid page public properties', { properties });
      return;
    }
    
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key) && 
          !Object.prototype.hasOwnProperty.call(this.pageRegisterProperties, key)) {
        this.pageRegisterProperties[key] = properties[key];
      }
    }
  }

  registerSession(properties: EventProperties): void {
    if (!isObject(properties)) {
      this.log('Invalid session public properties', { properties });
      return;
    }
    
    Object.assign(this.sessionRegisterProperties, properties);
  }

  registerSessionOnce(properties: EventProperties): void {
    if (!isObject(properties)) {
      this.log('Invalid session public properties', { properties });
      return;
    }
    
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key) && 
          !Object.prototype.hasOwnProperty.call(this.sessionRegisterProperties, key)) {
        this.sessionRegisterProperties[key] = properties[key];
      }
    }
  }

  clearAllRegister(): void {
    this.registerProperties = {};
    this.pageRegisterProperties = {};
    this.sessionRegisterProperties = {};
  }

  
  clearPageRegister(): void {
    this.pageRegisterProperties = {};
  }

  
  getDistinctId(): string {
    return this.identityManager.getDistinctId();
  }

  
  getFirstId(): string {
    return this.identityManager.getFirstId();
  }

  
  registerPlugin(plugin: any, config?: any): boolean {
    return this.pluginManager.registerPlugin(plugin, config);
  }

  
  getPlugin(pluginName: string): any {
    return this.pluginManager.getPlugin(pluginName);
  }
}
