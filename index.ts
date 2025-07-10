import { RadarAnalytics } from './src/core/radar-analytics';

declare global {
  interface Window {
    radarAnalytic: RadarAnalytics;
  }
}

let radarAnalytic: RadarAnalytics | null = null;

export async function init(config: any): Promise<null | RadarAnalytics> {
  if (typeof window !== 'undefined') {
    radarAnalytic = new RadarAnalytics(config);
    
    if (window) {
      window.radarAnalytic = radarAnalytic;
    }
    
    return radarAnalytic;
  }
  return null;
}

export function getInstance(): RadarAnalytics | null {
  return radarAnalytic;
}

export default {
  init,
  getInstance
};