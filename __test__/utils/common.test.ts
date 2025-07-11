import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseURL,
  base64Encode,
  base64Decode,
  decodeURIComponentSafe,
  decodeURISafe,
  each,
  extend2Lev,
  unique,
  values,
  formatJsonString,
  encodeDates,
  now,
  getRandom,
  getRandomBasic,
  listenPageState
} from '../../src/utils/common';

describe('parseURL', () => {
  it('should correctly parse URL', () => {
    const url = 'https://example.com/path?query=value#hash';
    const parsed = parseURL(url);
    
    expect(parsed.protocol).toBe('https:');
    expect(parsed.hostname).toBe('example.com');
    expect(parsed.pathname).toBe('/path');
    expect(parsed.search).toBe('?query=value');
    expect(parsed.hash).toBe('#hash');
  });
  
  it('should use current page URL as base URL', () => {
    const url = '/relative/path';
    const parsed = parseURL(url);
    
    expect(parsed.pathname).toBe('/relative/path');
  });
});


describe('Base64 Encoding and Decoding', () => {
  const testCases = [
    { input: 'Hello, World!', expected: 'SGVsbG8sIFdvcmxkIQ==' },
    { input: '测试中文', expected: '5rWL6K+V5Lit5paH' },
    { input: '!@#$%^&*()', expected: 'IUAjJCVeJiooKQ==' }
  ];
  
  testCases.forEach(({ input, expected }) => {
    it(`should correctly encode and decode: ${input}`, () => {
      const encoded = base64Encode(input);
      expect(encoded).toBe(expected);
      
      const decoded = base64Decode(encoded);
      expect(decoded).toBe(input);
    });
  });
  
  it('should return an empty string on encoding error', () => {
    
    const originalBtoa = global.btoa;
    global.btoa = vi.fn(() => { throw new Error('Mock error'); });
    
    expect(base64Encode('test')).toBe('');
    
    global.btoa = originalBtoa;
  });
  
  it('should return an empty string on decoding error', () => {
    
    const originalAtob = global.atob;
    global.atob = vi.fn(() => { throw new Error('Mock error'); });
    
    expect(base64Decode('SGVsbG8=')).toBe('');
    
    global.atob = originalAtob;
  });
});


describe('Safe URI Decoding', () => {
  it('should correctly decode URI component', () => {
    const encoded = 'Hello%20World%21';
    expect(decodeURIComponentSafe(encoded)).toBe('Hello World!');
  });
  
  it('should return original value on URI component decoding error', () => {
    const invalid = '%E0%A4%A';
    expect(decodeURIComponentSafe(invalid)).toBe(invalid);
  });
  
  it('should correctly decode URI', () => {
    const encoded = 'http://example.com/path%20with%20spaces';
    expect(decodeURISafe(encoded)).toBe('http://example.com/path with spaces');
  });
  
  it('should return original value on URI decoding error', () => {
    const invalid = 'http://example.com/%E0%A4%A';
    expect(decodeURISafe(invalid)).toBe(invalid);
  });
});


describe('each', () => {
  it('should correctly iterate over arrays', () => {
    const arr = [1, 2, 3];
    const result: number[] = [];
    
    each(arr, (value, index) => {
      result.push(value * index);
    });
    
    expect(result).toEqual([0, 2, 6]);
  });
  
  it('should correctly iterate over objects', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys: string[] = [];
    const values: number[] = [];
    
    each(obj, (value, key) => {
      keys.push(key);
      values.push(value);
    });
    
    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).toContain('c');
    expect(values).toContain(1);
    expect(values).toContain(2);
    expect(values).toContain(3);
  });
});


describe('extend2Lev', () => {
  it('should correctly merge two objects', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };
    
    const result = extend2Lev(target, source);
    
    expect(result.a).toBe(1);
    expect(result.e).toBe(4);
    
  });
});


describe('unique', () => {
  it('should return a debounced array', () => {
    const arr = [1, 2, 2, 3, 3, 3];
    expect(unique(arr)).toEqual([1, 2, 3]);
  });
  
  it('should return an empty array for non-array input', () => {
    
    // @ts-expect-error
    expect(unique('not an array')).toEqual([]);
  });
});


describe('values', () => {
  it('should return an array of object values', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(values(obj).sort()).toEqual([1, 2, 3]);
  });
  
  it('should return an empty array for non-object input', () => {
    
    // @ts-expect-error
    expect(values('not an object')).toEqual([]);
  });
});


describe('formatJsonString', () => {
  it('should correctly format JSON string', () => {
    const obj = { a: 1, b: { c: 2 } };
    const formatted = formatJsonString(obj);
    expect(formatted).toContain('"a": 1');
    expect(formatted).toContain('"b": {');
    expect(formatted).toContain('"c": 2');
  });
  
  it('should return an empty string on formatting error', () => {
    const circular: any = {};
    circular.self = circular; 
    
    expect(formatJsonString(circular)).toBe('');
  });
});


describe('encodeDates', () => {
  it('should convert Date objects to ISO strings', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const obj = { date, nested: { anotherDate: date } };
    
    const result = encodeDates(obj);
    
    expect(result.date).toBe('2023-01-01T00:00:00.000Z');
    expect(result.nested.anotherDate).toBe('2023-01-01T00:00:00.000Z');
  });
  
  it('should handle dates in arrays', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    const arr = [{ date }, { nestedDate: date }];
    
    const result = encodeDates(arr);
    
    expect(result[0].date).toBe('2023-01-01T00:00:00.000Z');
    expect(result[1].nestedDate).toBe('2023-01-01T00:00:00.000Z');
  });
  
  it('should return original value for non-object/non-array input', () => {
    
    // @ts-expect-error
    expect(encodeDates(123)).toBe(123);
    
    // @ts-expect-error
    expect(encodeDates('string')).toBe('string');
  });
});


describe('Time and Random Number Functions', () => {
  it('now should return current timestamp', () => {
    const timestamp = now();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThan(0);
  });
  
  it('getRandom should return a random number between 0 and 1', () => {
    const random = getRandom();
    expect(typeof random).toBe('number');
    expect(random).toBeGreaterThanOrEqual(0);
    expect(random).toBeLessThan(1);
  });
  
  it('getRandomBasic should return a number', () => {
    const random = getRandomBasic();
    expect(typeof random).toBe('number');
  });
});


describe('listenPageState', () => {
  let visibleSpy: ReturnType<typeof vi.fn>;
  let hiddenSpy: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    visibleSpy = vi.fn();
    hiddenSpy = vi.fn();
    
    
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: vi.fn(() => false)
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should call appropriate handler on document visibility change', () => {
    listenPageState({
      visible: visibleSpy,
      hidden: hiddenSpy
    });
    
    
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: vi.fn(() => true)
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(hiddenSpy).toHaveBeenCalled();
    
    
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: vi.fn(() => false)
    });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(visibleSpy).toHaveBeenCalled();
  });
  
  it('should use focus and blur events when document.hidden is not supported', () => {
    
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: undefined
    });
    
    listenPageState({
      visible: visibleSpy,
      hidden: hiddenSpy
    });
    
    document.dispatchEvent(new Event('focus'));
    expect(visibleSpy).toHaveBeenCalled();
    
    document.dispatchEvent(new Event('blur'));
    expect(hiddenSpy).toHaveBeenCalled();
  });
});
