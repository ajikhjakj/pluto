let malio = require('./api.malio')
const Http = require("./commons/_http");
const store = require("./store");
const common = require('./common')
const configs = require('./.config')
const string = require("./views/values/strings");

require('rxjs/add/observable/zip');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/takeWhile');
require('rxjs/add/operator/catch');
const {Observable, config} = require("rxjs");

const TYPE_TOKEN_REQUIRE = "__need_token";

const URL_LOGIN = "/passport/auth/login"
const URL_REGISTER = "/passport/auth/register"
const URL_CODE = '/passport/comm/sendEmailVerify'
const URL_FORGET = '/passport/auth/forget'
const URL_USERINFO = '/user/info' + TYPE_TOKEN_REQUIRE
const URL_USERINFO2 = '/user/getSubscribe' + TYPE_TOKEN_REQUIRE
const URL_NOTICE = '/user/notice/fetch' + TYPE_TOKEN_REQUIRE
const URL_STORE = '/user/plan/fetch' + TYPE_TOKEN_REQUIRE
const URL_PROMO = '/user/coupon/check' + TYPE_TOKEN_REQUIRE
const URL_PAY_REQUEST = "/user/order/checkout" + TYPE_TOKEN_REQUIRE
const URL_PAY_QUERY = "/user/order/check" + TYPE_TOKEN_REQUIRE
const URL_PAY_TYPES = "/user/order/getPaymentMethod" + TYPE_TOKEN_REQUIRE
const URL_ORDER_LIST = '/user/order/fetch' + TYPE_TOKEN_REQUIRE
const URL_ORDER_DETAIL = '/user/order/details' + TYPE_TOKEN_REQUIRE
const URL_ORDER_CREATE = '/user/order/save' + TYPE_TOKEN_REQUIRE
const URL_ORDER_CANCEL = '/user/order/cancel' + TYPE_TOKEN_REQUIRE
const URL_INVITE_CREATE = '/user/invite/save' + TYPE_TOKEN_REQUIRE
const URL_INVITE_FETCH = '/user/invite/fetch' + TYPE_TOKEN_REQUIRE
const URL_INVITE_DETAIL = '/user/invite/details' + TYPE_TOKEN_REQUIRE
const URL_INVITE_BACK_CONFIG = "/user/comm/config" + TYPE_TOKEN_REQUIRE
const URL_INVITE_BACK_TRANSFER = "/user/transfer" + TYPE_TOKEN_REQUIRE
const URL_INVITE_BACK_WITHDRAW = "/user/ticket/withdraw" + TYPE_TOKEN_REQUIRE
const URL_TRAFFIC_LOGS = "/user/stat/getTrafficLog" + TYPE_TOKEN_REQUIRE

function url(expands) {
    return store.host() + (store.host().endsWith('/') ? 'api/v1' : '/api/v1') + expands;
}

function parseData(data) {
    if (typeof data === 'string' && (data.startsWith("{") || data.startsWith("["))) {
        data = JSON.parse(data)
    } else {
        return Observable.of(data)
    }
    if (!data.hasOwnProperty('data') && data.hasOwnProperty('message')) {
        return Observable.throw(data['message'])
    }
    // return Observable.throw(string.getString('unknownErr'))
    if (data.hasOwnProperty('data')) {
        return Observable.of(data['data'])
    }
    return Observable.of(data)
}

exports.login = (data) => loginTo(data.email, data.passwd, data.code)
let loginTo = (email, passwd, code) => {
    let req = {
        email: email,
        password: passwd,
        code: code
    }
    return Http.post(url(URL_LOGIN), req)
        .mergeMap(data => parseData(data))
        .do(() => {
            store.username(email)
            store.password(passwd)
            store.secCode(code)
            store.isLogin(true)
        })
}
exports.register = (data) => {
    data.password = data.passwd
    data.email_code = data.emailcode
    data.invite_code = data.code
    if (!data.invite_code && configs.inviteCode) {
        data.invite_code = configs.inviteCode
    }
    return Http.post(url(URL_REGISTER), data)
        .mergeMap(data => parseData(data))
        .do(() => {
            store.username(data.email)
            store.password(data.passwd)
        })
}
exports.code = (email) => {
    return Http.post(url(URL_CODE), {email: email}).mergeMap(data => parseData(data))
}
exports.forget = (data) => {
    return Http.post(url(URL_FORGET), data).mergeMap(data => parseData(data))
}

exports.trafficLogs = () => Http.get(url(URL_TRAFFIC_LOGS)).mergeMap(data => parseData(data))
    .map(data => {
        data.forEach(item => item.date = common.parseDate(item['record_at']).split(' ')[0])
        return data
    })

