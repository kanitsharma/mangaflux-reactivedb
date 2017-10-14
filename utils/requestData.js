const _rp = require('request-promise')

const requestData = url => _rp(url)

module.exports = requestData
