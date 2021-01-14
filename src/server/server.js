const http = require('http')
const fs = require('fs')
const WebSocket = require('ws')

const port = 4040
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

let menu = require(__dirname + '/datas.json')

let comms = []

const server = http.createServer((req, res) => {
  const fileName = req.url === '/' ? 'index.html' : req.url
  const extension = fileName.split('.')[fileName.split('.').length - 1]
  const method = req.method

  if (method === 'GET') {
    // if (fileName === '/admin') {
    //   res.statusCode = 200
    //   res.end(fs.readFileSync(distPath + 'admin/admin.html'))
    // }
    // else 
    if (!fs.existsSync(distPath + fileName)) {
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

const ws = new WebSocket.Server({ server })
let socketList = []

ws.on('connection', function connection(socket) {
  socketList.push(socket)
  console.log('Nouvelle connexion')

  socket.on('message', function incoming(message) {
    // console.log('Nouveau message : %s', message)
    if (message === 'getMenu') {
      socket.send(JSON.stringify(menu))
    }
    // socketList.forEach(so => {
    //   so.send(message)
    // });
  })

  socket.on('close', function () {
    socketList = socketList.filter(s => s !== socket);
  });
})


server.listen(port, () => {
  console.log(`Server running at port ${port}`)
})