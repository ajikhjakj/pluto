const fs = require('fs');
const path = require('path')
const YAML = require('yaml');

const configs = require('./.config')
const store = require('./store')
const interfaces = require('./interface')
const ccc = require('./clash.config')
const target = require(`./clash.${process.platform}`)
const string = require('./views/values/strings')

const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/of');
require('rxjs/add/observable/interval');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');

exports.ROUTE_GLOBAL = ccc.ROUTE_GLOBAL
exports.ROUTE_AUTO = ccc.ROUTE_AUTO
exports.ROUTES = ccc.ROUTES


exports.registerErrListener = (callback) => target.registerErrListener(callback)

/**
 * Check if have permission to write file
 * @returns {Observable<unknown>}
 */
exports.checkPermission = () => {
    return new Observable(sb => {
        // fs.access(test(), fs.constants.W_OK, err => {
        //     if (err) {
        //         sb.error(err)
        //         return
        //     }
        //     sb.next("")
        //     sb.complete()
        // })
        try {
            fs.unlinkSync(test())
        } catch (e) {
            console.log(e)
        }
        fs.writeFile(test(), "ok", err => {
            if (err) {
                sb.error(err)
                return
            }
            sb.next('')
            sb.complete()
        })
    })
}

exports.open = () => checkCore()
exports.close = () => closeCore()
exports.reopen = () => {
    closeCore()
    openCore().catch(() => Observable.of('')).subscribe()
}
exports.lineChanged = () => checkCore().mergeMap(() => ccc.changeLine())
exports.connect = () => checkCore().mergeMap(() => ccc.changeLine()).mergeMap(() => ccc.changeRoute(store.route()))
    .do(() => target.onConnectChanged(true), () => target.onConnectChanged(false))
exports.disconnect = () => {
    unreadTraffic()
    ccc.closeConnections().catch(() => Observable.of('')).subscribe()
    target.onConnectChanged(false)
}
exports.resetConnect = () => ccc.closeConnections()
exports.route = (route) => ccc.changeRoute(route)
exports.ready = () => store.line()
exports.clearClashConfig = () => resetConfig()
exports.updateClashConfig = (data) => updateConfig(data)

exports.tunToggle = (on) => {
    saveConfig((on ? target.attachTun(getConfig()) : detachTun(getConfig())))
    setTimeout(() => target.tunToggle(on), 200)
}
exports.tunReady = () => target.tunReady()

exports.lines = () => getConfig()?.hasOwnProperty('proxies') ? getConfig()['proxies'] : []
exports.linePing = function (server) {
    return new Observable(sb => {
        let next = function (delay) {
            sb.next({'server': server, 'delay': delay})
            sb.complete()
        }
        target.ping(server, next)
    })
}

exports.lineSpeed = (name) => ccc.testSpeed(name)
exports.cancelLineSpeed = () => ccc.cancelTestSpeed()
exports.traffic = () => readTraffic()

let testCore = () => ccc.ping()
let checkCore = () => testCore().catch(() => openCore())
let openCore = () => {
    let checkConfig = () => {
        return new Observable(sb => {
            if (!fs.existsSync(config())) resetConfig()
            fs.access(config(), fs.constants.F_OK, err => {
                if (err || store.first()) resetConfig()
                let config = getConfig()
                if (!config || !config.hasOwnProperty('external-controller') || !config.hasOwnProperty('proxy-groups')) resetConfig()
                sb.next("")
                sb.complete()
            })
        })
    }

    return checkConfig()
        .mergeMap(() => new Observable(sb => {
            let sp = Observable.interval(500)
                .mergeMap(() => testCore().do(() => {
                    console.log('clash open success!!!')
                    sp.unsubscribe()
                    sb.next('success')
                    sb.complete()
                }))
                .catch(() => Observable.of(''))
                .subscribe()

            target.openCore(err => {
                sp.unsubscribe()
                sb.error(err)
            })
        }))
}
let closeCore = () => target.closeCore()

let lastTrafficUp = 0, lastTrafficDown = 0;
// let readTraffic = () => new Observable(sb => {
//     // trafficReadStream = got.stream(ccc.urlTraffic())
//     // let writeStream = new Stream.Writable()
//     // writeStream._write = (chunk, encoding, next) => {
//     //     try {
//     //         sb.next(JSON.parse(chunk.toString().trim()))
//     //     } catch (e) {
//     //         console.log(e)
//     //     }
//     //     next()
//     // }
//     // trafficReadStream.pipe(writeStream)
// })

