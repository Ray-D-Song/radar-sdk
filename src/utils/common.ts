import { isString, isObject, isFunction, isArray, isDate } from 'lodash-es';

export function parseURL(url: string): URL {
  return new URL(url, window.location.href);
}

export function base64Encode(data: string): string {
  try {
    return btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (e) {
    return '';
  }
}

export function base64Decode(data: string): string {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(data), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return '';
  }
}

export function decodeURIComponentSafe(uri: string): string {
  try {
    return decodeURIComponent(uri);
  } catch (e) {
    return uri;
  }
}

export function decodeURISafe(uri: string): string {
  try {
    return decodeURI(uri);
  } catch (e) {
    return uri;
  }
}

export function each<T>(obj: T[], iterator: (value: T, index: number, array: T[]) => void): void;
export function each<T>(obj: Record<string, T>, iterator: (value: T, key: string, obj: Record<string, T>) => void): void;
export function each<T>(obj: T[] | Record<string, T>, iterator: any): void {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      iterator(obj[i], i, obj);
    }
  } else if (isObject(obj)) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        iterator(obj[key], key, obj);
      }
    }
  }
}

export function extend2Lev<T, U>(target: T, source: U): T & U {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key]) && isObject((target as any)[key])) {
        Object.assign(target as any)[key], source[key];
      } else {
        (target as any)[key] = source[key];
      }
    }
  }
  return target as T & U;
}

export function unique<T>(arr: T[]): T[] {
  if (!isArray(arr)) {
    return [];
  }
  
  return Array.from(new Set(arr));
}

export function values<T>(obj: Record<string, T>): T[] {
  if (!isObject(obj)) {
    return [];
  }
  
  if (Object.values) {
    return Object.values(obj);
  }
  
  const result: T[] = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result.push(obj[key]);
    }
  }
  return result;
}

export function formatJsonString(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return '';
  }
}

export function encodeDates(obj: Record<string, any> | any[]): any {
  if (!isObject(obj) && !isArray(obj)) {
    return obj;
  }
  
  if (isArray(obj)) {
    return obj.map(encodeDates);
  }
  
  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (isDate(obj[key])) {
        result[key] = (obj[key] as Date).toISOString();
      } else if (isObject(obj[key]) || isArray(obj[key])) {
        result[key] = encodeDates(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

export function searchObjDate(obj: any): void {
  if (isObject(obj)) {
    each(obj as Record<string, any>, (value) => {
      if (isObject(value)) {
        searchObjDate(value);
      } else if (isArray(value)) {
        searchObjDate(value);
      }
    });
  }
}

export function now(): number {
  return Date.now();
}

export function getRandom(): number {
  return Math.random();
}

export function getRandomBasic(): number {
  const random = String(Math.random()).slice(2, 5) + String(Math.random()).slice(2, 5);
  return Number(random);
}

export function listenPageState(options: { visible?: Function; hidden?: Function }): void {
  const visibleHandler = isFunction(options.visible) ? options.visible : () => {};
  const hiddenHandler = isFunction(options.hidden) ? options.hidden : () => {};
  const visibilityChange = 'visibilitychange';
  
  const isSupport = (): boolean => {
    return typeof document.hidden !== 'undefined';
  };
  
  const listen = (): void => {
    if (isSupport()) {
      document.addEventListener(visibilityChange, () => {
        if (document.hidden) {
          hiddenHandler();
        } else {
          visibleHandler();
        }
      });
    } else {
      document.addEventListener('focus', visibleHandler);
      document.addEventListener('blur', hiddenHandler);
    }
  };
  
  listen();
}
