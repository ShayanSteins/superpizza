const http = require('http')
const fs = require('fs')
const WebSocket = require('ws')
const config = require('./config.json')
const Database = require('./database.js')

const distPath = __dirname + '/../../dist/'

const mimeType = {
  css: 'text/css',
  js: 'application/javascript',
  map: 'application/javascript',
  html: 'text/html',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml'
}

// let menu = require(__dirname + '/datas.json')
const db = new Database(config.dataBase)
let menu = null
db.executeQuery('SELECT * FROM Pizzas').then((result) => {
  menu = result
}).catch((err) => {
  throw err
})

let comms = []

const server = http.createServer((req, res) => {
  const fileName = req.url === '/' ? 'index.html' : req.url
  const extension = fileName.split('.')[fileName.split('.').length - 1]
  const method = req.method

  if (method === 'GET') {
    if (fileName === '/initCli') {
      res.statusCode = 200
      res.end(JSON.stringify(menu))
    }
    else if (!fs.existsSync(distPath + fileName)) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')
      res.end(`Error 404 : File "${distPath + fileName}" not found... (T_T)`)
      return
    }
    else {
      res.statusCode = 200
      res.setHeader('Content-Type', mimeType[extension])
      res.end(fs.readFileSync(distPath + fileName))
    }
  }
})


server.listen(config.server.port, () => {
  console.log(`Server running at port ${config.server.port}`)
})