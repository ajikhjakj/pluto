// Modules to control application life and create native browser window
const {ipcMain, app, BrowserWindow, Tray, Menu, shell} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const clash = require('./clash')
const tap = require('./tap')
const remote = require('./remote')
const api = require('./api')
const store = require('./store')
const common = require('./common')
const string = require('./views/values/strings')
const configs = require('./.config')
const http = require('./commons/_http')
const log = require('./commons/log')

const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/from');
require('rxjs/add/observable/of');
require('rxjs/add/observable/zip');
require('rxjs/add/observable/throw');
require('rxjs/add/observable/interval');
require('rxjs/add/observable/timer');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');

let mainWindow, payWindow, tray;
let forceQuit = false;

let appIcon = path.join(__dirname, './views/img/ic_logo.64.png')
let trayIcons = [
    path.join(__dirname, './views/img/ic_logo.64.png'), path.join(__dirname, './views/img/ic_logo.g.64.png'), path.join(__dirname, './views/img/ic_logo.a.64.png')
]
let trayMacIcons = [
    path.join(__dirname, './views/img/ic_logo.Template.png'), path.join(__dirname, './views/img/ic_logo.g.Template.png'), path.join(__dirname, './views/img/ic_logo.g.Template.png')
]

let dockIcon = path.join(__dirname, './views/img/ic_logo.256.png')

// SingleInstance
if (!app.requestSingleInstanceLock()) app.quit()
app.on('second-instance', () => {
    mainWindow?.focus()
    mainWindow?.show()
})

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        icon: appIcon,
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: false,
            sandbox: false,
            devTools: common.dev(),
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '/views/splash.html'))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.webContents.on('crashed', () => {

    })

    mainWindow.on('close', function (e) {
        if (!forceQuit) {
            e.preventDefault();
            mainWindow?.hide()
            trafficStop()
        }
        forceQuit = false
    })

    mainWindow.on('minimize', function (e) {
        trafficStop()
    })

    mainWindow.on('restore', function (e) {
        trafficStartTry()
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    let locale = app.getLocale()
    if (locale !== 'zh-TW') {
        locale = locale.split('-')[0]
    }
    store.locale(locale)
    string._setLocale(locale)
    console.log('------------' + store.locale() + '   ' + app.getLocale())

    store.userDataPath(app.getPath('userData'))

    createWindow()

    tray = new Tray(trayIcons[0])
    tray.setContextMenu(generateTrayMenu(false))
    tray.on('double-click', () => {
        mainWindow.show()
        mainWindow.focus()
        trafficStartTry()
    })

    store.set('version', app.getVersion())

    // hide menu
    Menu.setApplicationMenu(null);
    // hide menu for Mac
    // if (process.platform === 'darwin') {
    //     app.dock.hide();
    // }
    if (process.platform === 'darwin') {
        app.dock.setIcon(dockIcon)
    }

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()

        common.log('---active')
        mainWindow?.show()
    })

    // 异常捕捉
    process.on('uncaughtException', err => {
        try {
            log.err(`${err.message}\n${err.stack}\n\n`)
        } catch (e) {
            console.log(e)
        }
        // openErr(err.message)
    })

    requestOpenAtLoginSettings()
    updateTray()

    // 注册失败回调
    clash.registerErrListener(err => {
        if (err) openErr(err)
    })

    clash.checkPermission()
        .subscribe(() => {
            store.connected(false)
            clash.open().subscribe(() => '', err => openErr(`${string.getString('coreErr')}${err}`))
        }, err => {
            openErr(string.getString('permissionErr') + "\n" + err, (event) => {
                if ('close' === event) quit()
            })
        })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => setTimeout(() => quit(), 100))

app.on('before-quit', event => setTimeout(() => quit(), 100))


function clearConfigAndRestart() {
    store.clear()
    log.clear()
    clearAnimators()
    app.relaunch();
    app.quit();
}

let quiting = false;

