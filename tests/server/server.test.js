const { run } = require('../runner.js')
const http = require('http')
const WebSocketServer = require('../../server/websocketserver.js')
const wsServerSave = WebSocketServer

class NewWebSocketServer {
  constructor() { }
  registerDataBase(database) { this.database = database }
}

module.children[1].exports = NewWebSocketServer

const Server = require('../../server/server.js')

class ServerTest {
  static constructorTest() {
    let serv = new Server()

    run('ok', (serv instanceof Server))
    run('equal', serv.router, null)
    run('equal', serv.webSocketServer, null)
    run('equal', serv.database, null)
    run('ok', (serv.server instanceof http.Server))
  }

  static tearsDown() {
    // Rétablissement du comportement d'origine
    module.children[1].exports = wsServerSave
  }

  static registerDataBaseTest() {
    //Mockup
    const f = () => { }
    let serv = new Server()

    run('deepEqual', serv.registerDataBase(f), serv)
    run('deepEqual', serv.database, f)
  }

  static registerRouterTest() {
    //Mockup
    const f = {
      database: null,
      registerDataBase: (database) => { f.database = database }
    }
    let serv = new Server()

    run('deepEqual', serv.registerRouter(f), serv)
    run('deepEqual', serv.router, f)
    run('deepEqual', serv.router.database, serv.database)
    run('equal', serv.server.listeners('request')[0].toString(), ((req, res) => { this.router.handle(req, res) }).toString())
  }

  static registerWebSocketServerTest() {
    let serv = new Server()

    run('deepEqual', serv.registerWebSocketServer(), serv)
    run('ok', serv.webSocketServer instanceof NewWebSocketServer)
    run('deepEqual', serv.webSocketServer.database, serv.database)
  }

  static startTest() {
    let serv = new Server()
    serv.start({ port: '4040' })

    run('ok', serv.server.listening)
    serv.server.close()
  }
}

module.exports = ServerTest
