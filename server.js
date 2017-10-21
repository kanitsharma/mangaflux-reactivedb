const http = require('http')
const MongoClient = require('mongodb').MongoClient

const requestData = require('./utils/requestData')
const scrapeLatest = require('./utils/scraper')

const listURL = 'https://www.mangaeden.com/api/list/0/'
const scrapeURL = 'http://www.mangaeden.com/eng/'
const url = 'mongodb://kt:tsuk1yomi@ds121225.mlab.com:21225/mangalist'

const mycomparator = (a, b) => b.h - a.h

MongoClient.connect(url, (err, db) => {
  console.log('connected')
  const list = db.collection('list')
  const latest = db.collection('latest')
  setInterval( async () => {
    const data = await requestData(listURL)
    const json = JSON.parse(data)
    json.manga.sort(mycomparator)
    list.update({ "db": true }, {$set: {
      data: json.manga
    }})
    updateLatest(latest, json)
    console.log("updated")
  },1800000)
})

const updateLatest = async (latest, json) => {
  const html = await requestData(scrapeURL)
  const scrapeData = scrapeLatest(html)
  const latestInfo = scrapeData.map( title => json.manga.find(item => item.t === title.trim()))
  const pureArray = latestInfo.filter(x => typeof(x) != 'undefined')
  latest.update({ "db": true }, {$set: {
    data: pureArray
  }})
}

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('You have reached mangaflux-scraper')
  res.end()
}).listen(process.env.PORT || 5000)

setInterval(() => {
  http.get("http://mangaflux-scraper.herokuapp.com/")
  http.get("http://mangaflux-api.herokuapp.com/")
}, 30000)
