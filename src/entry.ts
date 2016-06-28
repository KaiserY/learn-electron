import { bootstrap } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app';

export function main(initialHmrState?: any): Promise<any> {
  return bootstrap(AppComponent).catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => main());
