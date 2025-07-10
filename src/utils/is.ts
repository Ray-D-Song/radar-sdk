import { isString } from 'radash';

export function isJSONString(value: any): boolean {
  if (!isString(value)) {
    return false;
  }
  
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

export function isSupportBeaconSend(): boolean {
  return typeof navigator === 'object' && typeof navigator.sendBeacon === 'function';
}

export function isSupportCors(): boolean {
  return true;
}