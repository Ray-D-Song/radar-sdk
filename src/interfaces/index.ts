export interface RadarDataConfig {
  // Server URL
  server_url: string;
  // Whether to enable debug mode
  is_debug?: boolean;
  // Whether to enable cross-subdomain tracking
  cross_subdomain?: boolean;
  // Data sending method: 'image'|'ajax'|'beacon'|'batch'
  send_type?: string;
  // Whether to enable heatmap
  heatmap?: boolean | Record<string, any>;
  // Maximum string length
  max_string_length?: number;
  // Whether to automatically collect first visit time
  preset_properties?: Record<string, any>;
  // Whether to automatically collect page view events for single-page applications
  is_track_single_page?: boolean;
  // Whether to automatically collect page view events
  is_track_page_view?: boolean;
  // Whether to automatically collect link click events
  is_track_link_click?: boolean;
  // Whether to enable compliance mode
  is_compliance_enabled?: boolean;
  // App Bridge configuration
  app_js_bridge?: boolean | Record<string, any>;
  // Other configuration items
  [key: string]: any;
}

export interface EventProperties {
  [key: string]: any;
}
export interface UserProperties {
  [key: string]: any;
}

// Event data interface
export interface EventData {
  // Event type
  type: string;
  // Event name
  event: string;
  // Event properties
  properties: EventProperties;
  // Event time
  time?: number | Date;
  // Whether to send immediately
  immediate?: boolean;
  // User identifier
  distinct_id?: string;
  // First visit ID
  first_id?: string;
  // Identity ID mapping
  identities?: Record<string, string>;
  // Other data
  [key: string]: any;
}

// User identity interface
export interface UserIdentity {
  // Anonymous ID
  anonymous_id?: string;
  // Login ID
  login_id?: string;
  // User ID
  distinct_id: string;
  // First visit ID
  first_id?: string;
  // Identity ID mapping
  identities?: Record<string, string>;
}

// Plugin interface
export interface SensorsPlugin {
  // Plugin name
  plugin_name: string;
  // Plugin version
  plugin_version: string;
  // Plugin initialization method
  init: (sdk: any, config?: any) => void;
  // Whether the plugin has been initialized
  plugin_is_init?: boolean;
  // Other methods
  [key: string]: any;
}

// Interceptor interface
export interface Interceptor {
  // Interceptor name
  name: string;
  // Interceptor processing method
  process: (data: any) => any;
  // Interceptor priority
  priority?: number;
}

// Stage processor interface
export interface StageProcessor {
  // Register interceptor
  registerInterceptor: (interceptor: Interceptor) => void;
  // Process data
  process: (stageName: string, data: any) => any;
}

// Storage interface
export interface Storage {
  // Whether this storage method is supported
  isSupport: () => boolean;
  // Get storage item
  get: (key: string) => any;
  // Set storage item
  set: (key: string, value: any, options?: any) => boolean;
  // Remove storage item
  remove: (key: string) => boolean;
}

// Event emitter interface
export interface EventEmitter {
  // Bind event
  on: (event: string, callback: Function) => void;
  // Unbind event
  off: (event: string, callback?: Function) => void;
  // Trigger event
  emit: (event: string, ...args: any[]) => void;
  // Bind one-time event
  once: (event: string, callback: Function) => void;
}

// Data sender interface
export interface DataSender {
  // Sender name
  name: string;
  // Whether this sending method is supported
  isSupport: () => boolean;
  // Send data
  send: (data: any) => Promise<any>;
}
