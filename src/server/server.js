const WebSocketServer = require('./websocketserver.js')
const http = require('http')

class Server {
  constructor() {
    this.router = null
    this.webSocketServer = null
    this.database = null
    this.server = http.createServer()
    return this
  }

  registerRouter(Router) {
    this.router = Router
    this.router.registerDataBase(this.database)
    this.server.on('request', (req, res) => { this.router.handle(req, res) })
    return this
  }

  registerWebSocketServer() {
    this.webSocketServer = new WebSocketServer(this.server)
    this.webSocketServer.registerDataBase(this.database)
    return this
  }

  registerDataBase(DataBase) {
    this.database = DataBase
    return this
  }

  start(config) {
    this.server.listen(config.port, () => {
      console.log(`Server running at port ${config.port}`)
    })
    return this
  }
}

module.exports = Server