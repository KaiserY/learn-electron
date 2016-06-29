import { Injectable } from '@angular/core';

import * as os from 'os';
import * as fs from 'fs';

var sudo = require('electron-sudo');

@Injectable()
export class HostsService {
  hostsPath = this.getHostsPath();

  sudoOptions = {
    name: 'test'
  };

  getHostsPath(): string {
    switch (os.platform()) {
      case 'win32':
        return process.env.WINDIR + '\\System32\\drivers\\etc\\hosts';
      case 'linux':
        return '/etc/hosts';
    };
  }

  saveHosts(hostsContent: String) {
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
