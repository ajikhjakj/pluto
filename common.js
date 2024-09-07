const {PAY_TYPE_ALIPAY, PAY_SYSTEM_F2F} = require("./common");
const path = require("path");
exports.CAPTCHA_NONE = 1
exports.CAPTCHA_RECAPTCHA = 2
exports.CAPTCHA_GEETEST = 3


exports.TARGET_V2BOARD = 1
exports.TARGET_MALIO = 2
exports.TARGET_UIM_DEV = 3
exports.TARGET_UIM = 4
exports.TARGET_STAFF = 5
exports.TARGET_COOL = 6
exports.TARGET_SHUSHEN = 7
exports.TARGET_XMPLUS = 11

exports.PAY_SYSTEM_DISABLE = 0
exports.PAY_SYSTEM_AUTO = 1
exports.PAY_SYSTEM_PAYTARO = 2
exports.PAY_SYSTEM_LEYUPAY = 3
exports.PAY_SYSTEM_F2F = 4
exports.PAY_SYSTEM_WOLFPAY = 5
exports.PAY_SYSTEM_SMPAY = 6
exports.PAY_SYSTEM_MUGGLE = 7
exports.PAY_SYSTEM_SYM = 8
exports.PAY_SYSTEM_EPAY = 9
exports.PAY_SYSTEM_EASYPAY = 10

exports.PAY_TYPE_CUSTOM = 0
exports.PAY_TYPE_ALIPAY = 1
exports.PAY_TYPE_WECHAT = 2

exports.PAY_SYSTEM_VALUE_WOLFPAY = "wolfpay"
exports.PAY_SYSTEM_VALUE_LEYUPAY = "leyupay"
exports.PAY_SYSTEM_VALUE_PAYTARO = "paytaro"
exports.PAY_SYSTEM_VALUE_MUGGLE = "muggle"

let devMode = () => process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'beta'
exports.dev = () => devMode()

exports.log = (msg) => {
    if (devMode()) console.log(msg)
}

exports.configPath = () => {
    let _path = path.dirname(process.execPath).split('node_modules')[0]
    return _path.endsWith("/") ? _path.slice(0, -1) : _path
}

exports.noEmpty = function (...str) {
    for (let item of str) {
        if (item)
            return item
    }
    return null
}

exports.mergeUrl = (url, more) => (url.toString().endsWith('/') ? url.toString().substr(0, url.length) : url) + more

exports.payTypes = function (config) {
    let types = [];
    let alipay = parseInt(config['Alipay'])
    let wechat = parseInt(config['Wechat'])
    if (alipay === wechat) {
        switch (alipay) {
            case 0:
                break;
            case 2:
            case 5:
            case 10:
                types.push(0)
                break;
            default:
                types.push(1, 2)
                break;
        }
    } else {
        switch (alipay) {
            case 0:
                break;
            case 5:
                types.push(0)
                break;
            default:
                types.push(1)
                break;
        }
        switch (wechat) {
            case 0:
                break;
            case 5:
                types.push(0)
                break;
            default:
                types.push(2)
                break;
        }
    }

    if (config['Crypto']) {
        types.push(3)
    }

    return types;
}

exports.payMethod = function (type, target, config) {
    let alipay = parseInt(config['Alipay'])
    let wechat = parseInt(config['Wechat'])
    target = parseInt(target)
    switch (type) {
        case 0:
        case 1:
            if (target === 5 || target === 7 || [3, 4, 6, 8, 10].indexOf(alipay) !== -1) {
                return "alipay"
            }
            if (alipay === 7)
                return 'Alipay'
            return 'ALIPAY_WAP'
        case 2:
            if (target === 5 || target === 7 || [4, 6, 8, 10].indexOf(wechat) !== -1) {
                return "wxpay"
            }
            if (wechat === 3)
                return "wechat"
            if (wechat === 7)
                return "WECHAT"
            return "WXPAY"
        case 3:
            return "crypto"
    }
}

exports.payValue = (target) => {
    switch (parseInt(target)) {
        case 3:
            return "leyupay"
        case 5:
            return "wolfpay"
        case 2:
            return "paytaro"
        default:
            return ""
    }
}

exports.shouldQrCode = (type, target, config) => {
    return type === 1 && (parseInt(target) !== 1) && (parseInt(config['Alipay']) === 4)
}

exports.parseDate = (second) => {
    let flex = (num) => num >= 10 ? num : `0${num}`
    let date = new Date(second * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = flex(date.getMonth() + 1) + '-';
    let D = flex(date.getDate()) + ' ';
    let h = flex(date.getHours()) + ':';
    let m = flex(date.getMinutes()) + ':';
    let s = flex(date.getSeconds());
    return Y + M + D + h + m + s;
}
