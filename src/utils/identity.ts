import { isString } from 'lodash-es';
import { StorageManager } from './storage';
import { UserIdentity } from '../interfaces';
import { uniqueId } from 'lodash-es';

export class IdentityManager {
  private storage: StorageManager;
  private cookieName: string;
  private identities: Record<string, string> = {};
  private firstId: string = '';
  private distinctId: string = '';
  private loginId: string = '';

  constructor(options: { 
    storage: StorageManager; 
    cookieName?: string;
    cookieDomain?: string;
    crossSubdomain?: boolean;
  }) {
    this.storage = options.storage;
    this.cookieName = options.cookieName || 'sensorsdata2015jssdkcross';
    
    this.initIdentity();
  }

  private initIdentity(): void {
    const storedInfo = this.storage.get(this.cookieName);
    
    if (storedInfo && typeof storedInfo === 'object') {
      if (storedInfo.identities && typeof storedInfo.identities === 'object') {
        this.identities = storedInfo.identities;
      }
      
      if (isString(storedInfo.first_id)) {
        this.firstId = storedInfo.first_id;
      }
      
      if (isString(storedInfo.distinct_id)) {
        this.distinctId = storedInfo.distinct_id;
      }
    }
    
    if (!this.getAnonymousId()) {
      this.resetAnonymousId();
    }
    
    if (!this.firstId) {
      this.firstId = this.getAnonymousId();
    }
    
    if (!this.distinctId) {
      this.distinctId = this.getAnonymousId();
    }
    
    this.saveIdentities();
  }

  getAnonymousId(): string {
    return this.identities.$identity_anonymous_id || '';
  }

  resetAnonymousId(): string {
    const newId = uniqueId();
    this.identities.$identity_anonymous_id = newId;
    
    if (this.distinctId === this.getAnonymousId() || !this.distinctId) {
      this.distinctId = newId;
    }
    
    this.saveIdentities();
    return newId;
  }

  getLoginId(): string {
    return this.identities.$identity_login_id || '';
  }

  setLoginId(loginId: string, saveStorage = true): void {
    if (!isString(loginId) || !loginId) {
      return;
    }
    
    this.identities.$identity_login_id = loginId;
    this.distinctId = loginId;
    this.loginId = loginId;
    
    if (saveStorage) {
      this.saveIdentities();
    }
  }

  clearLoginId(): void {
    delete this.identities.$identity_login_id;
    this.distinctId = this.getAnonymousId();
    this.loginId = '';
    
    this.saveIdentities();
  }

  getDistinctId(): string {
    return this.distinctId || this.getAnonymousId();
  }

  getFirstId(): string {
    return this.firstId;
  }

  
  setIdentity(key: string, value: string): void {
    if (!isString(key) || !key.startsWith('$identity_') || !isString(value) || !value) {
      return;
    }
    
    this.identities[key] = value;
    this.saveIdentities();
  }

  
  getIdentities(): Record<string, string> {
    return { ...this.identities };
  }

  
  private saveIdentities(): void {
    const identityData = {
      distinct_id: this.distinctId,
      first_id: this.firstId,
      identities: this.identities
    };
    
    this.storage.set(this.cookieName, identityData, 730);
  }

  getUserIdentity(): UserIdentity {
    return {
      anonymous_id: this.getAnonymousId(),
      login_id: this.getLoginId(),
      distinct_id: this.getDistinctId(),
      first_id: this.getFirstId(),
      identities: this.getIdentities()
    };
  }

  
  login(loginId: string): UserIdentity {
    if (!isString(loginId) || !loginId) {
      return this.getUserIdentity();
    }
    
    if (this.getLoginId() === loginId) {
      return this.getUserIdentity();
    }
    
    this.setLoginId(loginId);
    return this.getUserIdentity();
  }

  
  logout(): UserIdentity {
    this.clearLoginId();
    return this.getUserIdentity();
  }
}
