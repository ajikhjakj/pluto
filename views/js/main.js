function isEmpty(str) {
    return str === null || str === undefined || str.length === 0
}

let formatTraffic = (traffic) => formatTraffic2Unit(traffic).join('')

function formatTraffic2Unit(traffic) {
    // MB
    let flow = traffic / 1024
    // 小于1G
    if (flow < 1024) {
        return [flow.toFixed(0), 'MB']
    }
    if (flow < 1024 * 1024) {
        return [(flow / 1024).toFixed(0), 'GB']
    }
    return [(flow / 1024 / 1024).toFixed(2), 'TB']
}

let formatTraffic2 = (traffic, fix = 2) => {
    let flow = traffic / 1024
    if (flow < 1024) return [flow.toFixed(fix), 'KB']
    if (flow < 1024 * 1024) return [(flow / 1024).toFixed(fix), 'MB']
    return [(flow / 1024 / 1024).toFixed(fix), 'GB']
}

function formatDelay(delay) {
    if (delay < 0) {
        return 'Err'
    }
    if (delay < 1000) {
        return delay.toString() + "ms"
    }
    if (delay < 10000) {
        return parseFloat(delay / 1000).toFixed(1) + 'Kms'
    }
    return parseInt(delay / 1000) + 'Kms'
}

function formatConnectTime(second) {
    let hour = parseInt(second / 3600)
    let mint = parseInt(second % 3600 / 60)
    let sed = parseInt(second % 60)
    let hourStr = hour.toString()
    if (hour < 10) {
        hourStr = "0" + hourStr
    }
    let mintStr = mint.toString()
    if (mint < 10) {
        mintStr = "0" + mintStr
    }
    let sedStr = sed.toString()
    if (sed < 10) {
        sedStr = "0" + sedStr
    }
    return hourStr + ":" + mintStr + ":" + sedStr
}

/**************** req *****************/
let reqMainShow = () => window.api.send('toMain', ['mainShow'])
let reqSettings = () => window.api.send('toMain', ['settings'])
let reqCheckTap = () => window.api.send('toMain', ['tap.check'])
let reqCheckTun = (on) => window.api.send('toMain', ['tun.check', on])
let reqLogout = () => window.api.send('toMain', ['logout'])
let reqUser = () => window.api.send('toMain', ['user'])
let reqLineListClose = () => window.api.send('toMain', ['lineListClose'])
let reqLines = () => window.api.send('toMain', 'lines')
let reqConnect = () => window.api.send('toMain', 'connect')
let reqLineChanged = (name) => window.api.send('toMain', ['line', name])
let reqLinePing = (name, server) => window.api.send('toMain', ['linePing', name, server])
let reqLineSpeed = (name) => window.api.send('toMain', ['lineSpeed', name])
let reqCheckIn = () => window.api.send('toMain', ['checkIn'])
let reqEmail = () => window.location.href = 'mailto:' + getRemoteConfig('email')
let reqTg = () => window.location.href = getRemoteConfig('tg').toString()
    .replaceAll('https://t.me/', 'tg://resolve?domain=').replaceAll('@', 'tg://resolve?domain=')
let reqNotice = () => window.api.send('toMain', 'notice')
let reqTrafficLogs = () => window.api.send('toMain', 'trafficLogs')
let reqInvite = () => window.api.send('toMain', 'invite')

let reqInviteBackConfig = () => window.api.send('toMain', 'inviteBackConfig')
let reqInviteBackTransfer = (amount) => window.api.send('toMain', ['inviteBackTransfer', amount])
let reqInviteBackWithdraw = (amount, method) => window.api.send('toMain', ['inviteBackWithdraw', amount, method])
let reqStore = () => window.api.send('toMain', 'store')
let reqStoreOrder = (payType, recharge = false, price = 0) =>
    window.api.send('toMain', ['order', {
        id: recharge ? 0 : getStoreId(),
        type: payType,
        cycle: cycle ? cycle.value : "",
        price: recharge ? price : getPriceDesc().amount,
        total: recharge ? price : getPriceDesc().price,
        promo: recharge ? "" : getPromoCode()
    }])
let reqPromo = (code, storeId = getStoreId()) => window.api.send('toMain', ['promo', storeId, code])
let reqBalance = () => window.api.send('toMain', 'balance')
let reqProxyShare = () => window.api.send('toMain', 'proxyShare')

