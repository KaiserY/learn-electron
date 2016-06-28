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
export class AppComponent {

  hostsPath: string = 'the hosts file path...';
  textarea: HTMLTextAreaElement;
  appCodeMirror: CodeMirror.EditorFromTextArea;
  sudoOptions = {
    name: 'test'
  };

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
          this.saveHosts(cm.getValue());
        }
      });
    });

    console.log('Initial App');
  };

  onSave() {
    var text = this.appCodeMirror.getValue();
    this.saveHosts(text);
  };

  saveHosts(hostsContent: String) {
    hostsContent = hostsContent.replace(/^\s+|\s+$/g, "");

    switch (os.platform()) {
      case 'win32':
        var content = "takeown /f " + this.hostsPath + "\r\n";

        var lines = hostsContent.split(/\r?\n/);

        for (var i = 0; i < lines.length; i++) {
          if (i === 0) {
            content += 'echo ' + lines[i] + ' > "' + this.hostsPath + '"\r\n';
          } else if (lines[i] === '') {
            content += 'echo[ >> "' + this.hostsPath + '"\r\n';
          } else {
            content += 'echo ' + lines[i] + ' >> "' + this.hostsPath + '"\r\n';
          }
        }

        var tmpBatch = process.env.temp + '\\tmp.bat';
        fs.writeFile(tmpBatch, content, (error) => {
          if (error) {
            console.error('sudo error: ' + error);
          } else {
            var cmd = 'call "' + tmpBatch + '"';
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
        var cmd = 'sh -c \'echo "' + hostsContent + '" > ' + this.hostsPath + '\'';
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
