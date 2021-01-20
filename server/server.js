const WebSocketServer = require('./websocketserver.js')
const http = require('http')

/**
 * Serveur Web 
 * @property {Router} router : routeur web
 * @property {WebSocketServer} webSocketServer : Serveur de WebSocket
 * @property {Database} database : gestionnaire de base de données
 * @property {http.Server} server : serveur HTTP
 */
class Server {
  constructor() {
    this.router = null
    this.webSocketServer = null
    this.database = null
    this.server = http.createServer()
    return this
  }

  /**
   * Enregistrement du routeur web
   * @param {Router} Router : routeur web
   */
  registerRouter(Router) {
    this.router = Router
    this.router.registerDataBase(this.database)
    this.server.on('request', (req, res) => { this.router.handle(req, res) })
    return this
  }

  /**
   * Instanciation et enresgitrement du serveur de WebSocket
   */
  registerWebSocketServer() {
    this.webSocketServer = new WebSocketServer(this.server)
    this.webSocketServer.registerDataBase(this.database)
    return this
  }

  /**
   * Enregistrement du gestionnaire de base de données
   * @param {Database} DataBase : gestionnaire de base de données
   */
  registerDataBase(DataBase) {
    this.database = DataBase
    return this
  }

  /**
   * Lancement du serveur web
   * @param {Object} config : Objet contenant les paramètres de configuration serveur
   */
  start(config) {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server running at port ${process.env.PORT}`)
    })
    return this
  }
}

module.exports = Server