function quit() {
    if (quiting) return
    quiting = true
    forceQuit = true
    trafficStop()
    disconnect()

    let onKilling = () => {
        clash.close();
        quiting = false
        mainWindow = null
        app.quit()
        if (process.platform === 'darwin') app.exit()
    }

    // delay to close Proxy!
    setTimeout(() => onKilling(), process.platform === 'darwin' ? 300 : 100)
}

let updateOpenAtLogin = function (reverse = false) {
    let open = store.openAtLogin()
    if (reverse) {
        open = !open
        store.openAtLogin(open)
    }

    requestOpenAtLoginSettings()
    updateTray()
}

let requestOpenAtLoginSettings = function () {
    if (app.isPackaged) {
        app.setLoginItemSettings({openAtLogin: store.openAtLogin()})
    }
}

let restart = () => {
    app.relaunch()
    app.exit()
}

ipcMain.on('go', function (event, args) {
    switch (args) {
        case "main":
            goMain()
            break;
        case "login":
            goLogin()
            break;
        case 'register':
            go('/views/register.html')
            break
        case 'forget':
            go('/views/forget.html')
            break
    }
})

ipcMain.on('toMain', function (event, args) {
    if (args !== null) {
        let key = "";
        let value = [];
        if (args.constructor === String) {
            key = args;
        }
        if (args.constructor === Array) {
            key = args[0];
            args.shift()
            value = args;
        }
        switch (key) {
            case "init":
                // 配置语言
                fromMain('locale', store.locale())

                setTimeout(() => {
                    let goon = () => {
                        if (store.isLogin()) {
                            goMain(true)
                        } else {
                            goLogin()
                        }
                    }
                    // 检测更新
                    if (store.remote()) {
                        goon()
                        remote.chooseHosts()
                            .do(() => requestUpdate())
                            .do(() => loadingAnimator())
                            .catch(() => Observable.of(''))
                            .subscribe()
                    } else {
                        remote.chooseHosts()
                            .retry(2)
                            .do(() => goon())
                            .do(() => requestUpdate())
                            .do(() => loadingAnimator())
                            .subscribe(
                                () => console.log("Init Success!!"),
                                err => openErr(`${string.getString('configErr')}\n${err}`, () => quit())
                            )
                    }
                }, 500)
                break;
            case "config":
                let config = store.remote()
                config.arch = process.arch
                config.allowLan = configs.allowLan
                config.locale = store.locale()
                fromMain('getConfig', config)
                if (clash.ready()) {
                    postLines()
                }
                break
            case "mainShow":
                if (store.user()) getUser(mergeUser(store.user()))
                if (needSignWhenGoMain)
                    api.auth().retry(2).subscribe(() => reqUserAndNext(), () => '')
                else
                    reqUserAndNext()
                break;
            case 'additional':
                api.additional().subscribe(data => fromMain('getAdditional', data), () => '')
                break
            case 'settings':
                if (value && value[0]) {
                    let _route = store.route()
                    let _tap = store.tap()
                    let _tun = store.tun()
                    let settings = value[0]
                    // Route changed
                    if (settings.hasOwnProperty('route') && _route !== settings['route']) {
                        store.route(clash.ROUTES[parseInt(settings['route'])])
                        let next = () => store.connected() ? clash.resetConnect() : Observable.of('')
                        next().mergeMap(() => clash.route(store.route()))
                            .do(() => updateTray())
                            .catch(() => Observable.of('')).subscribe()
                    }
                    // tap changed
                    if (settings.hasOwnProperty('tap') && _tap !== settings['tap']) {
                        store.tap(settings['tap'])
                    }
                } else {
                    let data = {
                        platform: process.platform,
                        arch: process.arch,
                        route: clash.ROUTES.indexOf(store.route()),
                        tap: store.tap(),
                        version: store.version()
                    }
                    if (store.versionNew() && store.version() !== store.versionNew().version) data.newVersion = store.versionNew()
                    fromMain('getSettings', [data])
                    fromMain('getSettings', [{'tun': clash.tunReady() && store.tun()}])
                }
                break
            case 'proxyShare':
                let interfaces = os.networkInterfaces()
                let IPAddress = '';
                for (let devName in interfaces) {
                    let iface = interfaces[devName];
                    for (let i = 0; i < iface.length; i++) {
                        let alias = iface[i];
                        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                            IPAddress = alias.address;
                        }
                    }
                }
                fromMain('getProxyShare', [{host: IPAddress, port: configs.proxyPort}])
                break
            case 'tap.check':
                tap.check().catch(() => Observable.of('')).subscribe()
                break
            case 'tun.check':
                disconnect()
                clash.tunToggle(value[0])
                break
            case "login":
                captchaObservable(store.remote('captcha_login'))
                    .mergeMap(data => api.login(Object.assign(value[0], data)))
                    .subscribe(() => {
                        signChanged(true)
                        goMain()
                        reqUserAndNext()
                    }, err => fromMain('getLogin', err))

                break;
            case 'register':
                captchaObservable(store.remote('captcha_register'))
                    .mergeMap(data => api.register(Object.assign(value[0], data)))
                    .subscribe(() => goLogin(), err => fromMain('getRegister', err))
                break
            case "forget":
                api.forget(value[0]).subscribe(data => fromMain('getForget', [true, data.msg]),
                    err => fromMain('getForget', [false, err]))
                break
            case 'pwd':
                if (store.username() && store.password())
                    fromMain('getPwd', [store.username(), store.password()])
                break
            case 'code':
                api.code(value[0]).subscribe(() => fromMain('getCode', [true]), err => fromMain('getCode', [false, err]))
                break
            case 'logout':
                disconnect()
                store.clearUser()
                clash.clearClashConfig()
                signChanged(false)
                goLogin()
                noticeDisplay = false
                break;
            case "user":
                reqUser()
                break;
            case 'notice':
                reqNotice()
                break
            case "connect":
                console.log("click connect")
                if (store.connected()) disconnect()
                else {
                    if (!checkConnect()) return;
                    connect()
                }
                setTimeout(() => loadingAnimator(), 1000)
                break;
            case 'lines':
                reqLines()
                break;
            case 'line':
                store.line(value[0])
                clash.lineChanged().subscribe()
                if (store.connected()) checkConnect()
                break;
            case 'linePing':
                clash.linePing(value[1]).map(data => Object.assign(data, {name: value[0]})).subscribe(data => fromMain('getPing', data))
                break;
            case 'lineSpeed':
                clash.lineSpeed(value[0]).map(data => Object.assign(data, {name: value[0]})).subscribe(data => fromMain('getSpeed', data))
                break;
            case 'lineListClose':
                clash.cancelLineSpeed()
                break;
            case 'checkIn':
                captchaObservable(store.remote('captcha_checkin'))
                    .mergeMap(data => api.checkIn(data))
                    .do(() => api.requestUser().do(data => getUser(data.user)).catch(() => Observable.of('')).subscribe())
                    .subscribe(msg => fromMain('getCheckIn', [true, msg]), err => fromMain('getCheckIn', [false, err]))
                break;
            case 'trafficLogs':
                api.trafficLogs().subscribe(data => fromMain('getTrafficLogs', [data]), err => fromMain('getInvite', [null, err]))
                break
            case 'invite':
                api.invite().subscribe(data => fromMain('getInvite', [data]), err => fromMain('getInvite', [null, err]))
                break
            case 'inviteBackConfig':
                api.inviteBackConfig().subscribe(data => fromMain('getInviteBackConfig', [data]), err => fromMain('getInviteBackConfig', [null, err]))
                break
            case 'inviteBackTransfer':
                api.inviteBackTransfer(value[0]).subscribe(data => fromMain('getInviteBackTransfer', [data]), err => fromMain('getInviteBackTransfer', [null, err]))
                break
            case 'inviteBackWithdraw':
                api.inviteBackWithdraw(value[0], value[1]).subscribe(data => fromMain('getInviteBackWithdraw', [data]), err => fromMain('getInviteBackWithdraw', [null, err]))
                break
            case 'store':
                reqStore()
                break;
            case 'promo':
                api.promo(value[0], value[1]).subscribe(data => fromMain('getPromo', [data]), err => fromMain('getPromo', [null, err]))
                break;
            case 'balance':
                api.balance().subscribe(data => fromMain('getBalance', data), () => fromMain('getBalance', 0))
                break;
            case 'order':
                let order = value[0]
                api.order(order).subscribe(data => {
                    if (data.finished === true) {
                        fromMain('getOrder', [2])
                        reqUserAndNext()
                        return
                    }

                    let checkOrder = () => api.orderCheck(data['payId'], order)

                    let success = false
                    let checkOrderSuccess = () => {
                        success = true
                        cancelQueryTask(true)
                        fromMain('getOrder', [2])
                        reqUserAndNext()
                    }

                    let onPayClose = () => {
                        if (success) return
                        fromMain('getOrder', [0])
                        cancelQueryTask(true)
                        Observable.of('')
                            .mergeMap(() => Observable.timer(1000).do(() => console.log('...')).mergeMap(() => checkOrder()))
                            .retry(60)
                            .subscribe(() => {
                                if (success) return
                                checkOrderSuccess()
                            }, err => {
                                if (success) return
                                fromMain('getOrder', [-1, err])
                                reqUser()
                            })
                    }

                    let type = 0
                    let times = 100
                    let queryTask = Observable.interval(3000)
                        .mergeMap(() => {
                            return checkOrder()
                                .mergeMap(() => {
                                    checkOrderSuccess()
                                    switch (type) {
                                        case 0:
                                            closePayWeb()
                                            break
                                        case 1:
                                            closeQrcode()
                                            break
                                    }
                                })
                                .catch(() => {
                                    cancelQueryTask()
                                    return Observable.of('')
                                })
                        })
                        .subscribe()

                    let cancelQueryTask = (force = false) => {
                        if (times <= 0 || force) {
                            queryTask?.unsubscribe()
                            return
                        }
                        --times;
                    }

                    if (data.qrcode) {
                        openQrcode(data.url, string.getString('orderQrcode'), string.getString('orderQrcodeTips'), (args) => {
                            if (args === 'close') onPayClose()
                        })
                        type = 1
                        return;
                    }

                    openPayWeb(data.url, (args) => {
                        if (args === 'close') onPayClose()
                    })
                }, err => fromMain('getOrder', [-1, err]))

                break;
            case "redirect":
                let url = value[0]
                let hosts = store.remote('hosts')
                for (let item of hosts) {
                    if (url.indexOf(item) !== -1 && payWindow) {
                        payWindow.close()
                        break;
                    }
                }
                break;
            case "captcha":
                if (captchaNext) {
                    let captcha
                    try {
                        captcha = JSON.parse(value[0])
                    } catch (e) {

                    }
                    let data = {
                        recaptcha: value[0],
                        recaptcha_data: value[0],
                        geetest_challenge: captcha ? captcha['geetest_challenge'] : '',
                        geetest_validate: captcha ? captcha['geetest_validate'] : '',
                        geetest_seccode: captcha ? captcha['geetest_seccode'] : '',
                    }
                    if (captchaWindow) captchaWindow.close()
                    captchaNext.next(data)
                    captchaNext.complete()
                    captchaNext = null
                }
                break
            case 'web':
                openWeb(value[0])
                break
            // case 'navigate':
            //     shell.openExternal(store.user()['navigateUrl'])
                // break
            case 'chatbox':
                let chat = store.remote('crisp')
                if (chat.startsWith('https://')) {
                    openWeb(chat)
                } else if (chat.startsWith('chatra://')) {
                    openWeb(`https://chat.chatra.io/#hostId=${chat.replace('chatra://', '')}`)
                }
                break
            case 'websiteSource':
                openWebExternal(store.hostSource())
                break
            case 'version.browser':
                // Mac升级需要根据arch打开
                if (process.platform === 'darwin') {
                    let url = store.versionData().url.replace(".dmg", `.${process.arch}.dmg`)
                    openWebExternal(url)
                } else {
                    openWebExternal(store.versionData().url)
                }
                closeUpdateBrowser()
                break
            case 'version.cancel':
                // closeUpdate()
                closeUpdateBrowser()
                if (versionUpdateForce()) quit()
                break
            // appUpdater
            case 'version.check':
                // checkUpdate(store.versionCheckUrl())
                break
            // appUpdater
            case 'version.download':
                // downloadUpdate()
                break
            // appUpdater
            case 'version.install':
                // installUpdate()
                break
        }
    }
})

