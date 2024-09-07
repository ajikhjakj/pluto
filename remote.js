// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const Http = require('./commons/_http');
const Zips = require('./commons/zips');
const store = require('./store');
const MD5 = require('./commons/md5');
const common = require('./common');
let config
switch (process.env.NODE_ENV) {
    case "dev":
        config = require('./.config.dev.js')
        break
    case "beta":
        config = require('./.config.js')
        break
    default:
        config = require('./.config.js')
        break
}

const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/of');
require('rxjs/add/observable/zip');
require('rxjs/add/observable/throw');
require('rxjs/add/observable/merge');
require('rxjs/add/observable/timer');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/timeout');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');
require('rxjs/add/operator/takeWhile');
require('rxjs/add/operator/take');
require('rxjs/add/operator/first');
require('rxjs/add/operator/toArray');


// 1:Gitee 2:Gitlab 3:Github 4:OSS 5:GhProxy 6:GhProxy.net 7:FastGit 8:Fly

// const host1 = Zips.decrypt('2E232614477C496B354A32012F40464A2B4E370811074A2C104D1D03067819085A154D204E1629111D2D55455716364E4C5D352321')
// Gitlab
const host2 = Zips.decrypt('2E232614477C496B354A32082B0C0B46290C683B141F50070B0A1B010D3113001B0145304E092915462546194B1C371557')
// Github
const host3 = Zips.decrypt('2E232614477C496B2042314A2D07514D330332170101461C0A511D0017791908595C542B1410274B4628515B465C270E4A542F307D0955351221200C2E0B391A56')
// OSS
const host4 = Zips.decrypt('2E232614477C496B224F33102543514D230C224A0B00565E074B55060C391D0C5B1D43690008211F472E57450D102B0C0B5A29242617')
// ghproxy.com
// const host5 = Zips.decrypt('2E232614477C496B354B361625165C0B250E2A4B0C075103171F574111360D49531A502F14063D15573257594D07210F501C25383F4B442A13303D0E320C2F03400A250E29020D140A1E05560C0B11781208470757')
// ghproxy.net
const host6 = Zips.decrypt('2E232614477C496B354B361625165C0B2804334B0C075103171F574111360D49531A502F14063D15573257594D07210F501C25383F4B442A13303D0E320C2F03400A250E29020D140A1E05560C0B11781208470757')
// const host7 = Zips.decrypt('2E232614477C496B2042314A2C0F56512108334A0B01425C14490D1A0C7A0E0F511E4168020B26005B271B5B42003004561D2E38211047')
// Fly.io
const host8 = Zips.decrypt('2E232614477C496B224F33102543460B200D3E4A0016535C0C4A0B1A10')

const timeout = 15000

// 远程配置Header生成
let remoteHead = function () {
    let ts = parseInt((new Date().getTime() / 1000).toString());
    let data = {
        "ak": config.appKey,
        "pg": config.appPackage,
        "pv": store.version(),
        "ts": ts,
    }
    let values = [];
    Object.keys(data).forEach(key => values.push(key + "=" + data[key]))
    data['sc'] = MD5.encrypt(values.join(",") + MD5.encrypt(config.appSecret + MD5.encrypt(config.appSha1.split(":").join(""))))
    console.log(JSON.stringify(data))
    return data
}

// 选择正确的结果
let takeResult = (...source) => {
    const none = 'null'
    let merges = [...source, Observable.timer(timeout).map(() => none)]
    return Observable.merge(...merges)
        .first(data => {
            if (data === null) return false
            if (data === none) return true
            if ((typeof data) === 'string') {
                return data !== ''
            }
            return true
        })
        .mergeMap(data => {
            if (data === none) return Observable.throw('Timeout')
            return Observable.of(data)
        })
}

let zipResult = (...source) => Observable.zip(...source).mergeMap(data => {
    if (data === null || data.length === 0) {
        return Observable.throw("null")
    }
    for (let item of data) {
        if (item !== null && item !== '') {
            return Observable.of(item)
        }
    }
    return Observable.throw("null")
})

// 选择可用host
let chooseHost = (hosts, test) => {
    return hosts.map(data => {
            let tasks = [];
            for (let item of data) {
                tasks.push(test(item, 1));
            }
            return tasks;
        }
    ).mergeMap(data => {
        let err = {delay: timeout, host: null};
        let merges = [...data, Observable.timer(timeout).map(() => err)]
        return Observable.merge(...merges)
            .first(data => data['delay'] > -1)
            .mergeMap(data => {
                if (data['host'] === null) {
                    return Observable.throw('null')
                }
                return Observable.of(data['host'])
            })
    })
    //
    // .mergeMap(data =>
    //     Observable
    //         .merge(...data)
    //         .toArray()
    //         .map(data => {
    //             for (let item of data) {
    //                 if (item.delay !== -1) {
    //                     return item;
    //                 }
    //             }
    //             if (data && data.length > 0) return data[0]
    //         })
    //         .map(data => data.host)
    // )
}

