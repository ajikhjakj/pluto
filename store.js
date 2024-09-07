const Store = require('electron-store');

const schema = {
    first: {
        type: 'boolean',
        default: true
    },
    userDataPath: {type: 'string'},
    host: {
        type: 'string',
    },
    login: {
        type: 'boolean',
        default: false
    },
    username: {type: 'string'},
    password: {type: 'string'},

    ptLineExcludeLoc: {type: 'boolean', default: true},
    ptMalioPlans: {type: 'boolean', default: true},

    connected: {type: 'boolean', default: false},
    route: {type: 'string', default: 'Rule'},
    tap: {type: 'boolean', default: false},
    tun: {type: 'boolean', default: false},
    tunInstalled: {type: 'boolean', default: false},

    openAtLogin: {type: 'boolean', default: true},
};

const store = new Store({schema});

exports.get = (key) => store.get(key)
exports.set = (key, value) => store.set(key, value)

function getOrSet(key, value = null) {
    if (value === null) {
        return store.get(key)
    }
    store.set(key, value)
    return null
}

exports.first = () => {
    let first = getOrSet('first')
    getOrSet('first', false)
    return first
}

exports.userDataPath = function (value = null) {
    return getOrSet('userDataPath', value)
}

exports.remote = function (value = null) {
    if (typeof value === "string") {
        return getOrSet('remote')[value]
    }
    return getOrSet('remote', value)
}

exports.additional = (value = null) => getOrSet('additional', value)
exports.username = (value = null) => getOrSet('u_u', value)
exports.password = (value = null) => getOrSet('u_p', value)
exports.secCode = (value = null) => getOrSet('u_sc', value)
exports.host = (value = null) => getOrSet('host', value)
exports.hostSource = () => getOrSet('remote')['host_source'] ?? getOrSet('host')
exports.isLogin = (value = null) => getOrSet('login', value)
exports.version = () => store.get('version')
exports.versionData = (value) => getOrSet('versionData', value)
exports.versionCheckUrl = (value) => getOrSet('versionCheckUrl', value)
exports.versionNew = (value) => getOrSet('versionNew', value)
exports.versionNewNull = () => store.set('versionNew', null)
exports.user = (value = null) => getOrSet("user", value)
exports.subLink = (value = null) => getOrSet('subLink', value)
exports.subLinkSpare = () => {
    let sub = store.get('subLink')
    if (!sub) return ''
    let url = new URL(sub)
    url.host = store.get('host')?.toString().replace('https://', '').replace('http://', '')
    return url.href
}
exports.token = (value = null) => getOrSet('token', value)

exports.clashConfigPath = ''
exports.proxyGroup = (value = null) => getOrSet('proxyGroup', value)
exports.line = (value = null) => getOrSet('line', value)
exports.connected = (value = null) => getOrSet('connected', value)
exports.route = (value = null) => getOrSet('route', value)
exports.tap = (value = null) => getOrSet('tap', value)
exports.tun = (value = null) => getOrSet('tun', value)
exports.tunInstalled = (value = null) => getOrSet('tunInstalled', value)

exports.openAtLogin = (value = null) => getOrSet('openAtLogin', value)
exports.locale = (value = null) => getOrSet('locale', value)

exports.noticeDisplay = (id) => {
    let last = getOrSet('noticeLastDate') ? new Date(getOrSet('noticeLastDate')) : new Date()
    getOrSet('noticeLastId', id)
    getOrSet('noticeLastDate', new Date().getTime())
    switch (getOrSet('remote')['notice']) {
        case 2:
            return last.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
        case 3:
            return store.get('noticeLastId') !== id
        default:
            return true
    }
}

function isVip() {
    return getOrSet("user").hasOwnProperty('vipExpireDays')
        && getOrSet("user")['vipExpireDays'] !== null
        && (getOrSet("user")['vipExpireDays'] > 0 || getOrSet("user")['vipExpireDays'] === '∞')
}

exports.vip = () => isVip()
exports.vipExpireSoon = () => isVip() && getOrSet('user')['vipExpireDays'] !== '∞' && getOrSet('user')['vipExpireDays'] <= 3
exports.vipExpire = () => isVip() && getOrSet('user')['vipExpireDays'] !== '∞' && getOrSet('user')['vipExpireDays'] <= 0

function hasTraffic() {
    if (!getOrSet("user").hasOwnProperty("traffic")) return false
    let traffic = getOrSet("user")['traffic']
    return !(!traffic || traffic.length < 2);
}

function isTrafficEnable() {
    if (!hasTraffic()) return false
    let traffic = getOrSet("user")['traffic']
    return parseFloat(traffic[0]) > parseFloat(traffic[1])
}

exports.trafficEnable = () => isTrafficEnable()
exports.trafficOutSoon = () => {
    if (!isTrafficEnable()) return false
    let traffic = getOrSet("user")['traffic']
    return traffic[0] - traffic[1] <= 3 * 1024 * 1024
}
exports.trafficOut = () => {
    if (!hasTraffic()) return false
    let traffic = getOrSet("user")['traffic']
    return parseFloat(traffic[0]) <= parseFloat(traffic[1])
}

exports.clearUser = function () {
    store.set('login', false)
    store.set('connected', false)
    store.set('cookie', null)
    store.set('token', null)
    store.set('user', null)
    store.set('line', null)
    store.set('subLink', null)
    store.set('proxyGroup', null)
}

exports.clear = function () {
    store.clear()
}