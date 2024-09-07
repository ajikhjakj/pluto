const Http = require('./commons/_http');
const store = require('./store');
const common = require('./common')
const configs = require('./.config')
const string = require('./views/values/strings')

require('rxjs/add/observable/of');
require('rxjs/add/observable/zip');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');
require('rxjs/add/operator/takeWhile');
require('rxjs/add/operator/take');
require('rxjs/add/operator/toArray');
const {Observable, config} = require("rxjs");

const TYPE_TOKEN_REQUIRE = "__need_token";
const URL_LOGIN = "/auth/login";
const URL_REGISTER = "/auth/register";
const URL_CODE = '/auth/send';
const URL_FORGET = '/password/reset';
const URL_AUTH = "/authorization";
const URL_NOTICE = "/notice";
const URL_USERINFO = '/getuserinfo' + TYPE_TOKEN_REQUIRE;
const URL_CHECK_IN = '/user/checkin' + TYPE_TOKEN_REQUIRE;
const URL_STORE = '/user/shop?format=json' + TYPE_TOKEN_REQUIRE;
const URL_PROMO = '/user/coupon_check' + TYPE_TOKEN_REQUIRE;
const URL_BALANCE = "/user/money" + TYPE_TOKEN_REQUIRE;
const URL_PAY_REQUEST = "/user/payment/purchase" + TYPE_TOKEN_REQUIRE;
const URL_PAY_QUERY = "/payment/status" + TYPE_TOKEN_REQUIRE;
const URL_SHOP_PURCHASE = "/user/buy" + TYPE_TOKEN_REQUIRE;
const URL_INVITE = "/user/invite?format=json&size=1000" + TYPE_TOKEN_REQUIRE;

let notice = null
let url = (expands) => store.host() + expands

function parseData(data) {
    if (typeof data === 'string' && (data.startsWith("{") || data.startsWith("["))) {
        data = JSON.parse(data)
    } else {
        return Observable.of(data)
    }
    if (data.hasOwnProperty('ret')) {
        if (data['ret'] !== 1) {
            if (data.hasOwnProperty('msg')) {
                return Observable.throw(data['msg'])
            }
            if (data.hasOwnProperty('errmsg')) {
                return Observable.throw(data['errmsg'])
            }
            return Observable.throw(string.getString('unknownErr'))
        }
    }
    return Observable.of(data)
}

exports.additional = function () {
    return Http.get(url('/app/config'))
        .mergeMap(data => parseData(data))
}

exports.login = function (data) {
    return Http.post(url(URL_LOGIN), data)
        .mergeMap(data => parseData(data))
        .do(() => {
            store.username(data.email)
            store.password(data.passwd)
            store.isLogin(true)
        })
}

exports.register = function (data) {
    data.imtype = 1
    data.wechat = 'pluto'
    if (!data.code && configs.inviteCode) {
        data.code = configs.inviteCode
    }
    return Http.post(url(URL_REGISTER), data)
        .mergeMap(data => parseData(data))
        .do(() => {
            store.username(data.email)
            store.password(data.passwd)
        })
}

exports.code = function (email) {
    return Http.post(url(URL_CODE), {
        email: email,
        Referer: url(URL_REGISTER)
    }).do(data => console.log(data), err => console.log(err)).mergeMap(data => parseData(data))
}

exports.forget = function (data) {
    return Http.post(url(URL_FORGET), data).do(data => console.log(data), err => console.log(err)).mergeMap(data => parseData(data))
}

exports.auth = function () {
    return Http.get(url(URL_AUTH + "?email=" + store.username() + "&passwd=" + store.password()))
        .mergeMap(data => parseData(data))
        .do(data => console.log(JSON.stringify(data)))
}

exports.requestUser = function () {
    return userinfo()
}

function userinfo() {
    return Http.get(url(URL_USERINFO))
        .mergeMap(data => parseData(data))
        .map(data => {
            console.log(JSON.stringify(data))
            if (data !== null && data.info !== null && data.info.user != null) {
                let u = data.info.user;
                let classExpireDay = 0;
                if (u.class > 0) {
                    classExpireDay = parseInt(((new Date(u['class_expire']).getTime() - new Date().getTime()) / 1000 / 86400).toString()) + 1
                }
                let user = {
                    id: u.id,
                    name: u['user_name'],
                    email: u.email,
                    plan: u.plan,
                    balance: u['money'],
                    vip: u.class,
                    vipName: u.plan,
                    vipExpireDays: classExpireDay || 0,
                    vipExpireTime: u['class_expire'].split(' ')[0],
                    traffic: [u['transfer_enable'] / 1024, u.u / 1024 + u.d / 1024, u.u / 1024 + u.d / 1024 - u['last_day_t'] / 1024],
                    signIn: new Date(u['last_check_in_time'] * 1000).toDateString() === new Date().toDateString(),
                    avatar: data.info['gravatar'],
                };

                // clash = 1 v2
                // clash = 2 v2 & ssr
                let sb = data.info['subUrl'] + data.info['ssrSubToken'] + (configs.lineMeta === 1 ? '?clashmeta=1' : '?clash=1')
                store.user(user)
                store.subLink(sb)
                return {'user': user, 'notice': data.info['ann'], 'subLink': sb}
            }
        })
}

