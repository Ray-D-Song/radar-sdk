import { getRandom, now } from '../utils/common';
import { EventEmitter } from '../utils/event-emitter';
import { RadarAnalytics } from './radar-analytics';

interface Options {
  debug?: boolean;
  routerMode?: 'hash' | 'history';
}

export class PageLeave {
  private sdk: RadarAnalytics;
  private eventEmitter: EventEmitter;
  private pageId: string;
  private startTime: number;
  private currentTime: number;
  private heartbeatInterval: number | null = null;
  private heartbeatTime: number = 5000;
  private pageShowStatus: boolean = true;
  private unloadStatus: boolean = false;
  private heartbeatData: Record<string, any> = {};
  private debug: boolean = false;
  private routerMode: 'hash' | 'history' = 'history';

  constructor(sdk: RadarAnalytics, eventEmitter: EventEmitter, options: Options = {}) {
    this.sdk = sdk;
    this.eventEmitter = eventEmitter;
    this.debug = options.debug || false;
    this.routerMode = options.routerMode || 'history';

    this.pageId = String(getRandom()).slice(2, 5) +
      String(getRandom()).slice(2, 4) +
      String(now()).slice(-4);

    this.startTime = now();
    this.currentTime = this.startTime;

    this.init();
  }

  private init(): void {
    this.addEventListener();

    if (document.hidden === true) {
      this.pageShowStatus = false;
    } else {
      this.addHeartBeatInterval();
    }

    this.log('PageLeave initialized');
  }

  private addEventListener(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    window.addEventListener('unload', this.handleUnload.bind(this));

    window.addEventListener('pagehide', this.handlePageHide.bind(this));

    this.eventEmitter.on('spa:change', this.handleSpaChange.bind(this));

    if (this.routerMode === 'hash') {
      window.addEventListener('hashchange', this.handleHashChange.bind(this));
      this.log('hash mode');
    } else {
      this.log('history mode');
    }
  }

  private removeEventListener(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    window.removeEventListener('unload', this.handleUnload.bind(this));
    window.removeEventListener('pagehide', this.handlePageHide.bind(this));

    this.eventEmitter.off('spa:change', this.handleSpaChange.bind(this));

    if (this.routerMode === 'hash') {
      window.removeEventListener('hashchange', this.handleHashChange.bind(this));
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden === true) {
      this.pageShowStatus = false;
      this.saveHeartbeat();
      this.clearHeartbeatInterval();
    } else {
      this.pageShowStatus = true;
      this.reissueHeartbeat();
      this.addHeartBeatInterval();
    }
  }

  private handleBeforeUnload(): void {
    this.unloadStatus = true;
    this.saveHeartbeat();
    this.trackPageLeave();
  }

  private handleUnload(): void {
    if (!this.unloadStatus) {
      this.trackPageLeave();
    }
  }

  private handlePageHide(): void {
    this.saveHeartbeat();

    if (!this.unloadStatus) {
      this.trackPageLeave();
    }
  }

  private handleSpaChange(oldUrl: string, newUrl: string): void {
    this.saveHeartbeat();
    this.trackPageLeave();

    this.resetState();
  }

  private handleHashChange(event: HashChangeEvent): void {
    this.log('Hash route changed', {
      oldURL: event.oldURL,
      newURL: event.newURL
    });

    this.saveHeartbeat();
    this.trackPageLeave();

    this.resetState();
  }

  private resetState(): void {
    this.pageId = String(getRandom()).slice(2, 5) +
      String(getRandom()).slice(2, 4) +
      String(now()).slice(-4);

    this.startTime = now();
    this.currentTime = this.startTime;
    this.unloadStatus = false;
    this.heartbeatData = {};

    if (this.pageShowStatus) {
      this.addHeartBeatInterval();
    }
  }

  private addHeartBeatInterval(): void {
    this.clearHeartbeatInterval();

    this.heartbeatInterval = window.setInterval(() => {
      this.saveHeartbeat();
    }, this.heartbeatTime);
  }

  private clearHeartbeatInterval(): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private saveHeartbeat(): void {
    const currentTime = now();
    const duration = currentTime - this.currentTime;

    this.currentTime = currentTime;

    if (duration > 0) {
      this.heartbeatData[this.currentTime] = duration;
    }

    this.log('save heartbeat', { duration, currentTime: this.currentTime });
  }

  private reissueHeartbeat(): void {
    const currentTime = now();
    const duration = currentTime - this.currentTime;

    this.currentTime = currentTime;

    this.log('reissue heartbeat', { duration, currentTime });
  }

  private trackPageLeave(): void {
    const properties = this.getPageLeaveProperties();

    this.eventEmitter.emit('track', '$pageLeave', properties);

    this.log('track page leave', properties);
  }
  private getPageLeaveProperties(): Record<string, any> {
    const currentTime = now();
    const totalDuration = currentTime - this.startTime;

    let stayTime = 0;
    for (const time in this.heartbeatData) {
      if (Object.prototype.hasOwnProperty.call(this.heartbeatData, time)) {
        stayTime += this.heartbeatData[time];
      }
    }

    if (stayTime === 0) {
      stayTime = totalDuration;
    }

    return {
      $page_id: this.pageId,
      $duration: Math.round(stayTime / 1000),
      $url: window.location.href,
      $url_path: window.location.pathname,
      $title: document.title
    };
  }

  private log(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[PageLeave] ${message}`, data || '');
    }
  }

  destroy(): void {
    this.clearHeartbeatInterval();
    this.removeEventListener();
    this.log('PageLeave destroyed');
  }
}
