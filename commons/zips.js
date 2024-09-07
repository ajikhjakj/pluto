const s = require('./_sec');
exports.encrypt = (value) => s.encrypt(value)
exports.decrypt = (value) => s.decrypt(value)
exports.zip = (value) => new Buffer(s.encrypt(value)).toString("base64").split('/').join('-')
exports.unzip = (values) => s.decrypt(new Buffer(values.split('-').join('/'), 'base64').toString())