let readTraffic = () => Observable.interval(1000).mergeMap(() =>
    ccc.requestTraffic()
        .map(data => {
            let up = data.up
            let down = data.down
            data.up = up > lastTrafficUp ? up - lastTrafficUp : 0
            data.down = down > lastTrafficDown ? down - lastTrafficDown : 0
            lastTrafficUp = up
            lastTrafficDown = down
            return data
        })
        .catch(() => Observable.of({up: 0, down: 0}))
        .do(data => console.log(JSON.stringify(data)))
)

let unreadTraffic = () => {
    lastTrafficUp = 0
    lastTrafficDown = 0
}

let config = () => target.configFile()
let test = () => path.join(target.configPath(), 'test')

let getConfig = () => YAML.parse(fs.readFileSync(config())?.toString() ?? "")
let saveConfig = (yaml) => fs.writeFileSync(config(), YAML.stringify(yaml))
let clearConfig = (yaml = null) => {
    yaml['mixed-port'] = ccc.PROXY_PORT
    yaml['external-controller'] = ccc.HOST
    yaml['allow-lan'] = configs.allowLan
    yaml['mode'] = store.route()
    yaml['log-level'] = 'info'

    yaml['proxies'] = null
    yaml['proxy-groups'] = null
    yaml['rules'] = null
}
let resetConfig = () => {
    let yaml = {}
    clearConfig(yaml)
    saveConfig(yaml)
}

