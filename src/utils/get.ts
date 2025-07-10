import { isString } from 'lodash-es';

export function getDeviceInfo(): Record<string, any> {
  return {
    screenHeight: window.screen.height,
    screenWidth: window.screen.width,
    devicePixelRatio: window.devicePixelRatio || 1
  };
}

export function getBrowserInfo(): Record<string, any> {
  const userAgent = navigator.userAgent.toLowerCase();
  const browserInfo: Record<string, number> = {};
  
  let match;
  
  if (match = userAgent.match(/ qq\/([\d.]+)/)) {
    browserInfo.qqBuildinBrowser = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/mqqbrowser\/([\d.]+)/)) {
    browserInfo.qqBrowser = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/opera.([\d.]+)/)) {
    browserInfo.opera = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/msie ([\d.]+)/)) {
    browserInfo.ie = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/edge.([\d.]+)/)) {
    browserInfo.edge = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/firefox\/([\d.]+)/)) {
    browserInfo.firefox = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/chrome\/([\d.]+)/)) {
    browserInfo.chrome = Number(match[1].split('.')[0]);
  } else if (match = userAgent.match(/version\/([\d.]+).*safari/)) {
    browserInfo.safari = Number(match[1].match(/^\d*.\d*/));
  } else if (match = userAgent.match(/trident\/([\d.]+)/)) {
    browserInfo.ie = 11;
  }
  
  return browserInfo;
}

export function getProtocol(): string {
  const protocol = location.protocol;
  if (protocol === 'http:' || protocol === 'https:') {
    return protocol;
  }
  return 'http:';
}

export function getReferrer(referrer?: string | null, full = false): string {
  if (isString(referrer)) {
    return referrer;
  }
  
  const referrerValue = document.referrer || '';
  if (full) {
    return referrerValue;
  }
  
  return referrerValue.split('?')[0];
}

export function getURLSearchParams(url: string): Record<string, string> {
  const result: Record<string, string> = {};
  const searchParams = new URLSearchParams(url);
  
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

export function getHostname(url: string): string {
  return new URL(url).hostname;
}

export function getQueryParam(url: string, name: string): string {
  if (!isString(url) || !isString(name)) {
    return '';
  }
  
  url = decodeURIComponent(url);
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(url);
  
  return results === null ? '' : decodeURIComponent(results[1]);
}

export function getQueryParamsFromUrl(url: string): Record<string, string> {
  const result: Record<string, string> = {};
  const parts = url.split('?');
  const queryString = parts[1] || '';
  
  if (!queryString) {
    return result;
  }
  
  const searchParams = new URLSearchParams(queryString);
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

export function getURL(url?: string): string {
  if (isString(url)) {
    url = decodeURIComponent(url);
    return new URL(url).href;
  }
  return window.location.href;
}

export function getURLPath(url?: string): string {
  if (isString(url)) {
    url = decodeURIComponent(url);
    return new URL(url).pathname;
  }
  return window.location.pathname;
}

