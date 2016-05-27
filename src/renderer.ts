// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import * as fs from 'fs'
import * as os from 'os'
var sudo = require('electron-sudo')

let hostsPath: string = '/etc/hosts'

switch (os.platform()) {
    case 'win32':
        hostsPath = 'C:/Windows/System32/drivers/etc/hosts'
        break
    case 'linux':
        hostsPath = '/etc/hosts'
        break
}

fs.readFile(hostsPath, 'utf-8', (err, data) => {
    if (err) {
        console.error('error: ' + err)
    } else {
        console.log(data)
    }
})

var options = {
    name: 'test'
}

sudo.exec('echo hello', options, (error) => {
    if (error) {
        console.error('sudo error: ' + error)
    } else {
        console.log('sudo done!')
    }
})
