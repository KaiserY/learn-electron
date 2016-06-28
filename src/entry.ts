import { bootstrap } from '@angular/platform-browser-dynamic';

import { App } from './app';

export function main(initialHmrState?: any): Promise<any> {
  return bootstrap(App).catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => main());
