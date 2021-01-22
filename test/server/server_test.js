const { run } = require('../runner.js')
const Server = require('../../server/server.js')
const Router = require('../../server/router.js')
const WebSocketServer = require('../../server/websocketserver.js')
const Database = require('../../server/database.js')
const http = require('http')

class ServerTest {
  static constructorTest() {
    this.serv = new Server()
    
    run('ok', (this.serv instanceof Server))
    run('equal', this.serv.router, null)
    run('equal', this.serv.webSocketServer, null)
    run('equal', this.serv.database, null)
    run('ok', (this.serv.server instanceof http.Server))
  }
}

module.exports = ServerTest