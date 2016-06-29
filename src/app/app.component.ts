import { Component, ViewEncapsulation } from '@angular/core';
import { HostsService } from './hosts.service';

import * as fs from 'fs';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.Emulated,
  providers: [HostsService],
  styles: [
    String(require('../roboto.css')),
    String(require('../../node_modules/material-design-icons/iconfont/material-icons.css')),
    String(require('../vendor/material.min.css')),
    String(require('../../node_modules/codemirror/lib/codemirror.css')),
    String(require('./app.style.css'))
  ],
  templateUrl: './app.template.html'
})
export class AppComponent {

  hostsPath: string = 'the hosts file path...';
  textarea: HTMLTextAreaElement;
  appCodeMirror: CodeMirror.EditorFromTextArea;

  icons = [
    {
      badge: "0",
      name: "account_box"
    }, {
      badge: "1",
      name: "account_box"
    }, {
      badge: "2",
      name: "account_box"
    }
  ];

  constructor(private heroService: HostsService) { }

  ngOnInit() {
    this.textarea = <HTMLTextAreaElement>document.getElementById("app-editor");

    this.hostsPath = this.heroService.getHostsPath();

    fs.readFile(this.hostsPath, 'utf-8', (err, data) => {
      var text;
      if (err) {
        text = 'error: ' + err;
        console.error(text);
      } else {
        text = data;
      };

      this.appCodeMirror = CodeMirror.fromTextArea(this.textarea, {
        mode: 'hosts',
        lineNumbers: true,
        tabSize: 8
      });

      this.appCodeMirror.getDoc().setValue(text);
      this.appCodeMirror.getDoc().clearHistory();

      this.appCodeMirror.setOption("extraKeys", {
        "Ctrl-/": (cm) => {
          cm.toggleComment();
        },
        "Ctrl-S": (cm) => {
          this.heroService.saveHosts(this.removeTrailingNewline(cm.getValue()));
        }
      });
    });

    console.log('Initial App');
  }

  onSave() {
    var text = this.removeTrailingNewline(this.appCodeMirror.getValue());
    this.heroService.saveHosts(text);
  }

  removeTrailingNewline(content: string): string {
    return content.replace(/^\s+|\s+$/g, "");
  }
}
