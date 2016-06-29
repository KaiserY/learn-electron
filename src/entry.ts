import { bootstrap } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app';

import "../node_modules/codemirror/addon/comment/comment.js";
import "./js/codemirror-mode-hosts.js";
import "../node_modules/material-design-lite/material.min.js";

export function main(initialHmrState?: any): Promise<any> {
  return bootstrap(AppComponent).catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => main());
