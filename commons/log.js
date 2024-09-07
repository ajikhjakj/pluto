const fs = require('fs')
const path = require('path')

const store = require('../store')

function logPath() {
    let _path = path.join(store.userDataPath(), 'logs')
    if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)
    }
    return _path
}

function logName() {
    let date = new Date()
    return `${date.getMonth() + 1}_${date.getDate()}`
}

exports.log = (msg) => {
    let name = `${logName()}.log.txt`
    fs.appendFileSync(path.join(logPath(), name), msg)
}

exports.err = (msg) => {
    let name = `${logName()}.err.txt`
    fs.appendFileSync(path.join(logPath(), name), msg)
}

exports.clear = () => {
    try {
        fs.readdirSync(logPath()).forEach(item => fs.unlinkSync(item))
    } catch (e) {

    }
}
