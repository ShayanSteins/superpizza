const WebSocket = require('ws')

class WebSocketServer {
  constructor(server) {
    this.ws = new WebSocket.Server({ server })
    this.database = null
    this.socketList = []
    this.timeSlots = new Map([['18:10', 0], ['18:20', 0], ['18:30', 0], ['18:40', 0], ['18:50', 0], ['19:00', 0], ['19:10', 0], ['19:20', 0], ['19:30', 0], ['19:40', 0], ['19:50', 0]])
    this.pile = ['18:10', '18:20', '18:30', '18:40', '18:50', '19:00', '19:10', '19:20', '19:30', '19:40', '19:50']
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

        console.log(`Nouveau message de type ${message.head}`)

        switch (message.head) {
          case 'newOrder':
            this.database.addOrder(message.datas).then((response) => {
              if (!response.warningStatus) {
                // MAJ des slots utilisés
                this.setSlotUsed(message.datas)

                // renvoyer la commande à l'admin


                // Notification des autres clients pour qu'ils mettent à jour leur slot dispo
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
              arrSlot = this.getTimeSlots(message.datas)
            else
              arrSlot = this.getTimeSlots()
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

  /**
   * Mets à jour les slots utilisés par la nouvelle commande
   * @param {Object} order : Objet contenant l'ensemble des informations de la nouvelle commande
   */
  setSlotUsed(order) {
    let index = this.pile.indexOf(order.timeSlot)
    for (let i = index; i > index - order.totalQty; i--) {
      this.timeSlots.set(this.pile[i], 1)
    }
  }

  /**
   * Récupère l'ensemble des horaires de retrait possibles pour une quantité de pizzas donnée
   * @param {Number} qtyPizzas : quantité de pizza pour la commande
   * @returns {Array} availableSlots: tableau contenant l'ensemble des horaires possibles
   */
  getTimeSlots(qtyPizzas = 1) {
    let availableSlots = []
    if (this.getEmptySlots().length >= qtyPizzas) { // Si il y au moins autant de slots disponibles que de pizzas en commande

      for (let i = 0; i < this.pile.length; i++) {

        if (i + qtyPizzas <= this.pile.length) { // Si il y a suffisamment de slot suivant (si l'on est pas à la fin de la pile)
          let isEnoughSpace = true
          let studySlot = []

          for (let y = i; y < i + qtyPizzas; y++) { // Vérifie si les 'qtyPizzas' slots suivants sont disponibles
            if (this.timeSlots.get(this.pile[y])) {
              isEnoughSpace = false
              break
            }
            studySlot.push(this.pile[y])
          }

          if (isEnoughSpace) { // Si on a trouvé assez d'espace
            availableSlots.push(studySlot[studySlot.length - 1]) // On ajoute le dernier slot, correspondant à l'horaire de retrait possible de la commande
          }
        }
      }
    }
    // console.log(JSON.stringify(Array.from(availableSlots)))
    return availableSlots
  }

  /**
 * Retourne tous les slots non occupé (sans commande) de this.timeSlots
 * @returns {Array} emptySlots : tableau contenant les horaires diponibles
 */
  getEmptySlots() {
    let emptySlots = []
    for (const [time, available] of this.timeSlots) {
      if (!available) emptySlots.push(time)
    }
    return emptySlots
  }
}

module.exports = WebSocketServer