exports.invite = () => Http.get(url(URL_INVITE_FETCH))
    .mergeMap(data => parseData(data))
    .mergeMap(data => {
        let next = () => {
            return Observable.zip(Http.get(url(URL_INVITE_FETCH)).mergeMap(data => parseData(data)), Http.get(url(URL_INVITE_DETAIL)).mergeMap(data => parseData(data)))
        }
        if (data['codes'].length > 0) {
            return next()
        }
        return Http.get(url(URL_INVITE_CREATE)).mergeMap(() => next())
    })
    .map(data => {
        let invite = {code: [], backList: []}
        data[0]['codes']?.forEach(code => invite.code.push(code.hasOwnProperty('code') ? code['code'] : code))
        data[1].forEach(item => invite.backList.push({
            time: item.createDate || common.parseDate(item['created_at']),
            back: ((item.balance ? item.balance : item['commission_balance'] ? item['commission_balance'] : item['get_amount'] ? item['get_amount'] : 0) / 100).toFixed(2),
            id: item.id
        }))
        invite['inviteNum'] = data[0]['stat'][0]
        invite['backSum'] = (data[0]['stat'][1] / 100).toFixed(2)
        invite['backRate'] = data[0]['stat'][3]
        invite['backCurr'] = (data[0]['stat'][4] / 100).toFixed(2)
        invite.host = common.mergeUrl(store.remote()['host_source'] ? store.remote()['host_source'] : (data.host ? data.host : store.host()), '/#/register?code=')
        return invite
    })

exports.inviteBackConfig = () => Http.get(url(URL_INVITE_BACK_CONFIG)).mergeMap(data => parseData(data))
exports.inviteBackTransfer = (amount) => Http.post(url(URL_INVITE_BACK_TRANSFER), {'transfer_amount': amount ? (amount * 100).toFixed(0) : 0}).mergeMap(data => parseData(data))
exports.inviteBackWithdraw = (amount, method) =>
    Http.post(url(URL_INVITE_BACK_WITHDRAW), {withdraw_account: amount, withdraw_method: method})
        .mergeMap(data => parseData(data))

exports.auth = () => loginTo(store.username(), store.password(), store.secCode())
exports.requestUser = () => userInfo()
let userInfo = () => {
    return Observable.zip(
        Http.get(url(URL_USERINFO)).mergeMap(data => parseData(data)),
        Http.get(url(URL_USERINFO2))
            .mergeMap(data => parseData(data))
            .map(data => data ? data.data ? data.data : data : {})
    ).map(data => {
        let user1 = data[0]
        let user2 = data[1]
        let expireTime, expireDays

        // 如果没有plan，则设置为过期套餐
        if (!user2.plan) {
            expireDays = -1
            expireTime = string.getString('userClassExpireTimeNone')
        } else {
            if (user2['expired_at']) {
                let expireDate = new Date(user2['expired_at'] * 1000)
                expireTime = expireDate.toLocaleDateString().split(' ')[0]
                expireDays = parseInt(((expireDate.getTime() - new Date().getTime()) / 86400000).toString()) + 1
            }
        }

        let user = {
            id: user2.id,
            name: user2.email,
            email: user2.email,
            plan: user2.plan,
            balance: ((Math.max(parseFloat(user1.balance ? user1.balance : 0), parseFloat(user2.balance ? user2.balance : 0))) / 100).toFixed(2),
            vip: user2.plan_id,
            vipName: user2.plan?.name,
            vipExpireDays: expireDays || expireDays === 0 ? expireDays : '∞',
            vipExpireTime: expireTime || string.getString('userClassExpireTimeUnlimited'),
            traffic: [(user2['transfer_enable'] || 0) / 1024, user2.u / 1024 + user2.d / 1024, (user2.plan ? user2.plan['transfer_enable'] || 0 : 0) * 1024 * 1024],
            avatar: user1['avatar_url'],
        };
        store.user(user)
        store.subLink(user2['subscribe_url'])
        return {'user': user, 'subLink': user2['subscribe_url']}
    })
}
exports.notice = () => Http.get(url(URL_NOTICE)).mergeMap(data => parseData(data)).map(data => data ? data[0] : {})
    .map(data => {
        data.date = new Date(data.created_at * 1000).toLocaleDateString()
        data.content = data.content?.replaceAll('\n', '<br/>')
        return data
    })
