const http = require('http')
const MongoClient = require('mongodb').MongoClient

const requestData = require('./utils/requestData')

const listURL = 'https://www.mangaeden.com/api/list/0/'
const url = 'mongodb://kt:tsuk1yomi@ds121225.mlab.com:21225/mangalist'


MongoClient.connect(url, (err, db) => {
  console.log('connected')
  const list = db.collection('list')
  setInterval(async () => {
    const data = await requestData(listURL)
    list.update({ "db": true }, {$set: {
      data: JSON.parse(data)
    }})
    console.log("updated")
  }, 1800000)
})

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('You have reached mangaflux-scraper');
  res.end();
}).listen(process.env.PORT || 5000);
