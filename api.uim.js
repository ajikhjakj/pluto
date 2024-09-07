let malio = require('./api.malio')
const Http = require("./commons/_http");
const store = require("./store");
const common = require('./common')
const string = require("./views/values/strings");

require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/catch');
const {Observable} = require("rxjs");

const TYPE_TOKEN_REQUIRE = "__need_token";
const URL_PAY_REQUEST = "/user/payment/purchase" + TYPE_TOKEN_REQUIRE;
const URL_SHOP_PURCHASE = "/user/buy" + TYPE_TOKEN_REQUIRE;
const URL_CODE = '/auth/send';

function url(expands) {
    return store.host() + expands;
}

function parseData(data) {
    if (typeof data === 'string' && (data.startsWith("{") || data.startsWith("["))) {
        data = JSON.parse(data)
    } else {
        return Observable.of(data)
    }
    let errReturn = () => {
        if (data.hasOwnProperty('msg')) {
            return Observable.throw(data['msg'])
        }
        if (data.hasOwnProperty('errmsg')) {
            return Observable.throw(data['errmsg'])
        }
        return Observable.throw(string.getString('unknownErr'))
    }
    if (data.hasOwnProperty('ret')) {
        if (data['ret'] !== 1) {
            return errReturn()
        }
    } else if (data.hasOwnProperty('code')) {
        if (!data['code'] || (parseInt(data['code']) !== 0 && parseInt(data['code']) !== 200)) {
            return errReturn()
        }
    } else if (data.hasOwnProperty('errcode')) {
        if (!data['errcode'] || (parseInt(data['errcode']) !== 0 && parseInt(data['errcode']) !== 200)) {
            return errReturn()
        }
    }
    return Observable.of(data)
}

let staff = () => store.remote('target') === common.TARGET_STAFF
let shushen = () => store.remote('target') === common.TARGET_SHUSHEN

exports.login = (data) => malio.login(data)
exports.register = (data) => malio.register(data)
exports.code = (email) => malio.code(email).catch(() => Http.post(url(URL_CODE), {'email': email}))
exports.forget = (data) => malio.forget(data)
exports.auth = () => malio.auth()
exports.requestUser = () => malio.requestUser()
exports.notice = () => malio.notice()
exports.lines = () => malio.lines()
exports.checkIn = (data) => malio.checkIn(data)
exports.invite = () => malio.invite()
exports.additional = () => Observable.of('')
exports.store = () => malio.store()
exports.promo = (shopId, code) => malio.promo(shopId, code).do(data => console.log(data), err => console.log(err))
exports.balance = () => malio.balance()
exports.order = (data) => {
    let _type = parseInt(data.type)
    if (staff() || shushen()) {
        switch (_type) {
            // 余额支付
            case -1:
                return purchase(data).map(() => {
                    return {finished: true}
                })
            // 融合支付
            default:
                return purchase(data)
                    .mergeMap(data => parseData(data))
                    .map(data => {
                        let res = {
                            finished: false,
                            payType: common.payMethod(data.type, store.remote('target'), store.remote('payment_config')),
                        };
                        if (typeof data === 'string') {
                            res.url = data
                        } else {
                            res.qrcode = 'qrcode' === data.type
                            res.payId = common.noEmpty(data.pid, data.tradeno)
                            res.url = common.noEmpty(data.result ? data.result.url : null, data.url, data.qrcode, '')
                        }
                        return res
                    }).mergeMap(data => {
                        if (!data.url) {
                            return Observable.throw(string.getString('orderErr'))
                        }
                        return Observable.of(data)
                    }).map(data => {
                        if (!data.qrcode) data.qrcode = common.shouldQrCode(_type, store.remote('target'), store.remote('payment_config'))
                        return data
                    })
        }
    }
    return malio.order(data)
}
exports.orderCheck = (id) => malio.orderCheck(id)

exports.orderPlan = (shopId, code) => {
    if (staff()) return Observable.of('')
    return malio.orderPlan(shopId, code)
}

let purchase = (data) => {
    let total = data.type < 0 ? data.total : data.price
    let body = {
        price: total,
        amount: total,
        type: common.payMethod(data.type, store.remote('target'), store.remote('payment_config')),
        shopid: data.id,
        autorenew: false,
        shopauto: false,
        disableothers: false,
        coupon_code: data.promo,
        shopcoupon: data.promo,
        payment: common.payValue(store.remote('target')),
        client: "web",
        mobile: false,
    }
    let r1 = () => {
        body['autorenew'] = 0
        body['shopauto'] = 0
        body['disableothers'] = 1
        body['payment'] = 'bgpay'
        return body
    }
    return Http.post(url(URL_PAY_REQUEST), body)
        .catch(() => Http.post(url(URL_PAY_REQUEST), r1()))
        .mergeMap(res => {
            if (JSON.parse(res).ret === 0) return buy(data)
            return Observable.of(res)
        })
        .mergeMap(data => parseData(data))
}

let buy = (data) => {
    let body = {
        coupon_code: data.promo,
        coupon: data.promo,
        shopid: data.id,
        shop: data.id,
        autorenew: 0,
        disableothers: 1,
    }
    return Http.post(url(URL_SHOP_PURCHASE), body)
}
