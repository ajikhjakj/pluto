const path = require("path");
const child_process = require("child_process");
const common = require("./common");
const config = require('./clash.config')
const tun = require("./tun.mac");
const store = require("./store");
const tun2socks = require("./tap");

const {Observable} = require("rxjs/Observable");
require('rxjs/add/observable/of');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');
const {exec} = require("sudo-prompt");
const string = require("./views/values/strings");

let clashProcess = null

let errCallback
let regErr = (callback) => {
    errCallback = callback
}
let callErr = (err) => {
    if (errCallback) errCallback(err)
}
exports.registerErrListener = (callback) => regErr(callback)

exports.clashPath = () => _path()
exports.configPath = () => _configPath()
exports.configFile = () => _configFile()

exports.onConnectChanged = (on) => {
    if (on) {
        if (store.tap()) tun2socks.open(config.PROXY_PORT).catch(() => Observable.of('')).subscribe()
        if (!store.tun()) openProxy()
    } else {
        // Just change proxy to direct if use tun mode
        if (store.tun()) {
            directRoute()
            return
        }
        if (store.tap()) tun2socks.close()
        closeProxy()
    }
}
exports.openCore = (callback) => open(callback)
exports.closeCore = () => close()
exports.fixCore = () => {
    if (store.tun()) tun.open()
    open()
    return Observable.of('')
}

exports.tunToggle = (on) => {
    tun.toggle(on)
    open()
}
exports.tunReady = () => store.tun()
exports.attachTun = (data) => {
    if (!data) return {};
    // tun mode
    data['dns'] = {
        enable: true,
        'enhanced-mode': 'fake-ip',
        nameserver: ["8.8.8.8", "114.114.114.114", "223.5.5.5"],
        'fake-ip-filter': ['dns.msftncsi.com', 'www.msftncsi.com', 'www.msftconnecttest.com']
    }
    data['tun'] = {
        enable: true,
        stack: 'gvisor',
        'dns-hijack': ['114.114.114.114', '8.8.8.8', '8.8.4.4'],
        'auto-route': true,
        'auto-detect-interface': true
    }
    return data
}
exports.ping = (server, callback) => {

    child_process.exec('ping -c 3 ' + server, function (err, stdout, stderr) {
        try {
            if (stdout) {
                console.log(stdout)
                let rex = /=[^0-9][0-9.]+\/([0-9.]+)/
                callback(rex.test(stdout) ? parseInt(rex.exec(stdout)[1]) : -1)
            }
            if (err || stderr) callback(-1)
        } catch (e) {
            callback(-1)
        }
    })
}

let open = (callback) => {
    if (store.tun()) {
        close()
        exec(`${clashCore()} -d ${_path()} -f ${_configFile()}`, {name: 'Pluto.core'})
        return
    }
    clashProcess = child_process.spawn(clashCore(), ["-d", _path(), '-f', _configFile()])
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
    console.log("start clash at :" + clashProcess.pid + " on " + process.platform)

    // 打印正常的后台可执行程序输出
    clashProcess.stdout.on('data', (data) => {
        console.log('clash :  ' + data)
        if (data && data.indexOf('error=') !== -1 && callback) {
            callback(`Open Core failed! ${data}`)
        }
    })
    // 打印错误的后台可执行程序输出
    clashProcess.stderr.on('data', function (data) {
        console.log('clash err:  ' + data)
        if (callback) callback(data)
    })
    // 退出之后的输出
    clashProcess.on('close', (data) => console.log('clash closed： ' + data))
}
let close = () => {
    try {
        clashProcess?.kill()
    } catch (e) {
        console.log(e)
    }
}
let openProxy = () => {
    let ps = child_process.spawn(sysProxy(), ['-http', config.PROXY_URL, '-https', config.PROXY_URL, '-socks', config.PROXY_URL])
    // 打印正常的后台可执行程序输出
    ps?.stdout.on('data', data => console.log('stdout:  ' + data))
    // 打印错误的后台可执行程序输出
    ps?.stderr.on('data', data => {
        console.log('stderr:  ' + data)
        callErr(string.getString('proxyOpenErrMac') + data)
    })
}
let closeProxy = () => child_process.spawn(sysProxy(), ["-stop"])
let directRoute = () => config.changeRoute(config.ROUTE_DIRECT).do(() => console.log('DIRECT ROUTE')).catch(() => Observable.of('')).subscribe()

let _path = () => common.dev() ? path.join(common.configPath(), '/build/static/mac/clash/') : path.join(process.resourcesPath, './clash/')
let clashCore = () => _path() + process.arch.toString().toLowerCase() + "/clash-darwin"
let sysProxy = () => _path() + process.arch.toString().toLowerCase() + '/sysproxy'

let _configPath = () => store.userDataPath()
let _configFile = () => path.join(_configPath(), 'config.yaml')
