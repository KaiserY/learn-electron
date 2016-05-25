// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import * as fs from 'fs'
var sudo = require('electron-sudo')

fs.readFile('/etc/hosts', 'utf-8', (err, data) => {
    if (err) {
        console.log('error: ' + err)
    } else {
        document.getElementById('hosts-text').innerHTML = data
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
