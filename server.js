const http = require('http')
const MongoClient = require('mongodb').MongoClient

const requestData = require('./utils/requestData')

const listURL = 'https://www.mangaeden.com/api/list/0/'
const url = 'mongodb://kt:tsuk1yomi@ds121225.mlab.com:21225/mangalist'

const mycomparator = (a, b) => b.h - a.h

MongoClient.connect(url, (err, db) => {
  console.log('connected')
  const list = db.collection('list')
  setInterval(async () => {
    const data = await requestData(listURL)
    const json = JSON.parse(data)
    json.manga.sort(mycomparator)
    list.update({ "db": true }, {$set: {
      data: json.manga
    }})
    console.log("updated")
  }, 1800000)
})

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.write('You have reached mangaflux-scraper')
  res.end()
}).listen(process.env.PORT || 5000)

setInterval(() => {
  http.get("http://mangaflux-scraper.herokuapp.com/")
}, 300000)