exports.lines = () => {
    // Check if subLink is null
    if (!store.subLink() || store.subLink().toString().trim().length === 0) {
        return Observable.of('{}')
    }
    // return Http.fetchGet(store.subLink() + "&flag=clash").catch(() => Http.fetchGet(store.subLinkSpare() + '&flag=clash'))
    // return Http.subLink("&flag=clash")
    return Http.subLink("", 'clash-verge/1.18.0')
}
exports.checkIn = (data) => malio.checkIn(data)
exports.additional = () => {
    if (store.isLogin()) {
        return Http.get(url(URL_PAY_TYPES)).mergeMap(data => parseData(data)).map(data => {
            return {'payTypes': data}
        })
    }
    return Observable.throw('')
}
exports.store = () => Http.get(url(URL_STORE))
    .mergeMap(data => parseData(data))
    .map(data => data.filter(function (item) {
        return item.show === 1;
    }))
    .map(data => {
        data.forEach(it => {
            let p = common.noEmpty(it.month_price, it.quarter_price, it.half_year_price, it.year_price, it.two_year_price, it.three_year_price, it.onetime_price)
            it.price = parsePrice(p)
            it.extra = []
            it.extra.push({
                content: it.content
            })
            it.cycle = [];
            if (it.month_price) it.cycle.push({
                'name': '月付',
                'price': parsePrice(it.month_price),
                'value': 'month_price'
            })
            if (it.quarter_price) it.cycle.push({
                'name': '季付',
                'price': parsePrice(it.quarter_price),
                'value': 'quarter_price'
            })
            if (it.half_year_price) it.cycle.push({
                'name': '半年付',
                'price': parsePrice(it.half_year_price),
                'value': 'half_year_price'
            })
            if (it.year_price) it.cycle.push({
                'name': '年付',
                'price': parsePrice(it.year_price),
                'value': 'year_price'
            })
            if (it.two_year_price) it.cycle.push({
                'name': '两年付',
                'price': parsePrice(it.two_year_price),
                'value': 'two_year_price'
            })
            if (it.three_year_price) it.cycle.push({
                'name': '三年付',
                'price': parsePrice(it.three_year_price),
                'value': 'three_year_price'
            })
            if (it.onetime_price) it.cycle.push({
                'name': '一次性付款',
                'price': parsePrice(it.onetime_price),
                'value': 'onetime_price'
            })
            if (it.reset_price) it.cycle.push({
                'price': parsePrice(it.reset_price),
                'value': 'reset_price',
                'display': 'none'
            })
        })
        return data
    })
exports.promo = (shopId, code) => Http.post(url(URL_PROMO), {
    'code': code,
    'plan_id': shopId
}).mergeMap(data => parseData(data)).map(data => {
    // V1.7.0 以上不能 / 100
    // data.value = parseFloat(parsePrice(data.value))
    return data
})
exports.balance = () => userInfo().map(data => data.user.balance)
exports.order = (data) => {
    return clearOrder()
        .mergeMap(() => createOrder({
            'plan_id': data.id,
            'cycle': data.cycle,
            'coupon_code': data.promo,
            'period': data.cycle
        }))
        .mergeMap(id => requestPay(id, data.type))
}
exports.orderCheck = (id) => orderCheck(id)
exports.orderPlan = (shopId, code) => Observable.of('')

let createOrder = (data) => Http.post(url(URL_ORDER_CREATE), data)
    .mergeMap(data => parseData(data))
    .map(data => common.noEmpty(data.value, data.data, data))
let orderDesc = (id) => Http.get(url(URL_ORDER_DETAIL) + `?trade_no=${id}`).mergeMap(data => parseData(data))
let orderCheck = (id) => Http.get(url(URL_PAY_QUERY) + `?trade_no=${id}`)
    .mergeMap(data => parseData(data))
    .mergeMap(data => {
        if (common.noEmpty(data.value, data.data, data.toString()) !== '0') return Observable.of(data)
        return Observable.throw(string.getString('orderPayErr'))
    })
let requestPay = (id, payType) => Http.post(url(URL_PAY_REQUEST), {'trade_no': id, 'method': payType})
    .mergeMap(data => parseData(data))
    .map(data => {
        let url = common.noEmpty(data.value, data.data, data)
        return {
            finished: common.noEmpty(data.value, data.data, data) === 'true',
            'url': url,
            qrcode: url.indexOf('qr.alipay.com') !== -1,
            payId: id,
            payType: payType
        }
    })
let orderList = () => Http.get(url(URL_ORDER_LIST)).mergeMap(data => parseData(data))
let orderCancel = (id) => Http.post(url(URL_ORDER_CANCEL), {'trade_no': id}).mergeMap(data => parseData(data))
let clearOrder = () => orderList()
    .mergeMap(data => {
        if (data) {
            for (let item of data) {
                if (item.status === 0) return orderCancel(item.trade_no)
            }
        }
        return Observable.of('')
    })


let parsePrice = (price) => ((price ? price : 0) / 100).toFixed(2)