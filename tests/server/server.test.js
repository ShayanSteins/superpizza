const { run } = require('../runner.js')
const http = require('http')
const WebSocketServer = require('../../server/websocketserver.js')
const wsServerSave = WebSocketServer

// Mockup de WebSocketServer
class NewWebSocketServer {
  constructor () { }
  registerDataBase (database) { this.database = database }
}
module.children[1].exports = NewWebSocketServer
const Server = require('../../server/server.js')

/**
 * Test du fichier server.js
 */
class ServerTest {
  static constructorTest () {
    const serv = new Server()

    // Vérification du type et du contenu des propriétés instanciées
    run('ok', (serv instanceof Server))
    run('equal', serv.router, null)
    run('equal', serv.webSocketServer, null)
    run('equal', serv.database, null)
    run('ok', (serv.server instanceof http.Server))
  }

  static tearsDown () {
    // Rétablissement du comportement d'origine
    module.children[1].exports = wsServerSave
  }

  static registerDataBaseTest () {
    // Mockup
    const f = () => { }
    const serv = new Server()

    // Vérification du retour de la fonction
    run('deepEqual', serv.registerDataBase(f), serv)
    // Vérification de la mise à jour de la propriété database
    run('deepEqual', serv.database, f)
  }

  static registerRouterTest () {
    // Mockup
    const f = {
      database: null,
      registerDataBase: (database) => { f.database = database }
    }
    const serv = new Server()

    // Vérification du retour de la fonction
    run('deepEqual', serv.registerRouter(f), serv)
    // Vérification de la mise à jour de la propriété router
    run('deepEqual', serv.router, f)
    // Vérification de la mise à jour de la propriété router.database
    run('deepEqual', serv.router.database, serv.database)    
    // Vérification de l'existence d'un listener request sur le server
    run('equal', serv.server.listeners('request')[0].toString(), ((req, res) => { this.router.handle(req, res) }).toString())
  }

  static registerWebSocketServerTest () {
    const serv = new Server()

    // Vérification du retour de la fonction
    run('deepEqual', serv.registerWebSocketServer(), serv)
    // Vérification du type de webSocketServer
    run('ok', serv.webSocketServer instanceof NewWebSocketServer)
    // Vérification de la mise à jour de la propriété webSocketServer.database
    run('deepEqual', serv.webSocketServer.database, serv.database)
  }

  static startTest () {
    const serv = new Server()
    serv.start({ port: '4040' })
    // Vérification du fonctionnement d'écoute du server
    run('ok', serv.server.listening)
    serv.server.close()
  }
}

module.exports = ServerTest