/**************** res *****************/
const CYCLE_RESET_TRAFFIC = 'reset_price'

let config = null;
let getConfig = null;
let onGetConfig = (callback) => getConfig = callback
let getRemoteConfig = (key) => (key && config) ? config[key] : null
let isV2b = () => parseInt(getRemoteConfig('target')) === 1
let isMalio = () => parseInt(getRemoteConfig('target')) === 2
let isMalioPlan = () => isMalio() && parseInt(getRemoteConfig('malio_plans')) === 1
let isXmplus = () => parseInt(getRemoteConfig('target')) === 11

let getSettingsCallback = null
let onGetSettings = (callback) => getSettingsCallback = callback
let saveSettings = (args) => window.api.send('toMain', ['settings', args])

let additional = null
let getAdditionalConfig = null
let getAdditional = () => additional
let onGetAdditional = (callback) => getAdditionalConfig = callback

let getAnimators = null
let onGetAnimators = (callback) => getAnimators = callback

let getTips = null
let onGetTips = (callback) => getTips = callback

let getNotice = null;
let onGetNotice = (callback) => getNotice = callback;

let trafficLogsCallback = null
let onGetTrafficLogs = (callback) => trafficLogsCallback = callback

let inviteCallback = null
let onGetInvite = (callback) => inviteCallback = callback


let inviteBackConfigCallback = null
let onGetInviteBackConfig = (callback) => inviteBackConfigCallback = callback

let inviteBackTransferCallback = null
let onGetInviteBackTransfer = (callback) => inviteBackTransferCallback = callback

let inviteBackWithdrawCallback = null
let onGetInviteBackWithdraw = (callback) => inviteBackWithdrawCallback = callback

// let withdrawMethod = null
// let selectWithdrawMethod = (value) => {
//     for (let item of store.cycle) {
//         if (value === item.value) withdrawMethod = item
//     }
// }

let signChangedCallback = null
let onSignChanged = (callback) => signChangedCallback = callback

let _user
let userLevel
let userCallback = null;
let getUser = () => _user
let onGetUser = (callback) => userCallback = callback

let line = null;
let getLineCallback = null;
let onGetLine = (callback) => getLineCallback = callback
let getLine = () => line

let getLines = null;
let onGetLines = (callback) => getLines = callback

let getLinesNone = null
let onGetLinesNone = (callback) => getLinesNone = callback

let connectedChanged = null;
let onConnectedChanged = (callback) => connectedChanged = callback

let trafficCallback = null
let onGetTraffic = (callback) => trafficCallback = callback

let getPing = null;
let onGetLinePing = (callback) => getPing = callback

let getSpeed = null;
let onGetLineSpeed = (callback) => getSpeed = callback

let checkIn = null;
let onGetCheckIn = (callback) => checkIn = callback

let storeList = null
let getStoreListCallback = null
let onGetStoreList = (callback) => getStoreListCallback = callback

function getStoreList(id = null) {
    if (id !== null && storeList != null) {
        for (let item of storeList) {
            if (item.id.toString() === id.toString()) {
                return item
            }
        }
        return null
    }
    return storeList
}

function getPayTypes() {
    if (isV2b()) {
        return additional['payTypes']
    }
    if (config && config.hasOwnProperty('payTypes')) {
        return config['payTypes']
    }
    return []
}

let promo = null;
let getPromoCallback = null;
let onGetPromo = (callback) => getPromoCallback = callback
let getPromo = () => promo
let getPromoCode = () => promo ? promo.code : ''
let clearPromo = () => promo = null

let balance = null;
let balanceCallback = null;
let getBalance = () => balance ? parseFloat(balance) : 0
let onGetBalance = (callback) => balanceCallback = callback

let store = null;
let getStore = () => store
let getStoreId = () => store ? store.id : null
let selectStore = (id) => store = getStoreList(id)
let clearStore = () => store = null

let cycle = null
let getCycle = () => cycle
let selectCycle = (value) => {
    for (let item of store.cycle) {
        if (value === item.value) cycle = item
    }
}

let getProxyShareCallback = null
let onGetProxyShare = (callback) => getProxyShareCallback = callback