let updateConfig = (data) => {
    let clash
    if (data.startsWith("{")) {
        clash = JSON.parse(data)
    } else {
        clash = YAML.parse(data)
    }
    let local = getConfig()
    clearConfig(local)
    // exit if none config
    if (!clash || !clash.hasOwnProperty('proxy-groups')) {
        saveConfig(local)
        return
    }
    // let proxyGroups = clash['proxy-groups']
    // let proxyGroup = -1
    // let proxyGroupName

    // proxyGroups?.forEach((proxy, i) => {
    //     if (proxy.type === 'select' && proxyGroup === -1) {
    //         proxyGroup = i
    //         proxyGroupName = proxy.name
    //         proxy.name = ccc.PROXY_GROUP_DEFAULT
    //         store.proxyGroup(proxy.name)
    //     }
    // })

    // proxyGroups = proxyGroups?.filter(item => item.name === ccc.PROXY_GROUP_DEFAULT)

    let proxyNames = []
    if (clash['proxies'] && !Array.isArray(clash['proxies'])) {
        clash['proxies'] = [];
    }
    clash['proxies']?.forEach((proxy) => {
        proxyNames.push(proxy.name)
    })

    let proxyGroupName, index = -1
    clash['proxy-groups']?.forEach((proxy, i) => {
        if (proxy.type === 'select' && index === -1) {
            index = i
            proxyGroupName = proxy.name
        }
    })

    let proxyGroups = []
    // Set default proxy group
    let plutoProxyGroup = {
        name: ccc.PROXY_GROUP_DEFAULT,
        type: 'select',
        proxies: proxyNames
    }
    let testProxyGroup = {
        name: ccc.PROXY_GROUP_TEST,
        type: 'select',
        proxies: proxyNames
    }
    let autoProxyGroup = {
        name: string.getString("proxyGroupAuto"),
        type: 'url-test',
        proxies: proxyNames,
        url: configs.proxyTestUrl,
        interval: 86400
    }
    let fallbackProxyGroup = {
        name: string.getString("proxyGroupFallback"),
        type: 'fallback',
        proxies: proxyNames,
        url: configs.proxyTestUrl,
        interval: 7200
    }
    proxyGroups.push(plutoProxyGroup)
    proxyGroups.push(testProxyGroup)

    // 自动选择，负载均衡
    if (configs.proxyAuto) {
        proxyGroups.push(autoProxyGroup)
        proxyGroups.push(fallbackProxyGroup)
    }

    store.proxyGroup(plutoProxyGroup.name)

    proxyGroups?.forEach(proxy => {
        if (proxy.proxies && !Array.isArray(proxy.proxies)) {
            proxy.proxies = [];
        }
    })

    proxyGroups?.forEach(proxy => proxy.proxies = proxy.proxies?.filter(item => proxyNames.indexOf(item.toString().trim()) !== -1))

    proxyGroups?.forEach(proxy => {
        proxy.proxies?.forEach((p, i) => {
            if (p?.toString().trim() === proxyGroupName) {
                proxy.proxies[i] = ccc.PROXY_GROUP_DEFAULT
            }
        })
    })

    // 自动选择，负载均衡
    if (configs.proxyAuto) {
        proxyGroups?.filter(item => item.name !== autoProxyGroup.name && item.name !== fallbackProxyGroup.name)?.forEach(proxy => proxy.proxies.unshift(autoProxyGroup.name, fallbackProxyGroup.name))
    }

    clash['rules']?.forEach((rule, i) => {
        if (rule.indexOf(proxyGroupName) !== -1) {
            clash['rules'][i] = rule.toString().replaceAll(proxyGroupName, ccc.PROXY_GROUP_DEFAULT)
        }
    })
    clash['rules'] = clash['rules']?.filter(item => item.indexOf(ccc.PROXY_GROUP_DIRECT) !== -1 || item.indexOf(ccc.PROXY_GROUP_DEFAULT) !== -1)

    let newRules = []
    clash['rules'].forEach(item => {
        let items = item.split(',')
        let newItems = []
        for (let i = 0; i < items.length; i++) {
            if (items[i].indexOf(ccc.PROXY_GROUP_DIRECT) !== -1 && items[i] !== ccc.PROXY_GROUP_DIRECT) {
                newItems.push(ccc.PROXY_GROUP_DIRECT)
            } else {
                newItems.push(items[i])
            }
        }
        newRules.push(newItems.join(","))
    })

    clash['rules'] = newRules

    // add default rule for CN/MATCH
    clash['rules']?.push('GEOIP,CN,DIRECT')
    clash['rules']?.push('MATCH,' + ccc.PROXY_GROUP_DEFAULT)

    // let proxies = [];
    // try {
    //     proxies.push(...proxyGroups[proxyGroup]['proxies'])
    //
    //     if (proxyGroup >= 0) {
    //         let test = {
    //             name: 'Test',
    //             type: "select",
    //             proxies: proxies,
    //             // url: 'https://www.google.com/generate_204',
    //             // interval: 300
    //         }
    //         proxyGroups.push(test)
    //     }
    // } catch (e) {
    //     console.log(e)
    // }

    if (clash['dns']) local['dns'] = clash['dns']
    local['proxies'] = clash['proxies']
    local['proxy-groups'] = proxyGroups

    local['rules'] = clash['rules']
    if (!local['rules'] || local['rules'].length <= 0) {
        local['rules'] = defRules()
    }

    if (store.tap()) {
        const dfi = interfaces.getDefaultInterface()
        if (process.platform === 'darwin') {
            local['dns'] = {
                enable: true,
                "enhanced-mode": "redir-host",
                nameserver: ["114.114.114.114", "8.8.8.8", "223.5.5.5"]
            }
            local['experimental'] = {"interface-name": dfi || "en0",}
            local['tun'] = {
                enable: true,
                stack: "system",
                "macOS-auto-route": true,
                "dns-hijack": ["114.114.114.114"],
            }
        } else {
            local['dns'] = {
                enable: true,
                listen: ":53",
                "enhanced-mode": "redir-host",
                nameserver: ["114.114.114.114", "8.8.8.8", "223.5.5.5"],
            }
            local['experimental'] = {"interface-name": dfi || "以太网",}
        }
    }

    // tun mode
    if (store.tun()) target.attachTun(data)
    saveConfig(local)
    ccc.notifyConfigChange(config())
}

let detachTun = (data) => {
    if (!data) return data
    delete data['dns']
    delete data['tun']
    return data
}

let defRules = () => [
    "DOMAIN-SUFFIX,local,DIRECT",
    "IP-CIDR,127.0.0.0/8,DIRECT",
    "IP-CIDR,172.16.0.0/12,DIRECT",
    "IP-CIDR,192.168.0.0/16,DIRECT",
    "IP-CIDR,10.0.0.0/8,DIRECT",
    "IP-CIDR,17.0.0.0/8,DIRECT",
    "IP-CIDR,100.64.0.0/10,DIRECT",
    "IP-CIDR,224.0.0.0/4,DIRECT",
    "IP-CIDR6,fe80::/10,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,Pluto",
]