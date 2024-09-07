const path = require('path')
const fs = require('fs')
const child_process = require('child_process')
const common = require('./common')
const store = require('./store')
const YAML = require("yaml");

// status
// NonExistent no install
// Stopped / Started

const STATUS_START = 'Started'
const STATUS_STOP = 'Stopped'
const STATUS_NONE = 'NonExistent'

let tunPath = () => common.dev() ? path.join(process.cwd(), '/build/static/win/clash/') : path.join(process.cwd(), '/resources/static/clash/')

// let execTun = (commands) => {
//     let shells = [];
//     commands?.forEach(c => shells.push(servicePath().concat(` ${c}`)))
//     child_process.spawn(shells.join(' && '), {shell: true, stdio: 'inherit'})
// }

let execTun = (commands) => child_process.spawnSync(path.join(tunPath(), 'Pluto-service.exe'), commands)
let installTun = () => execTun(['install'])
let uninstallTun = () => execTun(['uninstall'])
let statusTun = () => {
    let out = execTun(['status'])
    if(out.status === 0) {
        return out.stdout.toString().trim()
    }
    return ""
}
let startTun = () => execTun(['start'])
let stopTun = () => execTun(['stop'])
let tryOpenTun = () => {
    switch (statusTun()) {
        case STATUS_NONE:
            installTun()
            startTun()
            break
        case STATUS_STOP:
            startTun()
            break
        case STATUS_START:
            return true
    }
    return check()
}
let check = () => statusTun().toString() === STATUS_START

exports.toggle = (on) => {
    if (on) tryOpenTun()
    else {
        stopTun()
        uninstallTun()
    }
    store.tun(on)
}
exports.open = () => tryOpenTun()
exports.close = () => {
    stopTun()
    uninstallTun()
}
exports.ready = () => check()
exports.saveConfig = (data) => {
    fs.writeFileSync(path.join(tunPath(), 'config.yaml'), YAML.stringify(data))
}