let alertErr = (msg) => fromMain('msgErr', msg)
let alertSuccess = (msg) => fromMain('msgSuccess', msg)

let captchaWindow;
let captchaNext;

function captchaObservable(type) {
    if (parseInt(type) <= 1) {
        return Observable.of({})
    }
    return new Observable(sb => {
        captchaNext = sb;
        openCaptcha(type)
    })
}

function openCaptcha(type) {
    captchaWindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: true,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.common.js'),
            webviewTag: true,
            sandbox: true
        }
    })
    let url
    switch (type) {
        case 2:
        case "2":
            url = store.host() + "/reCAPTCHA.html"
            break
        case 3:
        case "3":
            url = store.host() + "/geetest/geetest.html"
            break
        case 4:
        case "4":
            url = store.host() + "/cloudflare.turnstile.html"
            break
    }
    captchaWindow.webContents.loadFile(path.join(__dirname, "/views/web.captcha.html"))
    captchaWindow.webContents.once('did-finish-load', () => setTimeout(() => captchaWindow.webContents.send('fromMain', [url, 'captcha']), 500))
    captchaWindow.show()
}

let qrcodeWindow
let openQrcode = (url, title, msg, callback) => {
    closeQrcode()
    qrcodeWindow = new BrowserWindow({
        width: 320,
        height: 360,
        resizable: false,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.web.js'),
            webviewTag: true
        }
    })
    qrcodeWindow.on('close', () => callback('close'))
    qrcodeWindow.webContents.loadFile(path.join(__dirname, "/views/qrcode.html"))
    qrcodeWindow.webContents.once('did-finish-load', () => setTimeout(() => qrcodeWindow.webContents.send('fromMain', [url, title, msg]), 500))
    // web.webContents.openDevTools()
    qrcodeWindow.show()
}

