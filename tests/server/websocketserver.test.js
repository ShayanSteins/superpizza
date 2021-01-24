const { run } = require('../runner.js')
const http = require('http')
const WebSocketServer = require('../../server/websocketserver.js')
const TimeManager = require('../../server/assets/timemanager.js')

// Sauvegarde avant les Mocks
const errorSave = console.error.bind({})
const dateSave = Date.bind({})

/**
 * Test du fichier websocketserver.js
 */
class WebSocketServerTest {
  static constructorTest () {
    const wss = new WebSocketServer(new http.Server())

    // Vérification du type et du contenu des propriétés instanciées
    run('ok', wss instanceof WebSocketServer)
    run('equal', wss.database, null)
    run('ok', wss.timeManager instanceof TimeManager)
    run('deepEqual', wss.socketList, [])
  }

  static async registerDataBaseTest () {
    // Mockup
    const f = {
      getTimeSlotsFromDB () { return Promise.resolve([{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }]) }
    }

    const wss = new WebSocketServer(new http.Server())
    await wss.registerDataBase(f)
    // vérification de la mise à jour de la propriété database
    run('deepEqual', wss.database, f)
  }

  static tearsUp () {
    // Mockup Date
    class Date {
      constructor () {
        return {
          getUTCHours: () => Date.utcHours,
          getUTCMinutes: () => Date.utcMinutes
        }
      }
    }
    global.Date = Date
    // Mockup console.error
    global.console.error = () => {}
  }

  static tearsDown () {
    // Rétablissement du comportement d'origine
    global.console.error = errorSave
    global.Date = dateSave
  }

  static async updateTimeManagerTest () {
    // Mockup
    const f = {
      exec: 0,
      getTimeSlotsFromDB () { 
        if(f.exec === 0) {
          f.exec++ 
          return Promise.resolve([{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }]) 
        } else 
          return Promise.resolve([{ hour: '19:10', used: 0 }, { hour: '19:20', used: 0 }]) 
      }
    }
    
    const wss = new WebSocketServer(new http.Server())
    await wss.registerDataBase(f)

    await wss.updateTimeManager()
    // vérification de la mise à jour de la propriété timeManager.timeslots
    run('deepEqual', wss.timeManager.timeslots, new Map([['19:10', 0], ['19:20', 0]]))
    // vérification de la mise à jour de la propriété timeManager.pile
    run('deepEqual', wss.timeManager.pile, ['19:10', '19:20'])

  }

  static initTest () {
    const wss = new WebSocketServer(new http.Server())
    // Vérification de l'existence d'un listener connection sur le websocket server
    run('ok', wss.ws.listeners('connection').length === 1)
  }

  static async routeTest () {
    // Mockup
    const f = {
      getTimeSlotsFromDB () { return Promise.resolve([{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }, { hour: '18:30', used: 0 }]) },
      getOrders () { return Promise.resolve([{ idOrder: 1 }, { idOrder: 1 }]) },
      addOrder (datas) {
        const response = {}
        if (datas.state === -1) response.warningStatus = true
        return Promise.resolve(response)
      },
      setTimeSlots (changedSlot) { },
      setState (idOrder, state) {
        const response = {}
        if (state === -1) response.warningStatus = true
        return Promise.resolve(response)
      }
    }
    const socket = {
      lastMessage: null,
      send (message) { socket.lastMessage = message }
    }
    // Structure d'un message pour newOrder
    const message = {
      head: 'newOrder',
      datas: {
        state: 0,
        timeSlot: '18:10',
        totalQty: 1
      }
    }
    // Définition de l'heure
    Date.utcHours = 15
    Date.utcMinutes = 0

    // Construction
    const wss = new WebSocketServer(new http.Server())
    await wss.registerDataBase(f)  
    wss.socketList.push(socket)

    await wss.route(socket, message)
    // Vérification du retour après réception d'un message avec l'entête "newOrder", et insertion réussi en BDD
    run('equal', socket.lastMessage, '{"head":"updateSlotsRequired"}')

    // Vérification du retour après réception d'un message avec l'entête "newOrder", et un échec d'insertion dans la BDD
    message.datas.state = -1
    socket.lastMessage = null
    await wss.route(socket, message)
    run('equal', socket.lastMessage, null)

    // Vérification du retour après réception d'un message avec l'entête "getTimeSlots" pour 2 pizzas
    message.head = 'getTimeSlots'
    message.datas = 2
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateSlots","datas":["18:30"]}')
    
    // Vérification du retour après réception d'un message avec l'entête "getTimeSlots" sans quantité de pizzas définie
    delete message.datas
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateSlots","datas":["18:20","18:30"]}')

    // Vérification du retour après réception d'un message avec l'entête "getOrders"
    message.head = 'getOrders'
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateOrders","datas":[{"idOrder":1,"pizzas":[{},{}]}]}')

    // Vérification du retour après réception d'un message avec l'entête "setState", et un update réussi en BDD
    message.head = 'setState'
    message.datas = {
      idOrder: 1,
      state: 1
    }
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateState","datas":{"idOrder":1,"state":1}}')

    // Vérification du retour après réception d'un message avec l'entête "setState", et un échec lors de l'update en BDD
    message.datas.state = -1
    socket.lastMessage = null
    await wss.route(socket, message)
    run('equal', socket.lastMessage, null)

    // Vérification du retour après réception d'un message avec une entête non prise en charge
    message.head = 'notSupportedMessage'
    wss.route(socket, message)
    run('equal', socket.lastMessage, null)
  }
}

module.exports = WebSocketServerTest
