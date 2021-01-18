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

                // renvoyer la commande à l'admin


                // Notification des autres clients pour qu'ils mettent à jour leur slots dispos
                this.socketList.forEach(so => {
                  if (so != socket)
                    so.send(JSON.stringify({ "head": "updateSlotsRequired" }))
                })
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