exports.notice = () => Http.get(url(URL_NOTICE)).mergeMap(data => parseData(data)).map(data => data.data)

exports.lines = () => Http.subLink()
// Http.fetchGet(store.subLink()).catch(() => Http.get(store.subLinkSpare()))

exports.checkIn = function (data = null) {
    return Http.post(url(URL_CHECK_IN), data)
        .mergeMap(data => parseData(data))
        .map(data => data.msg)
}

exports.invite = () => Http.get(url(URL_INVITE)).mergeMap(data => parseData(data)).map(data => {
    let invite = {
        inviteNum: data['invite_num'],
        backRate: data['code_payback'],
        backSum: data['paybacks_sum'],
        backNum: data['paybacks'] ? data['paybacks'].total : 0,
        backList: [],
        code: [],
    }
    invite.code.push(data.code?.code)
    data['paybacks']['data']?.forEach(item => invite.backList.push({
        id: item.id,
        total: item.total,
        userId: item['user_id'],
        back: item['ref_get'],
        time: new Date(item['datetime'] * 1000).toLocaleString(),
    }))
    invite.host = common.mergeUrl(store.remote()['host_source'] ? store.remote()['host_source'] : data.host ? data.host : store.host(), '/auth/register?code=')
    return invite
})

exports.store = function () {
    return Http.get(url(URL_STORE))
        .mergeMap(data => parseData(data))
        .map(data => data.list.filter(function (item) {
            return item.status === 1;
        }))
        .map(data => {
            for (let item of data) {
                let extras = []
                if (typeof item.content === 'object') {
                    extras = item.content['content_extra'].split(';')
                } else if (typeof item.content === 'string') {
                    extras = JSON.parse(item.content)['content_extra'].split(';')
                }
                let extra = []
                for (let e of extras) {
                    let icon = e.indexOf('-')
                    extra.push({
                        type: 1,
                        icon: e.substr(0, icon),
                        content: e.substr(++icon)
                    })
                }
                item.extra = extra;
            }
            return data;
        })
}

exports.promo = function (shopId, code) {
    return Http.post(url(URL_PROMO), {
        shop: shopId,
        coupon: code
    }).mergeMap(data => parseData(data))
        .map(data => {
            data.value = data.credit?.toString().replace("%", '').trim()
            return data
        })
}

exports.balance = function () {
    return Http.get(url(URL_BALANCE))
        .mergeMap(data => parseData(data))
        .map(data => parseFloat(data.money))
        .catch(() => Observable.of(0))
}

exports.order = function (data) {
    switch (parseInt(data.type)) {
        // 余额支付
        case -1:
            return purchase(data.id, data.promo).map(() => {
                return {finished: true}
            })
        // 融合支付
        default:
            let _type = data.type
            let payType = common.payMethod(_type, store.remote('target'), store.remote('payment_config'))
            return Http.post(url(URL_PAY_REQUEST), {
                price: data.price,
                amount: data.price,
                type: payType
            }).mergeMap(data => parseData(data))
                .map(data => {
                    let res = {
                        finished: false,
                        payType: payType,
                    };
                    if (typeof data === 'string') {
                        res.url = data
                    } else {
                        res.payId = common.noEmpty(data.pid, data.tradeno)
                        res.url = common.noEmpty(data.result ? data.result.url : null, data.url, data.qrcode, data.code, '')
                    }
                    return res
                }).mergeMap(data => {
                    if (!data.url) {
                        return Observable.throw(string.getString('orderErr'))
                    }
                    return Observable.of(data)
                }).map(data => {
                    data.qrcode = common.shouldQrCode(_type, store.remote('target'), store.remote('payment_config'))
                    return data
                })
    }
}

exports.orderCheck = (id) => {
    return Http.post2(url(URL_PAY_QUERY), {tradeno: id})
        .catch(() => Observable.throw(string.getString('orderPayErr')))
        .mergeMap(data => parseData(data))
        .mergeMap(data => {
            let result = data.result;
            if (result && result.toString() !== '0') {
                return Observable.of(data)
            }
            return Observable.throw(string.getString('orderPayErr'))
        })
}

exports.orderPlan = (shopId, code) => purchase(shopId, code)

let purchase = (shopId, code) => Http.post(url(URL_SHOP_PURCHASE), {
    shop: shopId,
    coupon: code,
    autorenew: 0,
    disableothers: 0
}).mergeMap(data => parseData(data))