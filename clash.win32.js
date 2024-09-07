const path = require("path");
const child_process = require("child_process");
const common = require("./common");
const config = require('./clash.config')
const tun = require('./tun.win')
const store = require('./store')
const tun2socks = require('./tap');
const string = require('./views/values/strings')

const {Observable} = require("rxjs/Observable")
require('rxjs/add/observable/of');
require('rxjs/add/observable/interval');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');

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
        // closeProxyIfOn()
        closeProxy()
    }
}
exports.openCore = (callback) => openClash(true, callback)
exports.closeCore = () => closeClash()
exports.fixCore = () => {
    if (store.tun()) {
        closeClash()
        tun.open()
    } else openClash(true)
    return Observable.of('')
}

exports.tunToggle = (on) => {
    if (on) {
        closeClash()
        tun.toggle(true)
        directRoute()
    } else {
        tun.toggle(false)
        openClash(false)
    }
}
exports.tunReady = () => tun.ready()
exports.attachTun = (data) => {
    if (!data) return {}
    // tun mode
    data['dns'] = {
        enable: true,
        'enhanced-mode': 'fake-ip',
        nameserver: ["114.114.114.114", "8.8.8.8", "8.8.4.4", "223.5.5.5"],
        'fake-ip-filter': ['dns.msftncsi.com', 'www.msftncsi.com', 'www.msftconnecttest.com']
    }
    data['tun'] = {
        enable: true,
        stack: 'gvisor',
        'dns-hijack': ['198.18.0.2:53'],
        'auto-route': true,
        'auto-detect-interface': true
    }
    tun.saveConfig(data)
    return data
}

exports.ping = (server, callback) => {
    child_process.exec(`ping -n 3 ${server}`, function (err, stdout, stderr) {
        try {
            if (stdout) callback(/([0-9]*)ms/.exec(stdout)[1])
            if (err || stderr) callback(-1)
        } catch (e) {
            callback(-1)
        }
    })
}

let openClash = (check = true, callback) => {
    // open tun if is tun mode
    if (check && store.tun()) {
        closeClash()
        tun.open()
        return
    }
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    clashProcess = child_process.spawn(clashCore(), ['-d', _path(), '-f', _configFile()])
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
    console.log("start clash at :" + clashProcess.pid + " on win")
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
        if (callback) callback(`Open Core failed! ${data}`)
    })
    // 退出之后的输出
    clashProcess.on('close', (data) => console.log('clash closed： ' + data))
}
let closeClash = () => {
    try {
        child_process.spawn("taskkill", ["/PID", clashProcess?.pid, "/T", "/F"])
        clashProcess?.kill()
    } catch (e) {
        console.log(e)
    }
}
let openProxy = () => {
    let ps = child_process.spawn(sysProxy(), ["global", config.PROXY_URL, 'localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*'])
    // 打印正常的后台可执行程序输出
    ps?.stdout?.on('data', data => console.log('stdout:  ' + data))
    // 打印错误的后台可执行程序输出
    ps?.stderr?.on('data', data => {
        console.log('stderr:  ' + data)
        callErr(string.getString('proxyOpenErrWin') + data)
    })
}
let closeProxy = () => child_process.spawn(sysProxy(), ["set", '1', '-', '-', '-'])
let closeProxyIfOn = () => {
    let query = child_process.spawn(sysProxy(), ["query"])
    query?.stdout?.on('data', data => {
        let arr = data.split('\n')
        if (arr === null || arr.length < 2) {
            closeProxy()
            return
        }

        let utf = [];
        arr.forEach(item => {
            let str = ''
            for (let i in item) {
                if (/[0-9a-zA-Z:\\.]/.exec(item[i]) !== null) {
                    str += item[i]
                }
            }
            utf.push(str)
        })

        if (utf[0].replace("\r", '') !== '1' && utf[1].indexOf(`:${config.PROXY_PORT}`) !== -1) {
            closeProxy()
        }

    })
    query?.stderr?.on('data', () => closeProxy())
}
let directRoute = () => config.changeRoute(config.ROUTE_DIRECT).do(() => console.log('DIRECT ROUTE')).catch(() => Observable.of('')).subscribe()


// process.cwd() 开机自启时无法获取准确位置
let _path = () => path.join(common.configPath(), common.dev() ? '/build/static/win/clash/' : '/resources/static/clash/')
let clashCore = () => _path() + 'clash-windows-amd64.exe'
let sysProxy = () => _path() + "sysproxy.exe"

let _configPath = () => store.userDataPath()
let _configFile = () => path.join(_configPath(), 'config.yaml')
