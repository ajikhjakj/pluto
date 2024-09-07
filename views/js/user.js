function goLogin() {
    window.api.send('go', 'login')
}

function goRegister() {
    window.api.send('go', 'register')
}

function goForget() {
    window.api.send('go', 'forget')
}

let getConfigCallback = null

function onGetConfig(callback) {
    getConfigCallback = callback
}

let getCodeCallback = null

function onGetCode(callback) {
    getCodeCallback = callback
}

let getPwdCallback = null

function onGetPwd(callback) {
    getPwdCallback = callback
}

let getForgetCallback = null

function onGetForget(callback) {
    getForgetCallback = callback
}

function reqLogin(data) {
    showLoading()
    window.api.send('toMain', ["login", data])
}

function reqRegister(data) {
    showLoading()
    window.api.send('toMain', ["register", data])
}

function reqForget(data) {
    showLoading()
    window.api.send('toMain', ['forget', data])
}

function reqCode(data) {
    window.api.send('toMain', ["code", data])
}

function reqPwd() {
    window.api.send('toMain', ["pwd"])
}

$(document).ready(function () {
    window.api.send('toMain', 'config')
    window.api.receive('getConfig', function (args) {
        window._config = args
        if (getConfigCallback) {
            getConfigCallback(args)
        }
    })
    window.api.receive('getLogin', function (args) {
        hideLoading()
        alertErr(args)
    })

    window.api.receive('getRegister', function (args) {
        hideLoading()
        alertErr(args)
    })
    window.api.receive('getCode', function (args) {
        if (getCodeCallback) {
            getCodeCallback(args)
        }
    })
    window.api.receive('getPwd', function (args) {
        if (getPwdCallback) {
            getPwdCallback(args)
        }
    })
    window.api.receive('getForget', function (args) {
        hideLoading()
        if (args[0]) {
            // v2b
            if (window._config['target'] === 1) {
                alertSuccess(string('forget_success_1'))
            } else {
                alertSuccess(args[1])
            }
        } else {
            alertErr(args[1])
        }

        if (getForgetCallback) {
            getForgetCallback(args)
        }
    })
})