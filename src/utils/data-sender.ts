import { isSupportBeaconSend, isSupportCors } from './is';
import { isFunction, isString } from 'lodash-es'
import { DataSender } from '../interfaces';

export class ImageSender implements DataSender {
  name = 'image';

  isSupport(): boolean {
    return true;
  }

  async send(data: { url: string; success?: Function; error?: Function }): Promise<any> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => {
        if (isFunction(data.error)) {
          data.error();
        }
        reject(new Error('Image request timeout'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timer);
        if (isFunction(data.success)) {
          data.success();
        }
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timer);
        if (isFunction(data.error)) {
          data.error();
        }
        reject(new Error('Image request failed'));
      };

      img.src = data.url;
    });
  }
}

export class BeaconSender implements DataSender {
  name = 'beacon';

  isSupport(): boolean {
    return isSupportBeaconSend();
  }

  async send(data: { url: string; data?: any; success?: Function; error?: Function }): Promise<any> {
    if (!this.isSupport()) {
      throw new Error('Beacon API not supported');
    }

    try {
      const result = navigator.sendBeacon(data.url, data.data || '');
      
      if (result && isFunction(data.success)) {
        data.success();
      } else if (!result && isFunction(data.error)) {
        data.error();
      }
      
      return result;
    } catch (error) {
      if (isFunction(data.error)) {
        data.error();
      }
      throw error;
    }
  }
}

export class AjaxSender implements DataSender {
  name = 'ajax';

  isSupport(): boolean {
    return isSupportCors();
  }

  async send(data: { 
    url: string; 
    type?: string; 
    data?: any; 
    credentials?: boolean;
    timeout?: number;
    headers?: Record<string, string>;
    success?: Function; 
    error?: Function 
  }): Promise<any> {
    if (!this.isSupport()) {
      throw new Error('CORS not supported');
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const method = (data.type || 'GET').toUpperCase();
      const timeout = data.timeout || 5000;

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (isFunction(data.success)) {
              data.success(xhr.responseText);
            }
            resolve(xhr.responseText);
          } else {
            if (isFunction(data.error)) {
              data.error(xhr.statusText);
            }
            reject(new Error(`HTTP error: ${xhr.status} ${xhr.statusText}`));
          }
        }
      };

      xhr.onabort = () => {
        if (isFunction(data.error)) {
          data.error('Request aborted');
        }
        reject(new Error('Request aborted'));
      };

      xhr.ontimeout = () => {
        if (isFunction(data.error)) {
          data.error('Request timeout');
        }
        reject(new Error('Request timeout'));
      };

      xhr.onerror = () => {
        if (isFunction(data.error)) {
          data.error('Request failed');
        }
        reject(new Error('Request failed'));
      };

      xhr.open(method, data.url, true);
      xhr.timeout = timeout;
      
      if (data.credentials !== false) {
        xhr.withCredentials = true;
      }

      if (method === 'POST' && !data.headers?.['Content-Type']) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      if (data.headers) {
        for (const key in data.headers) {
          if (Object.prototype.hasOwnProperty.call(data.headers, key)) {
            xhr.setRequestHeader(key, data.headers[key]);
          }
        }
      }

      xhr.send(method === 'POST' ? JSON.stringify(data.data) : null);
    });
  }
}

export class JsonpSender implements DataSender {
  name = 'jsonp';
  private callbackPrefix = '_sensorsdatajsonp_';
  private callbackCounter = 0;

  isSupport(): boolean {
    return true;
  }

  async send(data: { 
    url: string; 
    callbackName?: string;
    callbackFunc?: string;
    timeout?: number;
    success?: Function; 
    error?: Function 
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName = data.callbackName || this.getCallbackName();
      const url = this.addCallbackToUrl(data.url, data.callbackFunc || 'callback', callbackName);
      const script = document.createElement('script');
      const head = document.getElementsByTagName('head')[0];
      const timeout = data.timeout || 5000;
      
      let timer: number | null = null;
      let removed = false;

      (window as any)[callbackName] = (response: any) => {
        this.cleanup(callbackName, script, timer);
        
        if (isFunction(data.success)) {
          data.success(response);
        }
        
        resolve(response);
      };

      timer = window.setTimeout(() => {
        this.cleanup(callbackName, script, null);
        
        if (isFunction(data.error)) {
          data.error('Timeout');
        }
        
        reject(new Error('JSONP request timeout'));
      }, timeout);

      script.onerror = () => {
        if (removed) {
          return;
        }
        
        this.cleanup(callbackName, script, timer);
        
        if (isFunction(data.error)) {
          data.error('Script error');
        }
        
        reject(new Error('JSONP request failed'));
      };

      script.src = url;
      head.appendChild(script);
    });
  }

  private getCallbackName(): string {
    this.callbackCounter += 1;
    return this.callbackPrefix + this.callbackCounter;
  }

  private addCallbackToUrl(url: string, callbackParam: string, callbackName: string): string {
    const separator = url.indexOf('?') === -1 ? '?' : '&';
    return url + separator + callbackParam + '=' + callbackName;
  }

  private cleanup(callbackName: string, script: HTMLScriptElement, timer: number | null): void {
    if (timer) {
      clearTimeout(timer);
    }

    try {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      if (isString(callbackName)) {
        delete (window as any)[callbackName];
      }
    } catch (e) {
      console.error('JSONP cleanup error', e);
    }
  }
}

export class BatchSender implements DataSender {
  name = 'batch';
  private queue: any[] = [];
  private timer: number | null = null;
  private sender: DataSender;
  private options: {
    maxSize: number;
    interval: number;
  };

  constructor(sender: DataSender, options: { maxSize?: number; interval?: number } = {}) {
    this.sender = sender;
    this.options = {
      maxSize: options.maxSize || 10,
      interval: options.interval || 5000
    };
  }

  isSupport(): boolean {
    return this.sender.isSupport();
  }

  async send(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        data,
        resolve,
        reject
      });

      if (this.queue.length >= this.options.maxSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = window.setTimeout(() => this.flush(), this.options.interval);
      }
    });
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) {
      return;
    }

    const batch = this.queue.slice();
    this.queue = [];

    const mergedData = this.mergeData(batch.map(item => item.data));

    this.sender.send(mergedData)
      .then(response => {
        batch.forEach(item => item.resolve(response));
      })
      .catch(error => {
        batch.forEach(item => item.reject(error));
      });
  }

  private mergeData(dataArray: any[]): any {
    return {
      ...dataArray[0],
      data: dataArray.map(item => item.data || item)
    };
  }
}

export class DataSenderFactory {
  private senders: Record<string, DataSender> = {};

  constructor() {
    this.registerDefaultSenders();
  }

  private registerDefaultSenders(): void {
    this.register(new ImageSender());
    this.register(new BeaconSender());
    this.register(new AjaxSender());
    this.register(new JsonpSender());
  }

  register(sender: DataSender): void {
    if (sender && sender.name) {
      this.senders[sender.name] = sender;
    }
  }

  getSender(name: string): DataSender | null {
    const sender = this.senders[name];
    
    if (sender && sender.isSupport()) {
      return sender;
    }
    
    return null;
  }

  getAvailableSender(): DataSender {
    const priorities = ['beacon', 'ajax', 'image'];
    
    for (const name of priorities) {
      const sender = this.getSender(name);
      if (sender) {
        return sender;
      }
    }
    
    return this.senders.image;
  }

  createBatchSender(name: string, options?: { maxSize?: number; interval?: number }): DataSender | null {
    const sender = this.getSender(name);
    
    if (!sender) {
      return null;
    }
    
    return new BatchSender(sender, options);
  }
}