let closeQrcode = () => {
    try {
        qrcodeWindow?.close()
    } catch (e) {
        console.log(e)
    }
    qrcodeWindow = null
}

function openPayWeb(url, callback) {
    closePayWeb()
    payWindow = new BrowserWindow({
        width: 750,
        height: 560,
        resizable: false,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.web.js'),
            webviewTag: true
        }
    })
    payWindow.on('close', () => callback('close'))
    payWindow.webContents.loadFile(path.join(__dirname, "/views/web.pay.html"))
    payWindow.webContents.once('did-finish-load', () => setTimeout(() => payWindow.webContents.send('fromMain', [url, 'pay', store.remote('hosts')]), 500))
    // web.webContents.openDevTools()
    payWindow.show()
}

let closePayWeb = function () {
    try {
        payWindow?.close()
    } catch (e) {
        console.log(e)
    }
    payWindow = null
}


let openWeb = (url) => {
    let webWindow = new BrowserWindow({
        width: 750,
        height: 560,
        resizable: false,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.web.js'),
            webviewTag: true
        }
    })
    webWindow.webContents.loadFile(path.join(__dirname, "/views/web.html"))
    webWindow.webContents.once('did-finish-load', () => setTimeout(() => webWindow.webContents.send('fromMain', [url]), 500))
    webWindow.show()
}

