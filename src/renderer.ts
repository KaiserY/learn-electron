// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import * as fs from 'fs';
import * as os from 'os';
import * as CodeMirror from 'codemirror'
import * as $ from 'jquery'

var sudo = require('electron-sudo');

let hostsPath: string = '/etc/hosts';

switch (os.platform()) {
  case 'win32':
    hostsPath = process.env.WINDIR + '\\System32\\drivers\\etc\\hosts';
    break;
  case 'linux':
    hostsPath = '/etc/hosts';
    break;
};

$('#app-card-title').text(hostsPath);

let textarea = <HTMLTextAreaElement>document.getElementById("app-editor");
let appCodeMirror: CodeMirror.EditorFromTextArea = null;

fs.readFile(hostsPath, 'utf-8', (err, data) => {
  var text;
  if (err) {
    text = 'error: ' + err;
    console.error(text);
  } else {
    text = data;
  };

  appCodeMirror = CodeMirror.fromTextArea(textarea, {
    mode: 'hosts',
    lineNumbers: true,
    tabSize: 8
  });

  appCodeMirror.setValue(text);
  appCodeMirror.getDoc().clearHistory();

  appCodeMirror.setOption("extraKeys", {
    "Ctrl-/": (cm) => {
      cm.toggleComment();
    },
    "Ctrl-S": (cm) => {
      saveHosts(cm.getValue());
    }
  });
});

let sudoOptions = {
  name: 'test'
};

$('#app-card-save').click(() => {
  var text = appCodeMirror.getValue();
  saveHosts(text);
});

function saveHosts(hostsContent) {
  switch (os.platform()) {
    case 'win32':
      var tmpFile = process.env.temp + '\\tmp-hosts';
      fs.writeFile(tmpFile, hostsContent, (error) => {
        if (error) {
          console.error('sudo error: ' + error);
        } else {
          var cmd = 'xcopy /s /y ' + tmpFile + ' ' + hostsPath;
          sudo.exec(cmd, sudoOptions, (error) => {
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
      var cmd = 'bash -c \'echo "' + hostsContent + '" | tee ' + hostsPath + '\'';
      sudo.exec(cmd, sudoOptions, (error) => {
        if (error) {
          console.error('sudo error: ' + error);
        } else {
          console.log('sudo done!');
        }
      });
      break;
  };
}
