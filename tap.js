const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const {exec} = require("sudo-prompt")
const common = require('./common')

const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/of');
require('rxjs/add/observable/interval');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/catch');

const TAP_DEVICE_NAME = 'pluto-tap'

let tun2socksProcess = null

let tunPath = () => {
    let filePath
    if (common.dev()) {
        filePath = path.join(process.cwd(), '/build/static/win/tun2socks/')
    } else {
        filePath = path.join(process.resourcesPath, './tun2socks/')
    }
    return filePath
}

let copyDll = () => {
    let target
    if (common.dev()) {
        target = path.join(process.cwd(), '/build/static/win/clash/')
    } else {
        target = path.join(process.resourcesPath, './clash/')
    }
    fs.copyFileSync(path.join(tunPath(), 'wintun.dll'), target)

}

let checkTapDevice = () => child_process.execSync('netsh interface show interface').toString().includes(TAP_DEVICE_NAME)
let trySetupTapDevice = () => {
    if (process.platform === 'darwin') return Observable.of(false)
    if (checkTapDevice()) return Observable.of(true)
    let bat = path.join(tunPath(), 'add_tap_device.bat')
    return new Observable(sb => {
        exec(bat, {'name': 'Pluto'}, (err, stdout, sdterr) => {
            if (err) sb.error(err)
            else {
                // copyDll()
                sb.next('ok')
                sb.complete()
            }
        })
    })
}

let openTun2socks = (port) => {
    const args = [
        "-tunName",
        TAP_DEVICE_NAME,
        "-tunDns",
        "10.0.0.1",
        "-tunAddr",
        "10.0.0.1",
        "-tunMask",
        "255.255.255.0",
        "-tunGw",
        "10.0.0.0",
        "-proxyServer",
        "127.0.0.1:" + port,
        "-loglevel",
        "none"
    ];
    console.log(JSON.stringify(args))
    tun2socksProcess = child_process.spawn("go-tun2socks.exe", args, {cwd: tunPath()});
    // workaround: when run as admin, tap route remove by system issue
    let times = 10
    let openRoute = () => {
        console.log(`openRoute ${times}`)
        const out = child_process.execSync("route print 10.0.0.0 mask 255.255.255.0")
        if (/10\.0\.0\.1/.test(out.toString())) {
            // exec("route add 0.0.0.0 mask 0.0.0.0 10.0.0.0 metric 1")
            console.log(`times ${times} add route`)
            let addRoute = () => {
                child_process.execSync('route delete 0.0.0.0 mask 0.0.0.0')
                let _out = child_process.execSync("route add 0.0.0.0 mask 0.0.0.0 10.0.0.0 metric 1")
                _out.stdout.on('data', data => console.log(`route add out :${data}`))
                _out.stderr.on('data', data => console.log(`route add err :${data}`))
            }
            addRoute()
            // setTimeout(() => addRoute(), 2000);
            return true
        }
        return false
    }
    // let sp = Observable.interval(1000)
    //     .map(() => {
    //         --times
    //         if (openRoute()) {
    //             sp.unsubscribe()
    //             return true
    //         }
    //         if (times <= 0) sp.unsubscribe()
    //         return false
    //     })
    //     .catch(err => {
    //         console.log(`openRoute err ======== ${err}`)
    //         closeTun2socks()
    //         return Observable.of(false)
    //     })
    //     .subscribe()

    tun2socksProcess.stdout.on('data', data => console.log(`t2s: ${data}`))
    tun2socksProcess.stderr.on('data', data => console.log(`t2s, err: ${data}`))
}

let closeTun2socks = () => {
    if (process.platform === "darwin") return
    if (!tun2socksProcess) return;
    try {
        child_process.execSync(`taskkill /F /PID ${tun2socksProcess.pid}`)
        tun2socksProcess = null
    } catch (e) {
        console.log(e)
    }
}

exports.check = () => trySetupTapDevice()

exports.open = (port) => {
    return trySetupTapDevice()
        .map(ok => {
            if (ok) {
                closeTun2socks()
                openTun2socks(port)
            }
            return ok
        })
}
exports.close = () => closeTun2socks()