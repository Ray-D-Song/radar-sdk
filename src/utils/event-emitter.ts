import { isFunction } from 'lodash-es';
import { EventEmitter as EventEmitterInterface } from '../interfaces';

export class EventEmitter implements EventEmitterInterface {
  private events: Record<string, Function[]> = {};
  private onceEvents: Record<string, Function[]> = {};

  
  on(event: string, callback: Function): void {
    if (!isFunction(callback)) {
      return;
    }

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  
  once(event: string, callback: Function): void {
    if (!isFunction(callback)) {
      return;
    }

    if (!this.onceEvents[event]) {
      this.onceEvents[event] = [];
    }

    this.onceEvents[event].push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      delete this.events[event];
      delete this.onceEvents[event];
      return;
    }

    if (this.events[event]) {
      this.events[event] = this.events[event].filter(fn => fn !== callback);
      if (this.events[event].length === 0) {
        delete this.events[event];
      }
    }

    if (this.onceEvents[event]) {
      this.onceEvents[event] = this.onceEvents[event].filter(fn => fn !== callback);
      if (this.onceEvents[event].length === 0) {
        delete this.onceEvents[event];
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(...args);
        } catch (e) {
          console.error(`Error in event handler for "${event}":`, e);
        }
      });
    }

    if (this.onceEvents[event]) {
      const callbacks = this.onceEvents[event].slice();
      delete this.onceEvents[event];
      
      callbacks.forEach(callback => {
        try {
          callback(...args);
        } catch (e) {
          console.error(`Error in once event handler for "${event}":`, e);
        }
      });
    }
  }

  getListeners(event: string): Function[] {
    const normalListeners = this.events[event] || [];
    const onceListeners = this.onceEvents[event] || [];
    
    return [...normalListeners, ...onceListeners];
  }

  hasListeners(event: string): boolean {
    return (
      (this.events[event] && this.events[event].length > 0) ||
      (this.onceEvents[event] && this.onceEvents[event].length > 0)
    );
  }

  clearAllListeners(): void {
    this.events = {};
    this.onceEvents = {};
  }
}