let openWebExternal = (url) => {
    shell.openExternal(url).then(() => console.log('open')).catch(() => openWeb(url))
}

let openErr = (msg, callback) => {
    let errWindow = new BrowserWindow({
        width: 600,
        height: 400,
        resizable: false,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.common.js'),
            webviewTag: true
        }
    })
    errWindow.on('close', () => {
        if (callback) callback('close')
    })
    errWindow.webContents.loadFile(path.join(__dirname, "/views/_err.html"))
    errWindow.webContents.once('did-finish-load', () => errWindow.webContents.send('fromMain', [msg]))
    // web.webContents.openDevTools()
    errWindow.show()
}

function getTips(msg = "") {
    fromMain('getTips', [msg])
}

function checkConnect() {
    if (!store.vip()) {
        fromMain('connectedChanged', [false, string.getString('userVipExpired')])
        disconnect()
        return false
    }
    if (!store.trafficEnable()) {
        fromMain('connectedChanged', [false, string.getString('userTrafficOut')])
        disconnect()
        return false
    }
    return true
}

function connect() {
    if (!store.line()) {
        fromMain('connectedChanged', [false, string.getString('line_none_select')])
        return
    }
    clash.connect().subscribe(() => connectedChanged(true), err => connectedChanged(false, err))
}

