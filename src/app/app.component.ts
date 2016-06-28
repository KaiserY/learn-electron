import { Component, ViewEncapsulation } from '@angular/core';

import * as fs from 'fs';
import * as os from 'os';
import * as CodeMirror from 'codemirror';
import * as $ from 'jquery';

import "../../node_modules/codemirror/addon/comment/comment.js";
import "../js/codemirror-mode-hosts.js";
import "../../node_modules/material-design-lite/material.min.js";

var sudo = require('electron-sudo');

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [
    String(require('../roboto.css')),
    String(require('../../node_modules/material-design-icons/iconfont/material-icons.css')),
    String(require('../vendor/material.min.css')),
    String(require('../../node_modules/codemirror/lib/codemirror.css')),
    String(require('./app.style.css'))
  ],
  templateUrl: './app.template.html'
})
export class App {

  hostsPath: string = '/etc/hosts';
  textarea: HTMLTextAreaElement;
  appCodeMirror: CodeMirror.EditorFromTextArea;
  sudoOptions = {
    name: 'test'
  };

  ngOnInit() {
    this.textarea = <HTMLTextAreaElement>document.getElementById("app-editor");

    switch (os.platform()) {
      case 'win32':
        this.hostsPath = process.env.WINDIR + '\\System32\\drivers\\etc\\hosts';
        break;
      case 'linux':
        this.hostsPath = '/etc/hosts';
        break;
    };

    $('#app-card-title').text(this.hostsPath);

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

      this.appCodeMirror.setValue(text);
      this.appCodeMirror.getDoc().clearHistory();

      this.appCodeMirror.setOption("extraKeys", {
        "Ctrl-/": (cm) => {
          cm.toggleComment();
        },
        "Ctrl-S": (cm) => {
          this.saveHosts(cm.getValue());
        }
      });
    });

    $('#app-card-save').click(() => {
      var text = this.appCodeMirror.getValue();
      this.saveHosts(text);
    });

    console.log('Initial App');
  }

  saveHosts(hostsContent) {
    switch (os.platform()) {
      case 'win32':
        var tmpFile = process.env.temp + '\\tmp-hosts';
        fs.writeFile(tmpFile, hostsContent, (error) => {
          if (error) {
            console.error('sudo error: ' + error);
          } else {
            var cmd = 'xcopy /s /y ' + tmpFile + ' ' + this.hostsPath;
            sudo.exec(cmd, this.sudoOptions, (error) => {
              if (error) {
                console.error('sudo error: ' + error);
              } else {
                console.log('sudo done!');
              }
            });
          }
        });
        break;
      case 'linux':
        var cmd = 'bash -c \'echo "' + hostsContent + '" | tee ' + this.hostsPath + '\'';
        sudo.exec(cmd, this.sudoOptions, (error) => {
          if (error) {
            console.error('sudo error: ' + error);
          } else {
            console.log('sudo done!');
          }
        });
        break;
    };
  }
}
