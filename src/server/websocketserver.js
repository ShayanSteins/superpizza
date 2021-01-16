const WebSocket = require('ws')

class WebSocketServer {
  constructor (server) {
    this.ws = new WebSocket.Server({ server })
    this.database = null
    this.socketList = []
    this.init()
  }

  registerDataBase(Database) {
    this.database = Database
  }

  init() {
    this.ws.on('connection', (socket) => {
      this.socketList.push(socket)

      socket.on('message', (message) => {
        message = JSON.parse(message)
        if(message.head === 'newOrder') {
          this.database.addOrder(message.datas).then((response) => {
            if(!response.warningStatus) {
              // is ok
              // renvoyer la commande à l'admin
              // recalculer les slots dispo pour les clients
            }
          })
        }
        

        // if (message === 'getMenu') {
        //   socket.send(JSON.stringify(menu))
        // }
        // socketList.forEach(so => {
        //   so.send(message)
        // });
      })

      socket.on('close', () => {
        this.socketList = this.socketList.filter(s => s !== socket);
      });
    })
  }
}

module.exports = WebSocketServer