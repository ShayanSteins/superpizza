const { run } = require('../runner.js')
const http = require('http')
const WebSocketServer = require('../../server/websocketserver.js')
const TimeManager = require('../../server/assets/timemanager.js')

// Mockup Date
class Date {
  constructor() {
    return {
      getUTCHours: () => Date.utcHours,
      getUTCMinutes: () => Date.utcMinutes
    }
  }
}
global.Date = Date

class WebSocketServerTest {
  static constructorTest() {
    const wss = new WebSocketServer(new http.Server())

    run('ok', wss instanceof WebSocketServer)
    run('equal', wss.database, null)
    run('ok', wss.timeManager instanceof TimeManager)
    run('deepEqual', wss.socketList, [])
  }

  static async registerDataBaseTest() {
    // Mockup
    const f = {
      getTimeSlotsFromDB() { return Promise.resolve([{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }]) }
    }

    const wss = new WebSocketServer(new http.Server())
    await wss.registerDataBase(f)
    run('deepEqual', wss.database, f)
    run('deepEqual', wss.timeManager.timeslots, new Map([['18:10', 0], ['18:20', 0]]))
    run('deepEqual', wss.timeManager.pile, ['18:10', '18:20'])
  }

  static initTest() {
    const wss = new WebSocketServer(new http.Server())
    run('ok', wss.ws.listeners('connection').length === 1)
  }

  static async routeTest() {
    // Mockup
    const f = {
      getTimeSlotsFromDB() { return Promise.resolve([{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }, { hour: '18:30', used: 0 }]) },
      getOrders() { return Promise.resolve([{ idOrder: 1 }, { idOrder: 1 }]) },
      addOrder(datas) {
        let response = {}
        if (datas.state === -1) response.warningStatus = true
        return Promise.resolve(response)
      },
      setTimeSlots(changedSlot) { },
      setState(idOrder, state) {
        let response = {}
        if (state === -1) response.warningStatus = true
        return Promise.resolve(response)
      }
    }

    const socket = {
      lastMessage: null,
      send(message) { socket.lastMessage = message }
    }

    // Construction
    const wss = new WebSocketServer(new http.Server())

    await wss.registerDataBase(f)
    Date.utcHours = 15
    Date.utcMinutes = 0

    // newOrder
    let message = {
      head: 'newOrder',
      datas: {
        state: 0,
        timeSlot: '18:10',
        totalQty: 1
      }
    }
    wss.socketList.push(socket)
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateSlotsRequired"}')

    message.datas.state = -1
    socket.lastMessage = null
    await wss.route(socket, message)
    run('equal', socket.lastMessage, null)

    // getTimeSlots
    message.head = 'getTimeSlots'
    message.datas = 2
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateSlots","datas":["18:30"]}')
    
    delete message.datas
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateSlots","datas":["18:20","18:30"]}')

    // getOrders
    message.head = 'getOrders'
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateOrders","datas":[{"idOrder":1,"pizzas":[{},{}]}]}')

    // setState
    message.head = 'setState'
    message.datas = {
      idOrder: 1,
      state: 1
    }
    await wss.route(socket, message)
    run('equal', socket.lastMessage, '{"head":"updateState","datas":{"idOrder":1,"state":1}}')

    message.datas.state = -1
    socket.lastMessage = null
    await wss.route(socket, message)
    run('equal', socket.lastMessage, null)

    message.head = 'notSupportedMessage'
    wss.route(socket, message)
    run('equal', socket.lastMessage, null)

  }
}

module.exports = WebSocketServerTest