function getPriceDesc() {
    try {
        let price = cycle ? cycle.price : (store.price ? store.price : 0)
        let discount = 0
        let amount = parseFloat(price)
        let balance = getBalance()
        if (promo) {
            switch (promo.type) {
                case 1:
                    discount = promo.value ? promo.value : 0
                    break;
                default:
                    discount = (promo.value ? promo.value : 0) * price / 100
                    break
            }
            discount = discount.toFixed(2)
            amount -= discount
        }
        if (balance > 0) {
            if (balance > amount) {
                balance = amount
            }
            amount -= balance
        }
        return {
            balance: balance,
            amount: amount.toFixed(2),
            discount: discount,
            price: price,
        }
    } catch (e) {
        console.log(e)
        return {
            balance: 0,
            amount: -1,
            discount: 0,
            price: 0
        }
    }
}

let onGetOrderCallback = null
let onGetOrder = (callback) => onGetOrderCallback = callback

let openWeb = (url) => window.api.send('toMain', ['web', url])

let openWebsiteSource = () => window.api.send('toMain', ['websiteSource'])

let reqConfig = () => window.api.send('toMain', 'config')
let reqAdditional = () => window.api.send('toMain', 'additional')

let openChatbox = () => window.api.send('toMain', 'chatbox')

$(document).ready(function () {

    console.log("window.preload loading success!!! ")

    let done = (args, callback, next) => {
        if (next) next()
        if (callback) callback(args)
    }

    window.api.receive('msgErr', args => alertErr(args))
    window.api.receive('msgSuccess', args => alertSuccess(args))

    window.api.receive('getTips', args => done(args[0], getTips))

    window.api.receive('getConfig', (args) => done(args, getConfig, () => config = args))
    window.api.receive('getSettings', (args) => done(args[0], getSettingsCallback))
    window.api.receive('getAdditional', (args) => done(args, getAdditionalConfig, () => {
        additional = args
        if (isMalioPlan()) malioUpdateConfig(additional)
    }))
    window.api.receive('getAnimators', (args) => done(args[0], getAnimators))
    window.api.receive('signChanged', (args) => done(args, signChangedCallback, () => reqStore()))
    window.api.receive('getUser', (args) => done(args, userCallback, () => {
        if (args !== null && args.hasOwnProperty('balance')) {
            balance = parseFloat(args['balance'])
        }
        _user = args
        userLevel = args ? args.vip : 0
    }))
    window.api.receive('getNotice', (args) => done(args, getNotice))
    window.api.receive('getLine', (args) => done(args, getLineCallback, () => line = args))
    window.api.receive('getLines', (args) => done(args, getLines))
    window.api.receive('getLinesNone', (args) => done(args, getLinesNone))
    window.api.receive('connectedChanged', (args) => done(args, connectedChanged))
    window.api.receive('getT', (args) => done(args[0], trafficCallback))
    window.api.receive('getPing', (args) => done(args, getPing))
    window.api.receive('getSpeed', (args) => done(args, getSpeed))
    window.api.receive('getCheckIn', (args) => {
        if (checkIn !== null) {
            let success = args[0]
            if (success) {
                checkIn(args[1])
            } else {
                checkIn(null, args[1])
            }
        }
    })
    window.api.receive('getTrafficLogs', (args) => done(args, trafficLogsCallback))
    window.api.receive('getInvite', (args) => done(args, inviteCallback))
    window.api.receive('getInviteBackConfig', (args) => done(args, inviteBackConfigCallback))
    window.api.receive('getInviteBackTransfer', (args) => done(args, inviteBackTransferCallback))
    window.api.receive('getInviteBackWithdraw', (args) => done(args, inviteBackWithdrawCallback))
    window.api.receive('getStore', (args) => done(args, getStoreListCallback, () => {
        storeList = args[0]
        if (isMalioPlan()) malioUpdatePlans(storeList)
    }))
    window.api.receive('getPromo', (args) => done(args, getPromoCallback, () => promo = args[0]))
    window.api.receive('getBalance', (args) => done(args, balanceCallback, () => balance = args))
    window.api.receive('getOrder', (args) => done(args, onGetOrderCallback))

    window.api.receive('getProxyShare', (args) => done(args[0], getProxyShareCallback))
})