function disconnect() {
    clash.disconnect()
    connectedChanged(false)
}

let noticeDisplay = false
let reqNotice = () => {
    let getNotice = (notice) => {
        if (notice) {
            fromMain('getNotice', [notice, store.noticeDisplay(notice.id) && !noticeDisplay])
            noticeDisplay = true
        }
    }
    api.notice().do(data => getNotice(data)).catch(() => Observable.of('')).subscribe()
}

function mergeUser(user) {
    if (user) {
        user.device = process.platform === 'darwin' ? "Mac" : "Windows"
        user.version = store.version()
    }
    return user
}

function reqUserAndNext() {
    reqUser(() => {
        reqLines()
        reqStore()
    })
}

function reqUser(next) {
    api.requestUser().subscribe(data => {
        getUser(mergeUser(data.user))

        if (store.vipExpireSoon()) {
            getTips(string.getString('userVipExpireSoon'))
        } else if (store.vipExpire()) {
            getTips(string.getString('userVipExpired'))
        } else if (store.trafficOutSoon()) {
            getTips(string.getString('userTrafficOutSoon'))
        } else if (store.trafficOut()) {
            getTips(string.getString('userTrafficOut'))
        } else {
            getTips("")
        }

        if (next) next()
    }, () => '')
}

let reqLines = () => {
    // postLines()

    if(!store.subLink()) {
        getLines([], string.getString('line_none_tap'))
        fromMain('getLineNone', [''])
        return
    }

    api.lines()
        .do(data => clash.updateClashConfig(data), err => getLines([], err))
        .do(() => postLines())
        .subscribe()
}

let postLines = () => {
    let lines = clash.lines()
    if (lines !== null && lines.length > 0) {

        // 自动选择
        if (configs.proxyAuto) {
            lines.unshift(
                {
                    name: string.getString("proxyGroupAuto"),
                    server: 'baidu.com',
                    flag: string.getString('proxyGroupAutoFlag')
                },
                {
                    name: string.getString("proxyGroupFallback"),
                    server: 'baidu.com',
                    flag: string.getString('proxyGroupFallbackFlag')
                }
            )
        }

        let line = store.line();
        let index = 0;
        if (line !== null && line !== undefined && line.length > 0) {
            for (let i = 0; i < lines.length; i++) {
                let item = lines[i]
                if (item['name'] === line) {
                    index = i;
                    break;
                }
            }
        }
        line = lines[index]['name']
        store.line(line)
        getLine()
        getLines(lines)
    } else {
        fromMain('getLineNone', [''])
    }
}

let reqStore = () => {
    api.store().subscribe(data => fromMain('getStore', [data]), err => fromMain('getStore', ['', err]))
}

let go = (view) => mainWindow.loadFile(path.join(__dirname, view))

let needSignWhenGoMain = false
let goMain = (sign = false) => {
    needSignWhenGoMain = sign
    go("/views/main.html")
    setTimeout(() => loadingAnimator(), 500)
}
let goLogin = () => go("/views/login.html")
let signChanged = (sign) => {
    fromMain('signChanged', sign)
    updateTray()
}

