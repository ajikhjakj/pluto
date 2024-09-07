const {Observable} = require("rxjs/Observable");
const request = require("request");
const common = require("./common");
const store = require("./store");
const string = require("./views/values/strings");
const proxy_port = require('./.config').proxyPort
const host = '127.0.0.1:8765'

exports.HOST = host
exports.PROXY_PORT = proxy_port
exports.PROXY_URL = '127.0.0.1:' + proxy_port

const proxyGroupDirect = 'DIRECT'
const proxyGroupDefault = 'Pluto'
const proxyGroupTest = 'Test'

const routeGlobal = 'Global'
const routeAuto = 'Rule'
const routeDirect = 'Direct'

const _ROUTES = [routeGlobal, routeAuto, routeDirect]

exports.PROXY_GROUP_DIRECT = proxyGroupDirect
exports.PROXY_GROUP_DEFAULT = proxyGroupDefault
exports.PROXY_GROUP_TEST = proxyGroupTest

exports.ROUTE_GLOBAL = routeGlobal
exports.ROUTE_AUTO = routeAuto
exports.ROUTE_DIRECT = routeDirect
exports.ROUTES = _ROUTES

let url = (expands) => `http://${host}/${expands}`

exports.ping = () => get(url(''))
exports.changeLine = () => {
    let line = store.line()
    // 重置所有连接
    delConnections().catch(() => Observable.of('')).subscribe()
    if (line !== undefined && line.length > 0) {
        return updatePluto(line).catch(() => Observable.of(''))
            .do(() => updateGlobal(line).catch(() => Observable.of('')).subscribe())
            .do(() => updateTest(line).catch(() => Observable.of('')).subscribe())
    }
    return Observable.throw(string.getString('connectNone'))
}
exports.notifyConfigChange = (config) => put(url('configs'), {path: config})
    .subscribe(() => console.log('Clash Config update success'), err => console.log(`Clash Config update err ${err}`))
exports.changeRoute = (route) => {
    if (_ROUTES.indexOf(route) !== -1) return patch(url('configs'), {'mode': route})
    return Observable.throw(string.getString('connectNone'))
}
exports.closeConnections = () => delConnections()
exports.testSpeed = (name) => updateTest(name)
    .mergeMap(() => get(url('proxies/Test/delay') + '?url=https://www.google.com/generate_204&timeout=10000'))
    .map(data => JSON.parse(data?.toString()))
    .map(data => {
        return {'name': name, 'delay': data.delay ? data.delay : -1}
    })
    .catch(() => Observable.of({'name': name, 'delay': -1}))
exports.cancelTestSpeed = () => updateTest(store.line()).catch(() => Observable.of('')).subscribe()
exports.urlTraffic = () => url('traffic')

exports.requestTraffic = () => get(url('connections'))
    .map(data => JSON.parse(data?.toString()))
    .map(data => {
        return {
            up: data['uploadTotal'],
            down: data['downloadTotal'],
        }
    })

let delConnections = () => del(url('connections'))
let updatePluto = (line) => put(url(`proxies/${store.proxyGroup()}`), {'name': line})
let updateTest = (line) => put(url(`proxies/${proxyGroupTest}`), {'name': line})
let updateGlobal = (line) => put(url('proxies/GLOBAL'), {'name': line})

let get = (url) => {
    let options = {'url': url, 'method': 'GET', 'timeout': 10000, 'rejectUnauthorized': false};
    return new Observable(sb => request(options, (err, response, body) => handleRes(sb, err, response, body, url)))
}

let put = (url, data, method = 'PUT') => {
    let options = {'url': url, 'method': method, 'timeout': 10000};
    if (data) {
        options.headers = {'Content-Type': 'application/json'}
        options.body = data
        options.json = true
    }
    return new Observable(sb => request(options, (err, response, body) => handleRes(sb, err, response, body, url)))
}

let patch = (url, data) => put(url, data, 'PATCH')
let del = (url) => put(url, null, 'DELETE')

let handleRes = (sb, err, res, body, url) => {
    if (err || (res.statusCode !== 200 && res.statusCode !== 204)) {
        try {
            sb.error(err || res.message || body.message);
        } catch (e) {
            sb.error(e)
        }
        common.log("================ Clash  ==============\n" + url + "\n-----------------------------\n" + (err || res.message || body) + '\n>>>>>>>>>>>>>>>>')
        return;
    }
    common.log("================ Clash  ==============\n" + url + "\n-----------------------------\n" + JSON.stringify(body) + '\n>>>>>>>>>>>>>>>>')
    sb.next(body);
    sb.complete()
}