const fs = require('fs')
const request = require("request");
const axios = require('axios')
const store = require('../store');
const common = require('../common');
const log = require('./log')
const fetch = require('node-fetch')
const URL = require('url')
const SocksProxyAgent = require('socks-proxy-agent')
const httpsAgent = new SocksProxyAgent.SocksProxyAgent(`socks5://127.0.0.1:${require('../.config').proxyPort}`)
const ignoreSSLhttpsAgent = require('https').Agent({rejectUnauthorized: false})
const ignoreSSL = require('../.config').httpsIgnoreSSL

const Observable = require('rxjs/Observable').Observable;
require('rxjs/add/observable/of');
require('rxjs/add/observable/throw');
require('rxjs/add/observable/merge');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
require('rxjs/add/operator/do');
require('rxjs/add/operator/retry');
require('rxjs/add/operator/first');
const path = require("path");
const {Axios} = require("axios");

const TYPE_TOKEN_REQUIRE = "__need_token";

exports.clearCookie = function () {
    store.set('cookie', '');
}

function appendHeader(headers) {
    if (headers === null) {
        headers = {};
    }
    headers['User-Agent'] = 'PostmanRuntime/7.35.0';

    let cookie = store.get('cookie');
    if (cookie && cookie.length > 0) {

        headers['Cookie'] = cookie;
        if (cookie.startsWith("authorization")) {
            headers['authorization'] = cookie.replace('authorization=', '')
        }
        headers['userId'] = store.user() ? store.user()['id'] : ""
    }

    return headers;
}