let trafficSubscribe
let connectedChanged = (connected, msg = null) => {
    store.connected(connected)
    fromMain('connectedChanged', [connected, msg])
    updateTray()
    trafficStop()
    if (connected) trafficStart()
}

let trafficStartTry = () => {
    if (store.connected()) trafficStart()
}

let trafficStart = () => {
    trafficSubscribe?.unsubscribe()
    trafficSubscribe = clash.traffic().subscribe(data => fromMain('getT', [data]), e => console.log(e))
}

let trafficStop = () => {
    trafficSubscribe?.unsubscribe()
}

/**
 * 更新系统托盘
 */
function updateTray() {
    if (!tray) return
    let connected = store.connected()
    tray.setToolTip(string.getString('appName') + (connected ? (`\n${string.getString('menuTipsConnected')}${store.line()}`) : ''))
    tray.setContextMenu(generateTrayMenu(connected))
    if (!connected) {
        tray.setImage(process.platform === 'darwin' ? trayMacIcons[0] : trayIcons[0])
    } else {
        switch (store.route()) {
            case clash.ROUTE_GLOBAL:
                tray.setImage(process.platform === 'darwin' ? trayMacIcons[1] : trayIcons[1])
                break
            case clash.ROUTE_AUTO:
                tray.setImage(process.platform === 'darwin' ? trayMacIcons[2] : trayIcons[2])
                break
        }
    }
}

let generateTrayMenu = (connected) => {
    let menus = [];
    if (store.isLogin() && store.line() && store.line().length > 0) {
        let route = (route) => {
            clash.route(route)
                .do(() => {
                    if (!connected) {
                        connect()
                    }
                    store.route(route)
                    updateTray()
                })
                .catch(() => Observable.of(''))
                .subscribe()
            return true;
        }
        menus.push({
            label: string.getString('connect'),
            icon: null,
            submenu: [
                {
                    label: string.getString('connect_global'),
                    type: 'checkbox',
                    checked: connected && store.route() === clash.ROUTE_GLOBAL,
                    click: () => route(clash.ROUTE_GLOBAL)
                },
                {
                    label: string.getString('connect_auto'),
                    type: 'checkbox',
                    checked: connected && store.route() === clash.ROUTE_AUTO,
                    click: () => route(clash.ROUTE_AUTO)
                },
                {
                    label: string.getString('connect_close'),
                    type: 'checkbox',
                    checked: !connected,
                    click: () => disconnect()
                }
            ],
        })
    }
    menus.push({
        label: string.getString('menuOpenAtLogin'),
        type: 'checkbox',
        checked: store.openAtLogin(),
        click: () => updateOpenAtLogin(true),
    })
    menus.push({
        label: string.getString('menuClearConfig'),
        icon: null,
        click: () => clearConfigAndRestart(),
    })
    menus.push({
        label: string.getString('menuQuit'),
        icon: null,
        click: () => quit()
    })
    return Menu.buildFromTemplate(menus)
}

let fromMain = (key, values) => mainWindow?.webContents.send(key, values)
let getUser = (user) => fromMain('getUser', user)

function getLines(lines, err) {
    let newLines = [];
    if (lines) {
        for (let item of lines) {
            let line = wrapLine(item.name)
            line.type = item.type
            line.server = item.server
            newLines.push(line)
        }
    }
    fromMain('getLines', [newLines, err])
}

let getLine = () => {
    fromMain('getLine', wrapLine(store.line()))
    updateTray()
}

function wrapLine(name) {
    // let source = Buffer.from(name, 'base64').toString()
    let regex = store.remote('line_flag_regex')
    if (regex === null || regex === undefined || regex.length === 0) {
        regex = "(^[^#|\\s+]*)[#|\\s+]"
    }
    let flag = ""
    switch (name) {
        case string.getString('proxyGroupAuto'):
            flag = string.getString('proxyGroupAutoFlag')
            break;
        case string.getString('proxyGroupFallback'):
            flag = string.getString('proxyGroupFallbackFlag')
            break
        default:
            try {
                flag = new RegExp(regex).exec(name)[1]
            } catch (e) {
            }
            break
    }

    return {
        name: name,
        flag: flag,
    }
}

