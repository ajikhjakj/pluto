const Http = require('./commons/_http');
const store = require('./store');
const common = require('./common')
const malio = require('./api.malio')
const uim = require('./api.uim')
const v2b = require('./api.v2b')
const xmplus = require('./api.xmplus')

require('rxjs/add/observable/of');
require('rxjs/add/observable/zip');
require('rxjs/add/observable/throw');
require('rxjs/add/observable/merge');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');
const {Observable} = require("rxjs");
const string = require("./views/values/strings");

let target = () => store.remote('target')

function targetApi() {
    switch (target()) {
        case common.TARGET_V2BOARD:
            return v2b
        case common.TARGET_MALIO:
            return malio
        case common.TARGET_XMPLUS:
            return xmplus
        default:
            return uim
    }
}

exports.login = (data) => targetApi().login(data)
exports.register = (data) => targetApi().register(data)
exports.code = (email) => targetApi().code(email)
exports.forget = (data) => targetApi().forget(data)
exports.auth = () => targetApi().auth()
exports.requestUser = () => targetApi().requestUser()
exports.notice = () => targetApi().notice().retry(2)
exports.lines = () => targetApi().lines().retry(2)
exports.checkIn = (data = null) => targetApi().checkIn(data).do(msg => console.log(msg), err => console.log(err))
exports.trafficLogs = () => targetApi().trafficLogs()
exports.invite = () => targetApi().invite()
exports.inviteBackConfig = () => targetApi().inviteBackConfig()
exports.inviteBackTransfer = (amount) => targetApi().inviteBackTransfer(amount)
exports.inviteBackWithdraw = (amount, method) => targetApi().inviteBackWithdraw(amount, method)
exports.additional = () => targetApi().additional()
exports.store = () => targetApi().store()
exports.promo = (shopId, code) => targetApi().promo(shopId, code)
    .map(promo => {
        if (!promo.code) promo.code = code
        return promo
    })
    .do(data => console.log(data), err => console.log(err))
exports.balance = () => targetApi().balance()
    .do(data => {
        let user = store.user()
        if (user) {
            user.balance = data
        }
        store.user(user)
    })
    .do(data => console.log('balance:' + data))
exports.order = (data) => targetApi().order(data).do(data => console.log(JSON.stringify(data)))
// checkOrder than purchase it if need
exports.orderCheck = (id, order) => {
    // if (!id) {
    //     return Observable.throw(string.getString('orderPayErr'))
    // }
    let check = () => {
        let balance = parseFloat(store.user().balance || "0.0")
        let price = order.price ? order.price : order.amount
        let checkMoney = () => targetApi().balance().mergeMap(data => {
            console.log(`balance ${balance} ,, price ${price} ,, curr ${data}`)
            if (parseFloat(data ? data.toString() : "0.0") >= parseFloat(price ? price : "0.0") + balance) {
                return Observable.of('')
            }
            return Observable.throw(string.getString('orderPayErr'))
        })
        if (id) return targetApi().orderCheck(id).catch(() => checkMoney())
        return checkMoney()
    }
    return check()
        .do(data => console.log(JSON.stringify(data)), err => console.log(err))
        .mergeMap(data => {
            if (order && order.id) {
                return targetApi().orderPlan(order.id, order.promo).map(() => data)
            }
            return Observable.of(data)
        })
        .do(data => console.log(JSON.stringify(data)), err => console.log(err))
}