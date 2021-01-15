
const WebSocket = require('ws')

class WebSocketServer {
  constructor(server) {
    this.ws = new WebSocket.Server({ server })
    this.socketList = []
    init()
  }

  init() {
    this.ws.on('connection', function connection(socket) {
      socketList.push(socket)

      socket.on('message', function incoming(message) {
        // if (message === 'getMenu') {
        //   socket.send(JSON.stringify(menu))
        // }
        // socketList.forEach(so => {
        //   so.send(message)
        // });
      })
    
      socket.on('close', function () {
        socketList = socketList.filter(s => s !== socket);
      });
    })
  }
}

module.exports = WebSocketServer