let animatorLoaded = false
let lastAnimators = {}
let loadingAnimator = () => {
    let animator = store.remote('animator')
    if (!animator) return
    if (lastAnimators && Array.isArray(lastAnimators)) {
        lastAnimators.forEach(item => delete item['p'])
    }
    if (JSON.stringify(lastAnimators) === JSON.stringify(animator)) {
        if (animatorLoaded) return
    } else {
        lastAnimators = animator
        animatorLoaded = false
    }

    Observable.from(animator)
        .mergeMap(data => {
            let name = data.u.split('/').slice(-1)[0]
            let userData = app.getPath('userData')
            let animPath = path.join(userData, 'anim')
            if (!fs.existsSync(animPath)) fs.mkdirSync(animPath)
            let file = path.join(userData, 'anim', name)
            if (fs.existsSync(file)) {
                data.p = file
                return Observable.of(data)
            }
            return http.download(data.u, file).map(() => {
                data.p = file
                return data
            })
        })
        .toArray()
        .subscribe(data => {
            if (store.isLogin()) {
                animatorLoaded = true
                fromMain('getAnimators', [data])
            }
        }, err => {
            console.log(err)
            animatorLoaded = false
        })
}

let clearAnimators = () => {
    try {
        let userData = app.getPath('userData')
        let animPath = path.join(userData, 'anim')
        if (fs.existsSync(animPath)) {
            let files = fs.readdirSync(animPath)
            files.forEach(function (file, index) {
                fs.unlinkSync(path.join(animPath, file))
            })
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * 请求更新操作
 */
let requestUpdate = () => {

    let compareVersion = (first, second) => {
        if (first === second) return 0
        let l = first.split('.'), n = second.split('.')
        let min = Math.min(l.length, n.length)
        for (let i = 0; i < min; i++) {
            if (parseInt(l[i]) !== parseInt(n[i])) {
                return parseInt(l[i]) - parseInt(n[i])
            }
        }
        return l.length - n.length
    }

    let version = store.version()
    let newest = store.versionData()?.name
    // 有新版本，弹出新版本提示框
    if (version != null && newest != null && compareVersion(newest, version) > 0) {

        // 强制更新 关闭主窗口
        if (versionUpdateForce()) {
            mainWindow?.close()
        }

        openUpdateBrowserWindow(store.versionData())
    }

    // checkUpdate(store.versionCheckUrl())
    //     .catch(() => Observable.of(null))
    //     .do(() => {
    //         // 若未获取到新版本信息，则提示新版本升级框
    //         if (!store.versionNew()) {
    //             let version = store.version()
    //             let newest = store.versionData()?.name
    //             // 有新版本，弹出新版本提示框
    //             if (version != null && newest != null && compareVersion(newest, version) > 0) {
    //                 openUpdateBrowserWindow(store.versionData())
    //             }
    //         }
    //     })
    //     .subscribe()
}

let versionUpdateForce = () => store.versionData()['force'] === 1

// 跳转浏览器的更新弹框
let updateBrowserWindow
let openUpdateBrowserWindow = (version) => {
    updateBrowserWindow?.close()
    updateBrowserWindow = new BrowserWindow({
        width: 400,
        height: 250,
        resizable: true,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.common.js'),
            webviewTag: true
        }
    })
    updateBrowserWindow.webContents.loadFile(path.join(__dirname, "/views/_update.browser.html"))
    updateBrowserWindow.webContents.once('did-finish-load', () => updateBrowserWindow.webContents.send('fromMain', ['new', version]))
    // updateBrowserWindow.webContents.openDevTools()
    updateBrowserWindow.show()
    updateBrowserWindow.focus()
}
let closeUpdateBrowser = () => updateBrowserWindow?.close()
