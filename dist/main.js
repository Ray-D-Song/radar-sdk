(function(root, factory) {
    if ('object' == typeof exports && 'object' == typeof module) module.exports = factory();
    else if ('function' == typeof define && define.amd) define([], factory);
    else if ('object' == typeof exports) exports["RadarAnalytics"] = factory();
    else root["RadarAnalytics"] = factory();
})(globalThis, ()=>(()=>{
        "use strict";
        var __webpack_require__ = {};
        (()=>{
            __webpack_require__.d = (exports1, definition)=>{
                for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports1, key)) Object.defineProperty(exports1, key, {
                    enumerable: true,
                    get: definition[key]
                });
            };
        })();
        (()=>{
            __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
        })();
        var __webpack_exports__ = {};
        __webpack_require__.d(__webpack_exports__, {
            default: ()=>index_0
        });
        function isObject_isObject(value) {
            var type = typeof value;
            return null != value && ('object' == type || 'function' == type);
        }
        const lodash_es_isObject = isObject_isObject;
        var isArray_isArray = Array.isArray;
        const lodash_es_isArray = isArray_isArray;
        var freeGlobal = 'object' == typeof global && global && global.Object === Object && global;
        const _freeGlobal = freeGlobal;
        var freeSelf = 'object' == typeof self && self && self.Object === Object && self;
        var root = _freeGlobal || freeSelf || Function('return this')();
        const _root = root;
        var Symbol = _root.Symbol;
        const _Symbol = Symbol;
        var objectProto = Object.prototype;
        var _getRawTag_hasOwnProperty = objectProto.hasOwnProperty;
        var nativeObjectToString = objectProto.toString;
        var symToStringTag = _Symbol ? _Symbol.toStringTag : void 0;
        function getRawTag(value) {
            var isOwn = _getRawTag_hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
            try {
                value[symToStringTag] = void 0;
                var unmasked = true;
            } catch (e) {}
            var result = nativeObjectToString.call(value);
            if (unmasked) if (isOwn) value[symToStringTag] = tag;
            else delete value[symToStringTag];
            return result;
        }
        const _getRawTag = getRawTag;
        var _objectToString_objectProto = Object.prototype;
        var _objectToString_nativeObjectToString = _objectToString_objectProto.toString;
        function objectToString(value) {
            return _objectToString_nativeObjectToString.call(value);
        }
        const _objectToString = objectToString;
        var nullTag = '[object Null]', undefinedTag = '[object Undefined]';
        var _baseGetTag_symToStringTag = _Symbol ? _Symbol.toStringTag : void 0;
        function baseGetTag(value) {
            if (null == value) return void 0 === value ? undefinedTag : nullTag;
            return _baseGetTag_symToStringTag && _baseGetTag_symToStringTag in Object(value) ? _getRawTag(value) : _objectToString(value);
        }
        const _baseGetTag = baseGetTag;
        function isObjectLike(value) {
            return null != value && 'object' == typeof value;
        }
        const lodash_es_isObjectLike = isObjectLike;
        var dateTag = '[object Date]';
        function baseIsDate(value) {
            return lodash_es_isObjectLike(value) && _baseGetTag(value) == dateTag;
        }
        const _baseIsDate = baseIsDate;
        function baseUnary(func) {
            return function(value) {
                return func(value);
            };
        }
        const _baseUnary = baseUnary;
        var freeExports = 'object' == typeof exports && exports && !exports.nodeType && exports;
        var freeModule = freeExports && 'object' == typeof module && module && !module.nodeType && module;
        var moduleExports = freeModule && freeModule.exports === freeExports;
        var freeProcess = moduleExports && _freeGlobal.process;
        var nodeUtil = function() {
            try {
                var types = freeModule && freeModule.require && freeModule.require('util').types;
                if (types) return types;
                return freeProcess && freeProcess.binding && freeProcess.binding('util');
            } catch (e) {}
        }();
        const _nodeUtil = nodeUtil;
        var nodeIsDate = _nodeUtil && _nodeUtil.isDate;
        var isDate = nodeIsDate ? _baseUnary(nodeIsDate) : _baseIsDate;
        const lodash_es_isDate = isDate;
        function extend2Lev(target, source) {
            for(const key in source)if (Object.prototype.hasOwnProperty.call(source, key)) if (lodash_es_isObject(source[key]) && lodash_es_isObject(target[key])) Object.assign(target)[key], source[key];
            else target[key] = source[key];
            return target;
        }
        function encodeDates(obj) {
            if (!lodash_es_isObject(obj) && !lodash_es_isArray(obj)) return obj;
            if (lodash_es_isArray(obj)) return obj.map(encodeDates);
            const result = {};
            for(const key in obj)if (Object.prototype.hasOwnProperty.call(obj, key)) if (lodash_es_isDate(obj[key])) result[key] = obj[key].toISOString();
            else if (lodash_es_isObject(obj[key]) || lodash_es_isArray(obj[key])) result[key] = encodeDates(obj[key]);
            else result[key] = obj[key];
            return result;
        }
        function now() {
            return Date.now();
        }
        function getRandom() {
            return Math.random();
        }
        var stringTag = '[object String]';
        function isString_isString(value) {
            return 'string' == typeof value || !lodash_es_isArray(value) && lodash_es_isObjectLike(value) && _baseGetTag(value) == stringTag;
        }
        const lodash_es_isString = isString_isString;
        function getDeviceInfo() {
            return {
                screenHeight: window.screen.height,
                screenWidth: window.screen.width,
                devicePixelRatio: window.devicePixelRatio || 1
            };
        }
        function getBrowserInfo() {
            const userAgent = navigator.userAgent.toLowerCase();
            const browserInfo = {};
            let match;
            if (match = userAgent.match(/ qq\/([\d.]+)/)) browserInfo.qqBuildinBrowser = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/mqqbrowser\/([\d.]+)/)) browserInfo.qqBrowser = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/opera.([\d.]+)/)) browserInfo.opera = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/msie ([\d.]+)/)) browserInfo.ie = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/edge.([\d.]+)/)) browserInfo.edge = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/firefox\/([\d.]+)/)) browserInfo.firefox = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/chrome\/([\d.]+)/)) browserInfo.chrome = Number(match[1].split('.')[0]);
            else if (match = userAgent.match(/version\/([\d.]+).*safari/)) browserInfo.safari = Number(match[1].match(/^\d*.\d*/));
            else if (match = userAgent.match(/trident\/([\d.]+)/)) browserInfo.ie = 11;
            return browserInfo;
        }
        function getProtocol() {
            const protocol = location.protocol;
            if ('http:' === protocol || 'https:' === protocol) return protocol;
            return 'http:';
        }
        function getReferrer(referrer) {
            let full = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
            if (lodash_es_isString(referrer)) return referrer;
            const referrerValue = document.referrer || '';
            if (full) return referrerValue;
            return referrerValue.split('?')[0];
        }
        var numberTag = '[object Number]';
        function isNumber_isNumber(value) {
            return 'number' == typeof value || lodash_es_isObjectLike(value) && _baseGetTag(value) == numberTag;
        }
        const isNumber = isNumber_isNumber;
        var boolTag = '[object Boolean]';
        function isBoolean(value) {
            return true === value || false === value || lodash_es_isObjectLike(value) && _baseGetTag(value) == boolTag;
        }
        const lodash_es_isBoolean = isBoolean;
        var asyncTag = '[object AsyncFunction]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', proxyTag = '[object Proxy]';
        function isFunction_isFunction(value) {
            if (!lodash_es_isObject(value)) return false;
            var tag = _baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
        }
        const lodash_es_isFunction = isFunction_isFunction;
        function _define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class EventEmitter {
            on(event, callback) {
                if (!lodash_es_isFunction(callback)) return;
                if (!this.events[event]) this.events[event] = [];
                this.events[event].push(callback);
            }
            once(event, callback) {
                if (!lodash_es_isFunction(callback)) return;
                if (!this.onceEvents[event]) this.onceEvents[event] = [];
                this.onceEvents[event].push(callback);
            }
            off(event, callback) {
                if (!callback) {
                    delete this.events[event];
                    delete this.onceEvents[event];
                    return;
                }
                if (this.events[event]) {
                    this.events[event] = this.events[event].filter((fn)=>fn !== callback);
                    if (0 === this.events[event].length) delete this.events[event];
                }
                if (this.onceEvents[event]) {
                    this.onceEvents[event] = this.onceEvents[event].filter((fn)=>fn !== callback);
                    if (0 === this.onceEvents[event].length) delete this.onceEvents[event];
                }
            }
            emit(event) {
                for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
                if (this.events[event]) this.events[event].forEach((callback)=>{
                    try {
                        callback(...args);
                    } catch (e) {
                        console.error(`Error in event handler for "${event}":`, e);
                    }
                });
                if (this.onceEvents[event]) {
                    const callbacks = this.onceEvents[event].slice();
                    delete this.onceEvents[event];
                    callbacks.forEach((callback)=>{
                        try {
                            callback(...args);
                        } catch (e) {
                            console.error(`Error in once event handler for "${event}":`, e);
                        }
                    });
                }
            }
            getListeners(event) {
                const normalListeners = this.events[event] || [];
                const onceListeners = this.onceEvents[event] || [];
                return [
                    ...normalListeners,
                    ...onceListeners
                ];
            }
            hasListeners(event) {
                return this.events[event] && this.events[event].length > 0 || this.onceEvents[event] && this.onceEvents[event].length > 0;
            }
            clearAllListeners() {
                this.events = {};
                this.onceEvents = {};
            }
            constructor(){
                _define_property(this, "events", {});
                _define_property(this, "onceEvents", {});
            }
        }
        function storage_define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class CookieStorage {
            isSupport() {
                return 'undefined' != typeof document && lodash_es_isFunction(document.cookie);
            }
            get(name) {
                if (!lodash_es_isString(name) || !this.isSupport()) return '';
                const nameEQ = name + '=';
                const ca = document.cookie.split(';');
                for(let i = 0; i < ca.length; i++){
                    let c = ca[i];
                    while(' ' === c.charAt(0))c = c.substring(1, c.length);
                    if (0 === c.indexOf(nameEQ)) return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
                return '';
            }
            set(name, value, days) {
                if (!lodash_es_isString(name) || !this.isSupport()) return false;
                const cdomain = this.getCookieDomain();
                const expires = days ? '; expires=' + new Date(new Date().getTime() + 24 * days * 3600000).toUTCString() : '';
                const secure = this.secure ? '; secure' : '';
                const sameSite = this.secure ? '; SameSite=None' : '';
                document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure + sameSite;
                return true;
            }
            remove(name) {
                if (!lodash_es_isString(name) || !this.isSupport()) return false;
                this.set(name, '', -1);
                return true;
            }
            getCookieDomain() {
                if (!this.crossSubdomain) return '';
                const host = document.location.hostname;
                if (this.domain) return '; domain=' + this.domain;
                if (host.match(/^\d+\.\d+\.\d+\.\d+$/)) return '';
                const domainParts = host.split('.');
                const domain = domainParts.slice(-2).join('.');
                return '; domain=.' + domain;
            }
            constructor(options = {}){
                storage_define_property(this, "domain", void 0);
                storage_define_property(this, "secure", void 0);
                storage_define_property(this, "crossSubdomain", void 0);
                this.domain = options.domain || '';
                this.secure = options.secure || false;
                this.crossSubdomain = false !== options.crossSubdomain;
            }
        }
        class LocalStorage {
            isSupport() {
                const testKey = '__sensors_test_localStorage';
                try {
                    window.localStorage.setItem(testKey, '1');
                    window.localStorage.removeItem(testKey);
                    return true;
                } catch (error) {
                    return false;
                }
            }
            get(key) {
                if (!lodash_es_isString(key) || !this.isSupport()) return '';
                try {
                    return window.localStorage.getItem(key) || '';
                } catch (error) {
                    return '';
                }
            }
            set(key, value) {
                if (!lodash_es_isString(key) || !this.isSupport()) return false;
                try {
                    window.localStorage.setItem(key, value);
                    return true;
                } catch (error) {
                    return false;
                }
            }
            remove(key) {
                if (!lodash_es_isString(key) || !this.isSupport()) return false;
                try {
                    window.localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    return false;
                }
            }
        }
        class SessionStorage {
            isSupport() {
                const testKey = '__sensors_test_sessionStorage';
                try {
                    window.sessionStorage.setItem(testKey, '1');
                    window.sessionStorage.removeItem(testKey);
                    return true;
                } catch (error) {
                    return false;
                }
            }
            get(key) {
                if (!lodash_es_isString(key) || !this.isSupport()) return '';
                try {
                    return window.sessionStorage.getItem(key) || '';
                } catch (error) {
                    return '';
                }
            }
            set(key, value) {
                if (!lodash_es_isString(key) || !this.isSupport()) return false;
                try {
                    window.sessionStorage.setItem(key, value);
                    return true;
                } catch (error) {
                    return false;
                }
            }
            remove(key) {
                if (!lodash_es_isString(key) || !this.isSupport()) return false;
                try {
                    window.sessionStorage.removeItem(key);
                    return true;
                } catch (error) {
                    return false;
                }
            }
        }
        class MemoryStorage {
            isSupport() {
                return true;
            }
            get(key) {
                if (!lodash_es_isString(key)) return '';
                return this.storage[key] || '';
            }
            set(key, value) {
                if (!lodash_es_isString(key)) return false;
                this.storage[key] = value;
                return true;
            }
            remove(key) {
                if (!lodash_es_isString(key)) return false;
                delete this.storage[key];
                return true;
            }
            constructor(){
                storage_define_property(this, "storage", {});
            }
        }
        class StorageManager {
            initStorage() {
                for (const storage of this.storages)if (storage.isSupport()) {
                    this.currentStorage = storage;
                    break;
                }
                if (!this.currentStorage) this.currentStorage = new MemoryStorage();
            }
            get(key) {
                if (!this.currentStorage) return '';
                const value = this.currentStorage.get(key);
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value || '';
                }
            }
            set(key, value, options) {
                if (!this.currentStorage) return false;
                let saveValue = value;
                if (lodash_es_isObject(value)) saveValue = JSON.stringify(value);
                return this.currentStorage.set(key, String(saveValue), options);
            }
            remove(key) {
                if (!this.currentStorage) return false;
                return this.currentStorage.remove(key);
            }
            constructor(options = {}){
                storage_define_property(this, "storages", void 0);
                storage_define_property(this, "currentStorage", null);
                this.storages = [
                    new LocalStorage(),
                    new CookieStorage(options),
                    new SessionStorage(),
                    new MemoryStorage()
                ];
                this.initStorage();
            }
        }
        function arrayMap(array, iteratee) {
            var index = -1, length = null == array ? 0 : array.length, result = Array(length);
            while(++index < length)result[index] = iteratee(array[index], index, array);
            return result;
        }
        const _arrayMap = arrayMap;
        var symbolTag = '[object Symbol]';
        function isSymbol_isSymbol(value) {
            return 'symbol' == typeof value || lodash_es_isObjectLike(value) && _baseGetTag(value) == symbolTag;
        }
        const isSymbol = isSymbol_isSymbol;
        var INFINITY = 1 / 0;
        var symbolProto = _Symbol ? _Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
        function baseToString(value) {
            if ('string' == typeof value) return value;
            if (lodash_es_isArray(value)) return _arrayMap(value, baseToString) + '';
            if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : '';
            var result = value + '';
            return '0' == result && 1 / value == -INFINITY ? '-0' : result;
        }
        const _baseToString = baseToString;
        function toString_toString(value) {
            return null == value ? '' : _baseToString(value);
        }
        const lodash_es_toString = toString_toString;
        var idCounter = 0;
        function uniqueId(prefix) {
            var id = ++idCounter;
            return lodash_es_toString(prefix) + id;
        }
        const lodash_es_uniqueId = uniqueId;
        function identity_define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class IdentityManager {
            initIdentity() {
                const storedInfo = this.storage.get(this.cookieName);
                if (storedInfo && 'object' == typeof storedInfo) {
                    if (storedInfo.identities && 'object' == typeof storedInfo.identities) this.identities = storedInfo.identities;
                    if (lodash_es_isString(storedInfo.first_id)) this.firstId = storedInfo.first_id;
                    if (lodash_es_isString(storedInfo.distinct_id)) this.distinctId = storedInfo.distinct_id;
                }
                if (!this.getAnonymousId()) this.resetAnonymousId();
                if (!this.firstId) this.firstId = this.getAnonymousId();
                if (!this.distinctId) this.distinctId = this.getAnonymousId();
                this.saveIdentities();
            }
            getAnonymousId() {
                return this.identities.$identity_anonymous_id || '';
            }
            resetAnonymousId() {
                const newId = lodash_es_uniqueId();
                this.identities.$identity_anonymous_id = newId;
                if (this.distinctId === this.getAnonymousId() || !this.distinctId) this.distinctId = newId;
                this.saveIdentities();
                return newId;
            }
            getLoginId() {
                return this.identities.$identity_login_id || '';
            }
            setLoginId(loginId) {
                let saveStorage = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : true;
                if (!lodash_es_isString(loginId) || !loginId) return;
                this.identities.$identity_login_id = loginId;
                this.distinctId = loginId;
                this.loginId = loginId;
                if (saveStorage) this.saveIdentities();
            }
            clearLoginId() {
                delete this.identities.$identity_login_id;
                this.distinctId = this.getAnonymousId();
                this.loginId = '';
                this.saveIdentities();
            }
            getDistinctId() {
                return this.distinctId || this.getAnonymousId();
            }
            getFirstId() {
                return this.firstId;
            }
            setIdentity(key, value) {
                if (!lodash_es_isString(key) || !key.startsWith('$identity_') || !lodash_es_isString(value) || !value) return;
                this.identities[key] = value;
                this.saveIdentities();
            }
            getIdentities() {
                return {
                    ...this.identities
                };
            }
            saveIdentities() {
                const identityData = {
                    distinct_id: this.distinctId,
                    first_id: this.firstId,
                    identities: this.identities
                };
                this.storage.set(this.cookieName, identityData, 730);
            }
            getUserIdentity() {
                return {
                    anonymous_id: this.getAnonymousId(),
                    login_id: this.getLoginId(),
                    distinct_id: this.getDistinctId(),
                    first_id: this.getFirstId(),
                    identities: this.getIdentities()
                };
            }
            login(loginId) {
                if (!lodash_es_isString(loginId) || !loginId) return this.getUserIdentity();
                if (this.getLoginId() === loginId) return this.getUserIdentity();
                this.setLoginId(loginId);
                return this.getUserIdentity();
            }
            logout() {
                this.clearLoginId();
                return this.getUserIdentity();
            }
            constructor(options){
                identity_define_property(this, "storage", void 0);
                identity_define_property(this, "cookieName", void 0);
                identity_define_property(this, "identities", {});
                identity_define_property(this, "firstId", '');
                identity_define_property(this, "distinctId", '');
                identity_define_property(this, "loginId", '');
                this.storage = options.storage;
                this.cookieName = options.cookieName || 'sensorsdata2015jssdkcross';
                this.initIdentity();
            }
        }
        function isSupportBeaconSend() {
            return 'object' == typeof navigator && 'function' == typeof navigator.sendBeacon;
        }
        function isSupportCors() {
            return true;
        }
        function data_sender_define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class ImageSender {
            isSupport() {
                return true;
            }
            async send(data) {
                return new Promise((resolve, reject)=>{
                    const img = new Image();
                    const timer = setTimeout(()=>{
                        if (lodash_es_isFunction(data.error)) data.error();
                        reject(new Error('Image request timeout'));
                    }, 5000);
                    img.onload = ()=>{
                        clearTimeout(timer);
                        if (lodash_es_isFunction(data.success)) data.success();
                        resolve(true);
                    };
                    img.onerror = ()=>{
                        clearTimeout(timer);
                        if (lodash_es_isFunction(data.error)) data.error();
                        reject(new Error('Image request failed'));
                    };
                    img.src = data.url;
                });
            }
            constructor(){
                data_sender_define_property(this, "name", 'image');
            }
        }
        class BeaconSender {
            isSupport() {
                return isSupportBeaconSend();
            }
            async send(data) {
                if (!this.isSupport()) throw new Error('Beacon API not supported');
                try {
                    const result = navigator.sendBeacon(data.url, data.data || '');
                    if (result && lodash_es_isFunction(data.success)) data.success();
                    else if (!result && lodash_es_isFunction(data.error)) data.error();
                    return result;
                } catch (error) {
                    if (lodash_es_isFunction(data.error)) data.error();
                    throw error;
                }
            }
            constructor(){
                data_sender_define_property(this, "name", 'beacon');
            }
        }
        class AjaxSender {
            isSupport() {
                return isSupportCors();
            }
            async send(data) {
                if (!this.isSupport()) throw new Error('CORS not supported');
                return new Promise((resolve, reject)=>{
                    var _data_headers;
                    const xhr = new XMLHttpRequest();
                    const method = (data.type || 'GET').toUpperCase();
                    const timeout = data.timeout || 5000;
                    xhr.onreadystatechange = ()=>{
                        if (4 === xhr.readyState) if (xhr.status >= 200 && xhr.status < 300) {
                            if (lodash_es_isFunction(data.success)) data.success(xhr.responseText);
                            resolve(xhr.responseText);
                        } else {
                            if (lodash_es_isFunction(data.error)) data.error(xhr.statusText);
                            reject(new Error(`HTTP error: ${xhr.status} ${xhr.statusText}`));
                        }
                    };
                    xhr.onabort = ()=>{
                        if (lodash_es_isFunction(data.error)) data.error('Request aborted');
                        reject(new Error('Request aborted'));
                    };
                    xhr.ontimeout = ()=>{
                        if (lodash_es_isFunction(data.error)) data.error('Request timeout');
                        reject(new Error('Request timeout'));
                    };
                    xhr.onerror = ()=>{
                        if (lodash_es_isFunction(data.error)) data.error('Request failed');
                        reject(new Error('Request failed'));
                    };
                    xhr.open(method, data.url, true);
                    xhr.timeout = timeout;
                    if (false !== data.credentials) xhr.withCredentials = true;
                    if ('POST' === method && !(null == (_data_headers = data.headers) ? void 0 : _data_headers['Content-Type'])) xhr.setRequestHeader('Content-Type', 'application/json');
                    if (data.headers) {
                        for(const key in data.headers)if (Object.prototype.hasOwnProperty.call(data.headers, key)) xhr.setRequestHeader(key, data.headers[key]);
                    }
                    xhr.send('POST' === method ? JSON.stringify(data.data) : null);
                });
            }
            constructor(){
                data_sender_define_property(this, "name", 'ajax');
            }
        }
        class JsonpSender {
            isSupport() {
                return true;
            }
            async send(data) {
                return new Promise((resolve, reject)=>{
                    const callbackName = data.callbackName || this.getCallbackName();
                    const url = this.addCallbackToUrl(data.url, data.callbackFunc || 'callback', callbackName);
                    const script = document.createElement("script");
                    const head = document.getElementsByTagName('head')[0];
                    const timeout = data.timeout || 5000;
                    let timer = null;
                    let removed = false;
                    window[callbackName] = (response)=>{
                        this.cleanup(callbackName, script, timer);
                        if (lodash_es_isFunction(data.success)) data.success(response);
                        resolve(response);
                    };
                    timer = window.setTimeout(()=>{
                        this.cleanup(callbackName, script, null);
                        if (lodash_es_isFunction(data.error)) data.error('Timeout');
                        reject(new Error('JSONP request timeout'));
                    }, timeout);
                    script.onerror = ()=>{
                        if (removed) return;
                        this.cleanup(callbackName, script, timer);
                        if (lodash_es_isFunction(data.error)) data.error('Script error');
                        reject(new Error('JSONP request failed'));
                    };
                    script.src = url;
                    head.appendChild(script);
                });
            }
            getCallbackName() {
                this.callbackCounter += 1;
                return this.callbackPrefix + this.callbackCounter;
            }
            addCallbackToUrl(url, callbackParam, callbackName) {
                const separator = -1 === url.indexOf('?') ? '?' : '&';
                return url + separator + callbackParam + '=' + callbackName;
            }
            cleanup(callbackName, script, timer) {
                if (timer) clearTimeout(timer);
                try {
                    if (script.parentNode) script.parentNode.removeChild(script);
                    if (lodash_es_isString(callbackName)) delete window[callbackName];
                } catch (e) {
                    console.error('JSONP cleanup error', e);
                }
            }
            constructor(){
                data_sender_define_property(this, "name", 'jsonp');
                data_sender_define_property(this, "callbackPrefix", '_sensorsdatajsonp_');
                data_sender_define_property(this, "callbackCounter", 0);
            }
        }
        class BatchSender {
            isSupport() {
                return this.sender.isSupport();
            }
            async send(data) {
                return new Promise((resolve, reject)=>{
                    this.queue.push({
                        data,
                        resolve,
                        reject
                    });
                    if (this.queue.length >= this.options.maxSize) this.flush();
                    else if (!this.timer) this.timer = window.setTimeout(()=>this.flush(), this.options.interval);
                });
            }
            flush() {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                if (0 === this.queue.length) return;
                const batch = this.queue.slice();
                this.queue = [];
                const mergedData = this.mergeData(batch.map((item)=>item.data));
                this.sender.send(mergedData).then((response)=>{
                    batch.forEach((item)=>item.resolve(response));
                }).catch((error)=>{
                    batch.forEach((item)=>item.reject(error));
                });
            }
            mergeData(dataArray) {
                return {
                    ...dataArray[0],
                    data: dataArray.map((item)=>item.data || item)
                };
            }
            constructor(sender, options = {}){
                data_sender_define_property(this, "name", 'batch');
                data_sender_define_property(this, "queue", []);
                data_sender_define_property(this, "timer", null);
                data_sender_define_property(this, "sender", void 0);
                data_sender_define_property(this, "options", void 0);
                this.sender = sender;
                this.options = {
                    maxSize: options.maxSize || 10,
                    interval: options.interval || 5000
                };
            }
        }
        class DataSenderFactory {
            registerDefaultSenders() {
                this.register(new ImageSender());
                this.register(new BeaconSender());
                this.register(new AjaxSender());
                this.register(new JsonpSender());
            }
            register(sender) {
                if (sender && sender.name) this.senders[sender.name] = sender;
            }
            getSender(name) {
                const sender = this.senders[name];
                if (sender && sender.isSupport()) return sender;
                return null;
            }
            getAvailableSender() {
                const priorities = [
                    'beacon',
                    'ajax',
                    'image'
                ];
                for (const name of priorities){
                    const sender = this.getSender(name);
                    if (sender) return sender;
                }
                return this.senders.image;
            }
            createBatchSender(name, options) {
                const sender = this.getSender(name);
                if (!sender) return null;
                return new BatchSender(sender, options);
            }
            constructor(){
                data_sender_define_property(this, "senders", {});
                this.registerDefaultSenders();
            }
        }
        function plugin_system_define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class StageProcessorImpl {
            registerInterceptor(interceptor) {
                if (!interceptor || !lodash_es_isFunction(interceptor.process)) return;
                this.interceptors.push(interceptor);
                this.sortInterceptors();
            }
            sortInterceptors() {
                this.interceptors.sort((a, b)=>{
                    const priorityA = a.priority || 0;
                    const priorityB = b.priority || 0;
                    return priorityB - priorityA;
                });
            }
            process(stageName, data) {
                if (!data || stageName !== this.name) return data;
                let result = data;
                for (const interceptor of this.interceptors)try {
                    const processed = interceptor.process(result);
                    if (false === processed || null === processed) return false;
                    if (void 0 !== processed) result = processed;
                } catch (error) {
                    console.error(`Error in interceptor ${interceptor.name || 'unknown'} at stage ${this.name}:`, error);
                }
                return result;
            }
            getInterceptors() {
                return [
                    ...this.interceptors
                ];
            }
            constructor(name){
                plugin_system_define_property(this, "name", void 0);
                plugin_system_define_property(this, "interceptors", []);
                this.name = name;
            }
        }
        class PluginManager {
            initStageProcessors() {
                this.stageProcessors = {
                    dataStage: new StageProcessorImpl('dataStage'),
                    businessStage: new StageProcessorImpl('businessStage'),
                    sendStage: new StageProcessorImpl('sendStage'),
                    viewStage: new StageProcessorImpl('viewStage')
                };
            }
            registerPlugin(plugin, config) {
                if (!plugin || !lodash_es_isString(plugin.plugin_name)) {
                    console.error('Invalid plugin format');
                    return false;
                }
                const pluginName = plugin.plugin_name;
                if (this.plugins[pluginName]) {
                    console.warn(`Plugin ${pluginName} is already registered`);
                    return false;
                }
                this.plugins[pluginName] = plugin;
                if (this.sdk.readyState && this.sdk.readyState.state > 0) this.initPlugin(pluginName, config);
                return true;
            }
            initPlugin(pluginName, config) {
                const plugin = this.plugins[pluginName];
                if (!plugin || plugin.plugin_is_init) return false;
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
            initPlugins(configs) {
                for(const pluginName in this.plugins)if (Object.prototype.hasOwnProperty.call(this.plugins, pluginName)) {
                    const config = configs ? configs[pluginName] : void 0;
                    this.initPlugin(pluginName, config);
                }
            }
            getPlugin(pluginName) {
                return this.plugins[pluginName] || null;
            }
            getAllPlugins() {
                return {
                    ...this.plugins
                };
            }
            getStageProcessor(stageName) {
                return this.stageProcessors[stageName] || null;
            }
            processStage(stageName, data) {
                const processor = this.getStageProcessor(stageName);
                if (!processor) return data;
                return processor.process(stageName, data);
            }
            registerInterceptor(stageName, interceptor) {
                const processor = this.getStageProcessor(stageName);
                if (!processor) {
                    console.error(`Stage ${stageName} does not exist`);
                    return false;
                }
                processor.registerInterceptor(interceptor);
                return true;
            }
            constructor(sdk, eventEmitter){
                plugin_system_define_property(this, "plugins", {});
                plugin_system_define_property(this, "eventEmitter", void 0);
                plugin_system_define_property(this, "sdk", void 0);
                plugin_system_define_property(this, "stageProcessors", {});
                this.sdk = sdk;
                this.eventEmitter = eventEmitter;
                this.initStageProcessors();
            }
        }
        function page_leave_define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class PageLeave {
            init() {
                this.addEventListener();
                if (true === document.hidden) this.pageShowStatus = false;
                else this.addHeartBeatInterval();
                this.log('PageLeave initialized');
            }
            addEventListener() {
                document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
                window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
                window.addEventListener('unload', this.handleUnload.bind(this));
                window.addEventListener('pagehide', this.handlePageHide.bind(this));
                this.eventEmitter.on('spa:change', this.handleSpaChange.bind(this));
                if ('hash' === this.routerMode) {
                    window.addEventListener('hashchange', this.handleHashChange.bind(this));
                    this.log('hash mode');
                } else this.log('history mode');
            }
            removeEventListener() {
                document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
                window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
                window.removeEventListener('unload', this.handleUnload.bind(this));
                window.removeEventListener('pagehide', this.handlePageHide.bind(this));
                this.eventEmitter.off('spa:change', this.handleSpaChange.bind(this));
                if ('hash' === this.routerMode) window.removeEventListener('hashchange', this.handleHashChange.bind(this));
            }
            handleVisibilityChange() {
                if (true === document.hidden) {
                    this.pageShowStatus = false;
                    this.saveHeartbeat();
                    this.clearHeartbeatInterval();
                } else {
                    this.pageShowStatus = true;
                    this.reissueHeartbeat();
                    this.addHeartBeatInterval();
                }
            }
            handleBeforeUnload() {
                this.unloadStatus = true;
                this.saveHeartbeat();
                this.trackPageLeave();
            }
            handleUnload() {
                if (!this.unloadStatus) this.trackPageLeave();
            }
            handlePageHide() {
                this.saveHeartbeat();
                if (!this.unloadStatus) this.trackPageLeave();
            }
            handleSpaChange(oldUrl, newUrl) {
                this.saveHeartbeat();
                this.trackPageLeave();
                this.resetState();
            }
            handleHashChange(event) {
                this.log('Hash route changed', {
                    oldURL: event.oldURL,
                    newURL: event.newURL
                });
                this.saveHeartbeat();
                this.trackPageLeave();
                this.resetState();
            }
            resetState() {
                this.pageId = String(getRandom()).slice(2, 5) + String(getRandom()).slice(2, 4) + String(now()).slice(-4);
                this.startTime = now();
                this.currentTime = this.startTime;
                this.unloadStatus = false;
                this.heartbeatData = {};
                if (this.pageShowStatus) this.addHeartBeatInterval();
            }
            addHeartBeatInterval() {
                this.clearHeartbeatInterval();
                this.heartbeatInterval = window.setInterval(()=>{
                    this.saveHeartbeat();
                }, this.heartbeatTime);
            }
            clearHeartbeatInterval() {
                if (null !== this.heartbeatInterval) {
                    clearInterval(this.heartbeatInterval);
                    this.heartbeatInterval = null;
                }
            }
            saveHeartbeat() {
                const currentTime = now();
                const duration = currentTime - this.currentTime;
                this.currentTime = currentTime;
                if (duration > 0) this.heartbeatData[this.currentTime] = duration;
                this.log('save heartbeat', {
                    duration,
                    currentTime: this.currentTime
                });
            }
            reissueHeartbeat() {
                const currentTime = now();
                const duration = currentTime - this.currentTime;
                this.currentTime = currentTime;
                this.log('reissue heartbeat', {
                    duration,
                    currentTime
                });
            }
            trackPageLeave() {
                const properties = this.getPageLeaveProperties();
                this.eventEmitter.emit('track', '$pageLeave', properties);
                this.log('track page leave', properties);
            }
            getPageLeaveProperties() {
                const currentTime = now();
                const totalDuration = currentTime - this.startTime;
                let stayTime = 0;
                for(const time in this.heartbeatData)if (Object.prototype.hasOwnProperty.call(this.heartbeatData, time)) stayTime += this.heartbeatData[time];
                if (0 === stayTime) stayTime = totalDuration;
                return {
                    $page_id: this.pageId,
                    $duration: Math.round(stayTime / 1000),
                    $url: window.location.href,
                    $url_path: window.location.pathname,
                    $title: document.title
                };
            }
            log(message, data) {
                if (this.debug) console.log(`[PageLeave] ${message}`, data || '');
            }
            destroy() {
                this.clearHeartbeatInterval();
                this.removeEventListener();
                this.log('PageLeave destroyed');
            }
            constructor(sdk, eventEmitter, options = {}){
                page_leave_define_property(this, "sdk", void 0);
                page_leave_define_property(this, "eventEmitter", void 0);
                page_leave_define_property(this, "pageId", void 0);
                page_leave_define_property(this, "startTime", void 0);
                page_leave_define_property(this, "currentTime", void 0);
                page_leave_define_property(this, "heartbeatInterval", null);
                page_leave_define_property(this, "heartbeatTime", 5000);
                page_leave_define_property(this, "pageShowStatus", true);
                page_leave_define_property(this, "unloadStatus", false);
                page_leave_define_property(this, "heartbeatData", {});
                page_leave_define_property(this, "debug", false);
                page_leave_define_property(this, "routerMode", 'history');
                this.sdk = sdk;
                this.eventEmitter = eventEmitter;
                this.debug = options.debug || false;
                this.routerMode = options.routerMode || 'history';
                this.pageId = String(getRandom()).slice(2, 5) + String(getRandom()).slice(2, 4) + String(now()).slice(-4);
                this.startTime = now();
                this.currentTime = this.startTime;
                this.init();
            }
        }
        function radar_analytics_define_property(obj, key, value) {
            if (key in obj) Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
            else obj[key] = value;
            return obj;
        }
        class RadarAnalytics {
            initConfig(config) {
                const defaultConfig = {
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
            initPresetProperties() {
                var _this_config;
                const presetProps = null == (_this_config = this.config) ? void 0 : _this_config.preset_properties;
                if (!lodash_es_isObject(presetProps)) return;
                if (false !== presetProps.$device_info) this.presetProperties.$device_info = getDeviceInfo();
                if (false !== presetProps.$browser_info) this.presetProperties.$browser_info = getBrowserInfo();
                if (false !== presetProps.$protocol) this.presetProperties.$protocol = getProtocol();
                if (false !== presetProps.latest_referrer) this.presetProperties.$latest_referrer = getReferrer();
                if (false !== presetProps.latest_referrer_host && this.presetProperties.$latest_referrer) try {
                    this.presetProperties.$latest_referrer_host = new URL(this.presetProperties.$latest_referrer).hostname;
                } catch (e) {
                    this.presetProperties.$latest_referrer_host = '';
                }
                if (false !== presetProps.$first_visit_time) {
                    const firstVisitTime = this.storageManager.get('$first_visit_time');
                    if (firstVisitTime) this.presetProperties.$first_visit_time = firstVisitTime;
                    else {
                        const currentTime = now();
                        this.storageManager.set('$first_visit_time', currentTime);
                        this.presetProperties.$first_visit_time = currentTime;
                    }
                }
                if (false !== presetProps.$first_referrer) {
                    const firstReferrer = this.storageManager.get('$first_referrer');
                    if (firstReferrer) this.presetProperties.$first_referrer = firstReferrer;
                    else {
                        const currentReferrer = getReferrer();
                        this.storageManager.set('$first_referrer', currentReferrer);
                        this.presetProperties.$first_referrer = currentReferrer;
                    }
                }
                if (false !== presetProps.$first_referrer_host) {
                    const firstReferrerHost = this.storageManager.get('$first_referrer_host');
                    if (!firstReferrerHost && this.presetProperties.$first_referrer) try {
                        const host = new URL(this.presetProperties.$first_referrer).hostname;
                        this.storageManager.set('$first_referrer_host', host);
                        this.presetProperties.$first_referrer_host = host;
                    } catch (e) {
                        this.presetProperties.$first_referrer_host = '';
                    }
                    else this.presetProperties.$first_referrer_host = firstReferrerHost;
                }
            }
            getPresetProperties() {
                var _this_config_preset_properties, _this_config, _this_config_preset_properties1, _this_config1;
                const properties = {
                    ...this.presetProperties
                };
                if ((null == (_this_config = this.config) ? void 0 : null == (_this_config_preset_properties = _this_config.preset_properties) ? void 0 : _this_config_preset_properties.url) !== false) properties.$url = window.location.href;
                if ((null == (_this_config1 = this.config) ? void 0 : null == (_this_config_preset_properties1 = _this_config1.preset_properties) ? void 0 : _this_config_preset_properties1.title) !== false) properties.$title = document.title;
                return properties;
            }
            getCommonProperties() {
                const properties = {};
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
            processProperties(properties) {
                var _this_config;
                if (!lodash_es_isObject(properties)) return {};
                const result = {};
                const maxLength = (null == (_this_config = this.config) ? void 0 : _this_config.max_string_length) || 500;
                for(const key in properties){
                    if (!Object.prototype.hasOwnProperty.call(properties, key)) continue;
                    if ('$' === key.charAt(0) && !this.isValidPresetProperty(key)) continue;
                    let value = properties[key];
                    if (lodash_es_isString(value)) {
                        if (value.length > maxLength) value = value.slice(0, maxLength);
                        result[key] = value;
                    } else if (isNumber(value) || lodash_es_isBoolean(value)) result[key] = value;
                    else if (lodash_es_isDate(value)) result[key] = value.toISOString();
                    else if (lodash_es_isArray(value)) result[key] = value;
                    else if (lodash_es_isObject(value)) try {
                        const jsonStr = JSON.stringify(value);
                        if (jsonStr.length > maxLength) result[key] = JSON.stringify(value, null, 0).slice(0, maxLength);
                        else result[key] = value;
                    } catch (e) {
                        result[key] = String(value).slice(0, maxLength);
                    }
                    else result[key] = String(value).slice(0, maxLength);
                }
                return result;
            }
            isValidPresetProperty(property) {
                const validProperties = [
                    '$url',
                    '$title',
                    '$referrer',
                    '$referrer_host',
                    '$url_path',
                    '$device_info',
                    '$browser_info',
                    '$protocol',
                    '$latest_referrer',
                    '$latest_referrer_host',
                    '$first_visit_time',
                    '$first_referrer',
                    '$first_referrer_host',
                    '$lib',
                    '$lib_version',
                    '$lib_method',
                    '$time',
                    '$screen_height',
                    '$screen_width',
                    '$viewport_width',
                    '$viewport_height',
                    '$device_id',
                    '$user_agent'
                ];
                return -1 !== validProperties.indexOf(property);
            }
            prepareEventData(type, event) {
                let properties = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                const commonProps = this.getCommonProperties();
                const eventProps = this.processProperties(properties);
                const mergedProps = Object.assign({}, commonProps, eventProps);
                const eventData = {
                    type,
                    event,
                    properties: mergedProps,
                    distinct_id: this.identityManager.getDistinctId(),
                    time: now()
                };
                const firstId = this.identityManager.getFirstId();
                if (firstId && firstId !== eventData.distinct_id) eventData.first_id = firstId;
                eventData.identities = this.identityManager.getIdentities();
                return eventData;
            }
            sendEventData(eventData) {
                var _this_config;
                const dataStageResult = this.pluginManager.processStage('dataStage', eventData);
                if (false === dataStageResult) return void this.log('Event intercepted at dataStage', eventData);
                const businessStageResult = this.pluginManager.processStage('businessStage', dataStageResult);
                if (false === businessStageResult) return void this.log('Event intercepted at businessStage', dataStageResult);
                const sendStageResult = this.pluginManager.processStage('sendStage', businessStageResult);
                if (false === sendStageResult) return void this.log('Event intercepted at sendStage', businessStageResult);
                const data = this.formatData(sendStageResult);
                const sender = this.dataSenderFactory.getSender((null == (_this_config = this.config) ? void 0 : _this_config.send_type) || 'image');
                if (!sender) {
                    var _this_config1;
                    this.log('No available sender', {
                        sendType: null == (_this_config1 = this.config) ? void 0 : _this_config1.send_type
                    });
                    return;
                }
                const url = this.buildRequestUrl(data);
                sender.send({
                    url
                }).then(()=>{
                    this.log('Event sent successfully', {
                        event: eventData.event,
                        url
                    });
                }).catch((error)=>{
                    this.log('Event sending failed', {
                        event: eventData.event,
                        error
                    });
                });
            }
            formatData(eventData) {
                const data = encodeDates(eventData);
                const jsonData = JSON.stringify(data);
                const base64Data = btoa(encodeURIComponent(jsonData).replace(/%([0-9A-F]{2})/g, (match, p1)=>String.fromCharCode(parseInt(p1, 16))));
                return {
                    data: base64Data,
                    gzip: 0
                };
            }
            buildRequestUrl(data) {
                var _this_config;
                const serverUrl = null == (_this_config = this.config) ? void 0 : _this_config.server_url;
                const separator = (null == serverUrl ? void 0 : serverUrl.indexOf('?')) !== -1 ? '&' : '?';
                return `${serverUrl}${separator}data=${data.data}&gzip=${data.gzip}`;
            }
            log(message, data) {
                if (this.isDebug) console.log(`[SensorsData] ${message}`, data || '');
            }
            get readyState() {
                return {
                    ...this._readyState
                };
            }
            debug(debug) {
                this.isDebug = debug;
                if (this.config) this.config.is_debug = debug;
            }
            on(event, callback) {
                this.eventEmitter.on(event, callback);
            }
            off(event, callback) {
                this.eventEmitter.off(event, callback);
            }
            once(event, callback) {
                this.eventEmitter.once(event, callback);
            }
            emit(event) {
                for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
                this.eventEmitter.emit(event, ...args);
            }
            track(event, properties) {
                if (!lodash_es_isString(event) || !event) return void this.log('Invalid event name', {
                    event
                });
                const eventData = this.prepareEventData('track', event, properties);
                this.sendEventData(eventData);
            }
            trackPageView(properties) {
                this.track('$pageview', properties);
            }
            trackSignup(distinctId, properties) {
                if (!lodash_es_isString(distinctId) || !distinctId) return void this.log('Invalid user ID', {
                    distinctId
                });
                const eventData = this.prepareEventData('track_signup', '$SignUp', properties);
                eventData.distinct_id = distinctId;
                this.sendEventData(eventData);
                this.identityManager.login(distinctId);
            }
            setProfile(properties) {
                if (!lodash_es_isObject(properties) || 0 === Object.keys(properties).length) return void this.log('Invalid user properties', {
                    properties
                });
                const eventData = this.prepareEventData('profile_set', '$profile_set', properties);
                this.sendEventData(eventData);
            }
            setOnceProfile(properties) {
                if (!lodash_es_isObject(properties) || 0 === Object.keys(properties).length) return void this.log('Invalid user properties', {
                    properties
                });
                const eventData = this.prepareEventData('profile_set_once', '$profile_set_once', properties);
                this.sendEventData(eventData);
            }
            appendProfile(properties) {
                if (!lodash_es_isObject(properties) || 0 === Object.keys(properties).length) return void this.log('Invalid user properties', {
                    properties
                });
                const eventData = this.prepareEventData('profile_append', '$profile_append', properties);
                this.sendEventData(eventData);
            }
            incrementProfile(properties) {
                if (!lodash_es_isObject(properties) || 0 === Object.keys(properties).length) return void this.log('Invalid user properties', {
                    properties
                });
                const eventData = this.prepareEventData('profile_increment', '$profile_increment', properties);
                this.sendEventData(eventData);
            }
            deleteProfile() {
                const eventData = this.prepareEventData('profile_delete', '$profile_delete');
                this.sendEventData(eventData);
            }
            unsetProfile(properties) {
                let props = {};
                if (lodash_es_isArray(properties)) properties.forEach((prop)=>{
                    if (lodash_es_isString(prop)) props[prop] = true;
                });
                else if (lodash_es_isObject(properties)) props = properties;
                if (0 === Object.keys(props).length) return void this.log('Invalid user properties', {
                    properties
                });
                const eventData = this.prepareEventData('profile_unset', '$profile_unset', props);
                this.sendEventData(eventData);
            }
            identify(distinctId) {
                if (!lodash_es_isString(distinctId) || !distinctId) return void this.log('Invalid user ID', {
                    distinctId
                });
                this.identityManager.setIdentity('$identity_anonymous_id', distinctId);
            }
            resetAnonymousIdentity() {
                return this.identityManager.resetAnonymousId();
            }
            login(loginId) {
                if (!lodash_es_isString(loginId) || !loginId) return void this.log('Invalid login ID', {
                    loginId
                });
                this.identityManager.login(loginId);
            }
            loginWithKey(keyName, loginId) {
                if (!lodash_es_isString(keyName) || !keyName.startsWith('$identity_') || !lodash_es_isString(loginId) || !loginId) return void this.log('Invalid key name or login ID', {
                    keyName,
                    loginId
                });
                this.identityManager.setIdentity(keyName, loginId);
            }
            logout() {
                this.identityManager.logout();
            }
            register(properties) {
                if (!lodash_es_isObject(properties)) return void this.log('Invalid public properties', {
                    properties
                });
                Object.assign(this.registerProperties, properties);
            }
            registerOnce(properties) {
                if (!lodash_es_isObject(properties)) return void this.log('Invalid public properties', {
                    properties
                });
                for(const key in properties)if (Object.prototype.hasOwnProperty.call(properties, key) && !Object.prototype.hasOwnProperty.call(this.registerProperties, key)) this.registerProperties[key] = properties[key];
            }
            registerPage(properties) {
                if (!lodash_es_isObject(properties)) return void this.log('Invalid page public properties', {
                    properties
                });
                Object.assign(this.pageRegisterProperties, properties);
            }
            registerPageOnce(properties) {
                if (!lodash_es_isObject(properties)) return void this.log('Invalid page public properties', {
                    properties
                });
                for(const key in properties)if (Object.prototype.hasOwnProperty.call(properties, key) && !Object.prototype.hasOwnProperty.call(this.pageRegisterProperties, key)) this.pageRegisterProperties[key] = properties[key];
            }
            registerSession(properties) {
                if (!lodash_es_isObject(properties)) return void this.log('Invalid session public properties', {
                    properties
                });
                Object.assign(this.sessionRegisterProperties, properties);
            }
            registerSessionOnce(properties) {
                if (!lodash_es_isObject(properties)) return void this.log('Invalid session public properties', {
                    properties
                });
                for(const key in properties)if (Object.prototype.hasOwnProperty.call(properties, key) && !Object.prototype.hasOwnProperty.call(this.sessionRegisterProperties, key)) this.sessionRegisterProperties[key] = properties[key];
            }
            clearAllRegister() {
                this.registerProperties = {};
                this.pageRegisterProperties = {};
                this.sessionRegisterProperties = {};
            }
            clearPageRegister() {
                this.pageRegisterProperties = {};
            }
            getDistinctId() {
                return this.identityManager.getDistinctId();
            }
            getFirstId() {
                return this.identityManager.getFirstId();
            }
            registerPlugin(plugin, config) {
                return this.pluginManager.registerPlugin(plugin, config);
            }
            getPlugin(pluginName) {
                return this.pluginManager.getPlugin(pluginName);
            }
            constructor(config){
                var _this_config, _this_config1, _this_config2, _this_config3, _this_config4, _this_config5, _this_config6, _this_config7, _this_config8;
                radar_analytics_define_property(this, "VERSION", '1.0.0');
                radar_analytics_define_property(this, "config", null);
                radar_analytics_define_property(this, "eventEmitter", void 0);
                radar_analytics_define_property(this, "storageManager", void 0);
                radar_analytics_define_property(this, "identityManager", void 0);
                radar_analytics_define_property(this, "dataSenderFactory", void 0);
                radar_analytics_define_property(this, "pluginManager", void 0);
                radar_analytics_define_property(this, "pageLeave", null);
                radar_analytics_define_property(this, "_readyState", {
                    state: 0,
                    stateInfo: {}
                });
                radar_analytics_define_property(this, "presetProperties", {});
                radar_analytics_define_property(this, "registerProperties", {});
                radar_analytics_define_property(this, "pageRegisterProperties", {});
                radar_analytics_define_property(this, "sessionRegisterProperties", {});
                radar_analytics_define_property(this, "isDebug", false);
                this.initConfig(config);
                this.eventEmitter = new EventEmitter();
                this.storageManager = new StorageManager({
                    domain: null == (_this_config = this.config) ? void 0 : _this_config.cross_subdomain_domain,
                    secure: null == (_this_config1 = this.config) ? void 0 : _this_config1.secure_cookie,
                    crossSubdomain: null == (_this_config2 = this.config) ? void 0 : _this_config2.cross_subdomain
                });
                this.identityManager = new IdentityManager({
                    storage: this.storageManager,
                    cookieName: null == (_this_config3 = this.config) ? void 0 : _this_config3.cookie_name,
                    cookieDomain: null == (_this_config4 = this.config) ? void 0 : _this_config4.cross_subdomain_domain,
                    crossSubdomain: null == (_this_config5 = this.config) ? void 0 : _this_config5.cross_subdomain
                });
                this.dataSenderFactory = new DataSenderFactory();
                this.pluginManager = new PluginManager(this, this.eventEmitter);
                this._readyState.state = 1;
                this.initPresetProperties();
                if (null == (_this_config6 = this.config) ? void 0 : _this_config6.track_page_leave) this.pageLeave = new PageLeave(this, this.eventEmitter, {
                    debug: this.isDebug
                });
                this._readyState.state = 2;
                this.eventEmitter.emit('ready');
                this.pluginManager.initPlugins(null == (_this_config7 = this.config) ? void 0 : _this_config7.plugins);
                if (null == (_this_config8 = this.config) ? void 0 : _this_config8.is_track_page_view) this.trackPageView();
                this.log('SDK initialized', this.config);
            }
        }
        let radarAnalytic = null;
        async function init(config) {
            if ('undefined' != typeof window) {
                radarAnalytic = new RadarAnalytics(config);
                if (window) window.radarAnalytic = radarAnalytic;
                return radarAnalytic;
            }
            return null;
        }
        function getInstance() {
            return radarAnalytic;
        }
        const index_0 = {
            init,
            getInstance
        };
        __webpack_exports__ = __webpack_exports__["default"];
        return __webpack_exports__;
    })());
