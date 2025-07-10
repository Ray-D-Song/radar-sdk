import { isString, isObject, isFunction } from 'lodash-es';
import { Storage } from '../interfaces';

export class CookieStorage implements Storage {
  private domain: string;
  private secure: boolean;
  private crossSubdomain: boolean;

  constructor(options: { domain?: string; secure?: boolean; crossSubdomain?: boolean } = {}) {
    this.domain = options.domain || '';
    this.secure = options.secure || false;
    this.crossSubdomain = options.crossSubdomain !== false;
  }

  isSupport(): boolean {
    return typeof document !== 'undefined' && isFunction(document.cookie);
  }

  get(name: string): string {
    if (!isString(name) || !this.isSupport()) {
      return '';
    }

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    
    return '';
  }

  set(name: string, value: string, days?: number): boolean {
    if (!isString(name) || !this.isSupport()) {
      return false;
    }

    const cdomain = this.getCookieDomain();
    const expires = days ? '; expires=' + new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toUTCString() : '';
    const secure = this.secure ? '; secure' : '';
    const sameSite = this.secure ? '; SameSite=None' : '';
    
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure + sameSite;
    return true;
  }

  remove(name: string): boolean {
    if (!isString(name) || !this.isSupport()) {
      return false;
    }

    this.set(name, '', -1);
    return true;
  }

  private getCookieDomain(): string {
    if (!this.crossSubdomain) {
      return '';
    }
    
    const host = document.location.hostname;
    
    if (this.domain) {
      return '; domain=' + this.domain;
    }
    
    if (host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return '';
    }
    
    const domainParts = host.split('.');
    const domain = domainParts.slice(-2).join('.');
    
    return '; domain=.' + domain;
  }
}

export class LocalStorage implements Storage {
  isSupport(): boolean {
    const testKey = '__sensors_test_localStorage';
    
    try {
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  get(key: string): string {
    if (!isString(key) || !this.isSupport()) {
      return '';
    }

    try {
      return window.localStorage.getItem(key) || '';
    } catch (error) {
      return '';
    }
  }

  set(key: string, value: string): boolean {
    if (!isString(key) || !this.isSupport()) {
      return false;
    }

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  remove(key: string): boolean {
    if (!isString(key) || !this.isSupport()) {
      return false;
    }

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export class SessionStorage implements Storage {
  isSupport(): boolean {
    const testKey = '__sensors_test_sessionStorage';
    
    try {
      window.sessionStorage.setItem(testKey, '1');
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  get(key: string): string {
    if (!isString(key) || !this.isSupport()) {
      return '';
    }

    try {
      return window.sessionStorage.getItem(key) || '';
    } catch (error) {
      return '';
    }
  }

  set(key: string, value: string): boolean {
    if (!isString(key) || !this.isSupport()) {
      return false;
    }

    try {
      window.sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  remove(key: string): boolean {
    if (!isString(key) || !this.isSupport()) {
      return false;
    }

    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export class MemoryStorage implements Storage {
  private storage: Record<string, string> = {};

  isSupport(): boolean {
    return true;
  }

  get(key: string): string {
    if (!isString(key)) {
      return '';
    }
    
    return this.storage[key] || '';
  }

  set(key: string, value: string): boolean {
    if (!isString(key)) {
      return false;
    }
    
    this.storage[key] = value;
    return true;
  }

  remove(key: string): boolean {
    if (!isString(key)) {
      return false;
    }
    
    delete this.storage[key];
    return true;
  }
}

export class StorageManager {
  private storages: Storage[];
  private currentStorage: Storage | null = null;

  constructor(options: { domain?: string; secure?: boolean; crossSubdomain?: boolean } = {}) {
    this.storages = [
      new LocalStorage(),
      new CookieStorage(options),
      new SessionStorage(),
      new MemoryStorage()
    ];
    
    this.initStorage();
  }

  private initStorage(): void {
    for (const storage of this.storages) {
      if (storage.isSupport()) {
        this.currentStorage = storage;
        break;
      }
    }
    
    if (!this.currentStorage) {
      this.currentStorage = new MemoryStorage();
    }
  }

  get(key: string): any {
    if (!this.currentStorage) {
      return '';
    }
    
    const value = this.currentStorage.get(key);
    
    try {
      return JSON.parse(value);
    } catch (e) {
      return value || '';
    }
  }

  set(key: string, value: any, options?: any): boolean {
    if (!this.currentStorage) {
      return false;
    }
    
    let saveValue = value;
    
    if (isObject(value)) {
      saveValue = JSON.stringify(value);
    }
    
    return this.currentStorage.set(key, String(saveValue), options);
  }

  remove(key: string): boolean {
    if (!this.currentStorage) {
      return false;
    }
    
    return this.currentStorage.remove(key);
  }
}
