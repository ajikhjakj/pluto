const Http = require("./commons/_http");
const store = require("./store");
const common = require('./common')
const md5 = require("./commons/md5")
const configs = require('./.config')
const string = require("./views/values/strings");

require('rxjs/add/observable/zip');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/takeWhile');
require('rxjs/add/operator/catch');
const {Observable, config} = require("rxjs");

const TYPE_TOKEN_REQUIRE = "__need_token";

const CLIENT_API_KEY = "ss002se"

const URL_TOKEN = '/api/client/token'
const URL_LOGIN = "/api/client/account/info"
const URL_REGISTER = "/api/client/register"
const URL_CODE = "/api/client/register/sendcode"
const URL_FORGET = "/api/client/account/password/reset"

function url(expands) {
    return store.host() + expands;
}

function parseData(data) {
    if (typeof data === 'string' && (data.startsWith("{") || data.startsWith("["))) {
        data = JSON.parse(data)
    } else {
        return Observable.of(data)
    }
    if ((data['status'] !== 'success' && data['status'] !== 'sucess') && data.hasOwnProperty('message')) {
        return Observable.throw(data['message'])
    }
    // return Observable.throw(string.getString('unknownErr'))
    if (data.hasOwnProperty('data')) {
        return Observable.of(data['data'])
    }
    if (data.hasOwnProperty('message')) {
        return Observable.of({msg: data['message']})
    }
    return Observable.of(data)
}

function getToken() {
    return Http.post(url(URL_TOKEN), {}, {"xmplus-authorization": md5.encrypt(CLIENT_API_KEY)})
        .mergeMap(data => parseData(data))
        .mergeMap(data => {
            store.token(data.token)
            return Observable.of(data.token)
        })
}

function loginTo(email, passwd, code) {
    return getToken()
        .mergeMap(() => userInfo(email, passwd, code))
        .do(() => {
            store.isLogin(true)
            store.username(email)
            store.password(passwd)
            store.secCode(code)
        })
}

function userInfo(email, passwd, code) {
    return Http.post(url(URL_LOGIN), {
        email: email,
        passwd: passwd,
        code: code
    }, {Authorization: `Bearer ${store.token()}`})
        .mergeMap(data => parseData(data))
        .map(data => {
            let user = {
                id: data.uid,
                name: data.username,
                email: data.email,
            }

            let expireTime, expireDays
            let subLink = ""

            if (data["services"] && data["services"].length > 0) {
                let info = data["services"][0]
                subLink = info["sublink"]
                store.subLink(subLink)


                user.plan = info
                user.vip = info['packageid']
                user.vipName = info['package']
                let expireDate = new Date(info['expire_date'])
                expireTime = expireDate.toLocaleDateString().split(' ')[0]
                expireDays = parseInt(((expireDate.getTime() - new Date().getTime()) / 86400000).toString()) + 1

                let traffic = []

                function getTrafficByte(numUnit) {
                    let items = numUnit.split(' ')
                    if (!items || items.length !== 2) {
                        return 0
                    }
                    let total = 0
                    switch (items[1]) {
                        case "KB":
                            total = items[0] * 1024;
                            break
                        case "GB":
                            total = items[0] * 1024 * 1024;
                            break
                        case "TB":
                            total = items[0] * 1024 * 1024 * 1024;
                            break
                    }
                    return total
                }

                traffic.push(getTrafficByte(info['traffic']))
                traffic.push(getTrafficByte(info['used_traffic']))
                traffic.push(getTrafficByte(info['today']) / 1024)
                user.traffic = traffic

            } else {
                expireDays = -1
                expireTime = string.getString('userClassExpireTimeNone')

                user.traffic = [0, 0, 0]
            }

            user.vipExpireDays = expireDays
            user.vipExpireTime = expireTime

            store.user(user)

            return {user: user, subLink: subLink}
        })
}

exports.login = (data) => loginTo(data.email, data.passwd, data.code)

exports.auth = () => loginTo(store.username(), store.password())

exports.register = (data) => {
    return getToken()
        .mergeMap(token =>
            Http.post(url(URL_REGISTER), {
                email: data.email,
                name: data.email.split("@")[0],
                passwd: data.passwd,
                aff: data.code ?? "",
                code: data.emailcode ?? "",
                token: store.token()
            }, {Authorization: `Bearer ${store.token()}`})
                .mergeMap(data => parseData(data))
                .do(() => {
                    store.username(data.email)
                    store.password(data.passwd)
                })
        )
}

exports.code = (email) => {
    return Http.post(url(URL_CODE), {
        email: email,
        name: data.email.split("@")[0],
    }, {Authorization: `Bearer ${token}`})
        .mergeMap(data => parseData(data))
}

exports.forget = (data) =>
    getToken().mergeMap(token => Http.post(url(URL_FORGET), data, {Authorization: `Bearer ${token}`}).mergeMap(data => parseData(data)))

exports.requestUser = () => userInfo(store.username(), store.password())

exports.notice = () => Observable.of('')

exports.lines = () => Http.subLink("&client=meta")

exports.additional = () => Observable.of('{}')