let generateHeaderDefault = () => {
    return {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 BingPreview/1.0b'}
}

let generateHeaderFromUrl = (url) => {
    let headers = generateHeaderDefault()
    const cookie = store.get('cookie')
    if (url && url.indexOf(TYPE_TOKEN_REQUIRE) !== -1 && cookie && cookie.length > 0) {
        headers['Cookie'] = cookie;
        if (cookie.startsWith("authorization")) {
            headers['authorization'] = cookie.replace('authorization=', '')
        }
        headers['userId'] = store.user() ? store.user()['id'] : ""
    }
    return headers
}

function _fetchGet(url, headers = null) {
    return new Observable(sb => {
        fetch(url, {
            headers: headers
        })
            .then(data => data.text())
            .then(data => {
                sb.next(data)
                sb.complete()
            })
            .catch(err => sb.error(err))
    })
}

function _generateOptions(url, headers = null) {
    let options = {headers: generateHeaderFromUrl(url), responseType: 'text', method: 'get'}
    if (url && url.indexOf(TYPE_TOKEN_REQUIRE) !== -1) {
        url = url.replace(TYPE_TOKEN_REQUIRE, "")
    }
    options.url = url
    if (headers != null) {
        options.headers = Object.assign(options.headers, headers)
    }
    options.headers['access-control-allow-origin'] = (url.startsWith("https:") ? "https://" : "http://") + url.replace("http://", "").replace("https://", "").split('/')[0]
    options.headers['Origin'] = options.headers['access-control-allow-origin']
    if (ignoreSSL) {
        options.httpsAgent = ignoreSSLhttpsAgent
    }
    return options
}

let _axios = (options) => new Observable(sb => axios(options)
    .then(res => handleAxiosRes(sb, options.url, options.method, res, null))
    .catch(err => handleAxiosRes(sb, options.url, options.method, null, err)))

let _axiosGet = (url, headers = null) => _axios(_generateOptions(url, headers))

function _axiosPost(url, data, headers = null) {
    let options = _generateOptions(url, headers)
    options.method = 'post'
    options.data = data
    if (options.headers.hasOwnProperty('content-type') && 'application/json' === options.headers['content-type']) {
        options.responseType = 'json'
    }
    return _axios(options)
}

let _generatorRequestOptions = (url, headers = null) => {
    if (url && url.indexOf(TYPE_TOKEN_REQUIRE) !== -1) {
        headers = appendHeader(headers)
        url = url.replace(TYPE_TOKEN_REQUIRE, "")
    }

    let options = {
        url: url,
        method: 'GET',
        timeout: 20000,
        rejectUnauthorized: false,
    };
    if (headers !== null) {
        options.headers = headers;
    }
    return options
}

let _request = (options) => new Observable(sb => {
        request(options, (err, response, body) => handleRes(sb, options.url, err, response, body))
    }
)

let _requestGet = (url, headers = null) => _request(_generatorRequestOptions(url, headers))

let _requestPost = (url, data, headers = null) => {
    let option = _generatorRequestOptions(url, headers)
    option.method = 'POST'
    option.form = data
    if (option.headers) {
        if (option.headers.hasOwnProperty('content-type') && 'application/json' === option.headers['content-type']) {
            option.json = true
        }
        option.headers['access-control-allow-origin'] = (url.startsWith("https:") ? "https://" : "http://") + url.replace("http://", "").replace("https://", "").split('/')[0]
        option.headers['Origin'] = headers['access-control-allow-origin']
    }
    return _request(option)
}

exports.fetchGet = (url, headers) => _fetchGet(url, headers)

exports.get = function (url, headers = null) {
    return _axiosGet(url, headers)
};

exports.post = function (url, data, headers = null) {
    return _axiosPost(url, data, headers)
};

exports.post2 = function (url, data, headers = null) {
    if (url.endsWith(TYPE_TOKEN_REQUIRE)) {
        headers = appendHeader(headers)
        url = url.replace(TYPE_TOKEN_REQUIRE, "")
    }

    let options = {
        method: 'POST',
        rejectUnauthorized: false,
        url: url,
        form: data
    };
    if (headers !== null) {
        options.headers = headers;
        if (headers.hasOwnProperty('content-type') && 'application/json' === headers['content-type']) {
            options.json = true
        }
        headers['access-control-allow-origin'] = (url.startsWith("https:") ? "https://" : "http://") + url.replace("http://", "").replace("https://", "").split('/')[0]
        headers['Origin'] = headers['access-control-allow-origin']
    }

    return new Observable(sb => request.post(options, function (err, response, body) {
        handleRes(sb, url, err, response, body)
    }))
}

exports.test = function (url, testResponse = false) {
    let options = {
        url: url,
        method: 'GET',
        timeout: 10000,
        rejectUnauthorized: false,
    };
    return new Observable(sb => {
        request(options, function (err, response, body) {
            if (err) {
                sb.error(err);
                return;
            }
            if (testResponse && response.statusCode !== 200 && response.statusCode !== 204) {
                sb.error('Test response error');
                return;
            }
            sb.next(body);
            sb.complete()
        });
    })
}

exports.subLink = function (append, userAgent = '') {
    let headers = {}
    if(userAgent) {
        headers['User-Agent'] = userAgent
    }
    let sub = store.subLink() + (append ?? "")
    let uu = `${sub}`
    const xv = /\/v2b\/[^\/]+/
    if (xv.exec(uu) !== null) {
        uu = uu.replace(xv.exec(uu)[0], '')
    }
    const xs = /\/ssp\/[^\/]+/
    if (xs.exec(uu) !== null) {
        uu = uu.replace(xs.exec(uu)[0], '')
    }
    let subURL = URL.parse(uu)
    let hosts = store.remote('hosts')
    let others = []
    hosts?.forEach(host => {
        others.push(uu.replace(subURL.host, (host.endsWith("/") ? host.substr(0, host.length - 1) : host).replace('http://', '').replace('https://', '')))
    })
    return _fetchGet(sub, headers)
        .catch(() => {
            let othersMerge = []
            others.forEach(host => othersMerge.push(_fetchGet(host, headers)))
            othersMerge.push(Observable.timer(15000).map(() => 'null'))
            return Observable.merge(...othersMerge)
                .first(data => data === 'null' || data !== null)
        })
}

exports.download = (url, path, proxy = true) => {
    let options = {
        url: url, responseType: 'arraybuffer'
    }
    return new Observable(sb => {
        function next(data) {
            fs.writeFileSync(path, data.data, 'binary')
            sb.next(path)
            sb.complete()
        }

        function error(err) {
            try {
                fs.unlink(path, err => console.log(err))
            } catch (e) {
                console.log(e)
            }
            sb.error(err)
        }

        axios(options)
            .then(data => next(data))
            .catch((err) => {
                if (!proxy) {
                    error(err)
                    return
                }
                options.httpsAgent = httpsAgent
                axios(options).then(data => next(data)).catch(err => error(err))
            })
    })
}

function handleRes(sb, url, err, response, body) {
    if (err) {
        sb.error(err)
        common.log("==============================\n" + url + "\n-----------------------------\n" + err + '\n>>>>>>>>>>>>>>>>')
        return
    }
    if (response && response.statusCode && response.statusCode === 200) {
        saveCookie(url, response.rawHeaders, body)
        common.log("==============================\n" + url + "\n-----------------------------\n" + body + '\n>>>>>>>>>>>>>>>>')
        sb.next(body);
        sb.complete()
    } else {
        common.log("==============================\n" + url + "\n-----------------------------\n" + parseError(response, body) + '\n>>>>>>>>>>>>>>>>')
        sb.error(parseError(response, body))
    }
}

function handleAxiosRes(sb, url, method, response, err) {
    if (err) {
        sb.error(parseError(err))
        let msg = `======== Axios === ${method} ==============\n${url}\n------------ err -------------\n${err}\n>>>>>>>>>>>>>>>>\n`
        common.log(msg)
        if (!url.endsWith('hosts'))
            writeLog(msg)
        return
    }
    let msg = `======== Axios === ${method} ==============\n${url}\n----------- ${response.status}------------\n${response.data}\n>>>>>>>>>>>>>>>>\n`
    common.log(msg)
    if (!url.endsWith('hosts'))
        writeLog(msg)
    if (response.statusText?.toLowerCase() !== 'ok') {
        sb.error(parseError(response, response.data))
        return;
    }
    saveCookie(url, response.headers, response.data)
    sb.next(response.data)
    sb.complete()
}

async function handleFetchRes(sb, url, err, response) {
    if (err) {
        sb.error(err)
        common.log("==============================\n" + url + "\n-----------------------------\n" + err + '\n>>>>>>>>>>>>>>>>')
        return
    }
    let body = await response.text()
    if (response && response.ok) {
        saveCookie(url, response.headers, body)
        common.log("==============================\n" + url + "\n-----------------------------\n" + body + '\n>>>>>>>>>>>>>>>>')
        sb.next(body);
        sb.complete()
        return
    }
    common.log("==============================\n" + url + "\n-----------------------------\n" + parseError(response, body) + '\n>>>>>>>>>>>>>>>>')
    sb.error(parseError(response, body))
}

function parseError(response, body) {
    if (body && body.length > 0) {
        if (body.startsWith("{")) {
            let content = JSON.parse(body)
            if (content.hasOwnProperty('errors')) {
                let errors = content['errors']
                if (errors && Object.values(errors)[0]) {
                    return Object.values(errors)[0][0]
                }
            }
            return content['message']
        }
        return body
    }
    if (response && response.response && response.response.data) {
        if (response.response.data.startsWith("{")) {
            let content = JSON.parse(response.response.data)
            if (content.hasOwnProperty("message")) {
                return content['message']
            }
        }
    }
    return response && response.message ? response.message : ""
}

function saveCookie(url, headers, body) {
    // 保存Cookie
    if (url.indexOf('login') !== -1 || url.indexOf('authorization') !== -1) {

        let cookie = ""
        if (Array.isArray(headers)) {
            let cooked = false;
            for (let item of headers) {
                if (cooked) {
                    cookie += item + ";";
                    cooked = false;
                }
                cooked = item.toString().trim().toLowerCase() === 'set-cookie';
            }
        } else {
            cookie = headers['set-cookie']?.join('')?.replaceAll("path=/", '');

        }
        try {
            if (body && body.data && body.data['auth_data']) {
                cookie = 'authorization=' + body.data['auth_data']
            } else if (JSON.parse(body).data['auth_data']) {
                cookie = 'authorization=' + JSON.parse(body).data['auth_data']
            }
        } catch (e) {

        }

        if (cookie && cookie.length > 0) {
            store.set('cookie', cookie)
        }
    }
}

function writeLog(msg) {
    try {
        log.log(msg)
    } catch (e) {
        console.log(e)
    }
}