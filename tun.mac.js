const fs = require('fs')
const path = require('path')
const {exec} = require("sudo-prompt")
const common = require('./common')
const store = require('./store')

const darwinLaunch = '/Library/LaunchDaemons/com.lbyczf.cfw.helper.plist'

let tunPath = () => common.dev() ? path.join(process.cwd(), `/build/static/mac/clash/${process.arch}`) : path.join(process.resourcesPath, `./clash/${process.arch}`)

let statusTun = () => fs.existsSync(darwinLaunch)
let startTun = () => {
    let conf = fs.readFileSync(path.join(__dirname, 'tun.mac.xml')).toString()
        .replace('AAA', path.join(tunPath(), 'clash-darwin').toString())
        .replace('BBB', path.join(tunPath(), '../').toString())
    exec(`echo "${conf}" > ${darwinLaunch} ; launchctl load -w ${darwinLaunch}`, {'name': 'Pluto'}, (err, stdout, stderr) => {
        if (err) console.log(`tun for mac start err ${err}`)
        if (stdout) console.log(`tun for mac start out: ${stdout}`)
        if (stderr) console.log(`tun for mac start outE: ${stderr}`)
    })
}
let stopTun = () => {
    exec(`launchctl unload ${darwinLaunch} ; rm ${darwinLaunch}`, {'name': 'Pluto'}, (err, stdout, stderr) => {
        if (err) console.log(`tun for mac stop err ${err}`)
        if (stdout) console.log(`tun for mac stop out: ${stdout}`)
        if (stderr) console.log(`tun for mac stop outE: ${stderr}`)
    })
}
let tryOpenTun = () => {
    if (!statusTun()) startTun()
    return fs.existsSync(darwinLaunch)
}

exports.toggle = (on) => {
    if (on) tryOpenTun()
    else stopTun()
    store.tun(on)
}
exports.open = () => tryOpenTun()
exports.close = () =>  stopTun()
exports.ready = () => statusTun()