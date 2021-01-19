const WebSocket = require('ws')
const TimeManager = require('./timemanager.js')

class WebSocketServer {
  constructor(server) {
    this.ws = new WebSocket.Server({ server })
    this.database = null
    this.tm = new TimeManager()
    this.socketList = []
    this.init()
  }

  registerDataBase(Database) {
    this.database = Database
    this.database.getTimeSlotsFromDB().then((result) => {
      this.tm.init(result)
    })
  }

  init() {
    this.ws.on('connection', (socket) => {
      this.socketList.push(socket)

      socket.on('message', (message) => {
        message = JSON.parse(message)

        console.log(`Nouveau message de type ${message.head}`)

        switch (message.head) {
          case 'newOrder':
            this.database.addOrder(message.datas).then((response) => {
              if (!response.warningStatus) {
                // MAJ des slots utilisés
                let changedSlot = this.tm.setSlotUsed(message.datas)
                this.database.setTimeSlots(changedSlot)

                // Notification des autres clients pour qu'ils mettent à jour leur slots dispos + Admin qui mets à jour sa liste
                this.socketList.forEach(so => {
                  so.send(JSON.stringify({ "head": "updateSlotsRequired" }))
                })
              }
              else {
                // DO TO
              }
            })
            break;

          case 'getTimeSlots':
            let arrSlot
            if (message.datas)
              arrSlot = this.tm.getAvailableTimeSlots(message.datas)
            else
              arrSlot = this.tm.getAvailableTimeSlots()
            socket.send(JSON.stringify({ "head": "updateSlots", "datas": arrSlot }))
            break;

          case 'getOrders':
            this.database.getOrders().then((res) => {
              socket.send(JSON.stringify({ "head": "updateOrders", "datas": this.tm.requestOrdToArray(res) }))
            })
            break

          case 'setState':
            this.database.setState(message.datas.idOrder, message.datas.state).then((response) => {
              if (!response.warningStatus) {
                this.socketList.forEach(so => {
                  so.send(JSON.stringify({ "head": "updateState", "datas": { "idOrder": message.datas.idOrder, "state": message.datas.state } }))
                })
              }
              else {
                //TO DO
              }
            })
            break

          default:
            break;
        }
      })

      socket.on('close', () => {
        this.socketList = this.socketList.filter(s => s !== socket);
      });
    })
  }
}

module.exports = WebSocketServer