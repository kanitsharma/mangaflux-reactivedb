const cheerio = require('cheerio')

const scrapeLatest = html => {
  const DOM = cheerio.load(html)
  const list = listArrayGenerator(DOM('.thumbNews .hottestInfo a').text())
  return list
}

const listArrayGenerator = string =>
  string
    .split('\n')
    .filter( s => s != '')
    .filter( s => isNaN(parseFloat(s)) && !isFinite(s))

module.exports = scrapeLatest