// 测试可用的host
let testHost = function (hosts) {
    let test = (url, retry = 1) => new Observable(sb => {
        let start = new Date().getTime();
        let next = function (delay) {
            console.info(url + " " + delay)
            sb.next({host: url, delay: delay});
            sb.complete();
        }
        Http.test(url).retry(retry).timeout(10000).subscribe(() => next(new Date().getTime() - start), err => {
            next(-1)
            console.log(err)
        })
    })

    return chooseHost(hosts, test)
}

// 获取Config
let takeConfig = (source) => source.map(data => JSON.parse(data.toString()))
    .mergeMap(data => {
        if (data !== null && data.key !== null && data.key === config.appKey || config.httpRemoteType === 3) {
            return Observable.of(data)
        } else {
            return Observable.throw("Invalid secret!!!")
        }
    })
    .map(data => {
        if (config.payCrypt) {
            data['payment_config']['Crypto'] = "1"
        }
        data.payTypes = common.payTypes(data['payment_config'])
        if (data.animator) {
            try {
                data.animator = JSON.parse(data.animator)
            } catch (e) {
            }
        }
        store.remote(data)
        return data
    })
    .mergeMap(() => testHost(Observable.of(store.remote('hosts')))
        .catch(err => {
            let hosts = store.remote('hosts')
            if (hosts && hosts.length > 0) return Observable.of(hosts[0])
            return Observable.throw(err)
        })
        .map(host => {
            store.host(host)
            return host
        }))

// 获取版本信息
let takeVersion = (source) => source.map(data => JSON.parse(data.toString())).do(vs => store.versionCheckUrl(vs?.url)).do(vs => store.versionData(vs))

exports.chooseHosts = function () {
    // 获取远程配置地址
    let loadRemoteHostList = function () {
        let loadRemoteHost = (url) => new Observable(sb => {
            let next = function (data) {
                sb.next(data);
                sb.complete();
            }
            Http.get(url).subscribe(data => next(Zips.decrypt(data.toString().trim())), () => next(""))
        })

        return takeResult(
            // loadRemoteHost(host1),
            loadRemoteHost(host2),
            loadRemoteHost(host3),
            loadRemoteHost(host4),
            // loadRemoteHost(host5),
            loadRemoteHost(host6),
            // loadRemoteHost(host7),
            loadRemoteHost(host8),
        )
            // return zipResult(loadRemoteHost(host1), loadRemoteHost(host2))
            .map(data => {
                let tmp = JSON.parse(data.toString());
                let hosts = [];
                for (let item of tmp) {
                    hosts.push(item.host);
                }
                console.info("loadRemoteHostList " + hosts.toString())
                return hosts;
            })
    }

    // 获取Git组配置地址
    let loadGitHostList = () => Observable.of(config.httpRemoteGitGroup.split(','))

    // 请求远程配置信息&Version
    let requestRemote = function (loadHosts) {
        // 根据域名请求配置
        let requestConfig = (host) => Http.get(host + "/client/api/v1/config", remoteHead()).catch(() => Observable.of(""))
        let requestVersion = (host) => Http.get(host + `/client/api/v1/versions/${process.platform === 'darwin' ? "mac" : "win"}`, remoteHead())
            // 防止版本信息中没有数据导致初始化无法继续
            .map(data => data ? data : '{}')
            .catch(() => Observable.of(""))

        return loadHosts.mergeMap(hosts => {
            let configs = [];
            for (let item of hosts) {
                configs.push(requestConfig(item))
            }

            let versions = [];
            for (let item of hosts) {
                versions.push(requestVersion(item))
            }
            // return chooseResult(Observable.merge(...items))
            return takeConfig(takeResult(...configs))
                .mergeMap(host => takeVersion(takeResult(...versions)).map(() => host))
        })
    }

    let requestConfig = () => {
        switch (config.httpRemoteType) {
            case 1:
                return requestRemote(loadRemoteHostList()).catch(() => requestRemote(loadGitHostList()))
            case 2:
                return requestRemote(loadRemoteHostList())
            case 3:
                return requestRemote(loadGitHostList())
        }
    }

    return requestConfig()
}