const { run } = require('../../runner.js')
const saveDate = global.Date
const TimeManager = require('../../../server/assets/timemanager.js')

const datas = [{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }, { hour: '18:30', used: 0 }, { hour: '18:40', used: 0 },
  { hour: '18:50', used: 0 }, { hour: '19:00', used: 0 }, { hour: '19:10', used: 0 }, { hour: '19:20', used: 0 },
  { hour: '19:30', used: 0 }, { hour: '19:40', used: 0 }, { hour: '19:50', used: 0 }, { hour: '20:00', used: 0 }]

/**
 * Test du fichier assets/timemanager.js
 */
class TimeManagerTest {
  static constructorTest () {
    const tm = new TimeManager()

    // Vérification du type et de la taille des éléments instanciés
    run('ok', (tm instanceof TimeManager))
    run('ok', (tm.timeslots instanceof Map))
    run('equal', tm.timeslots.size, 0)
    run('ok', Array.isArray(tm.pile))
    run('equal', tm.pile.length, 0)
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
  }

  static tearsDown () {
    // Rétablissement du comportement d'origine
    global.Date = saveDate
  }

  static initTest () {
    const timeSlotsAttended = new Map([['18:10', 0], ['18:20', 0], ['18:30', 0], ['18:40', 0], ['18:50', 0],
      ['19:00', 0], ['19:10', 0], ['19:20', 0], ['19:30', 0], ['19:40', 0], ['19:50', 0], ['20:00', 0]])
    const pileAttended = ['18:10', '18:20', '18:30', '18:40', '18:50', '19:00', '19:10', '19:20', '19:30', '19:40', '19:50', '20:00']

    const tm = new TimeManager()
    tm.init(datas)

    // Vérification du contenu des proprités de la classe après initialisation
    run('deepEqual', tm.timeslots, timeSlotsAttended)
    run('deepEqual', tm.pile, pileAttended)
  }

  static setSlotUsedTest () {
    const order = {
      totalQty: 4,
      timeSlot: '19:40'
    }
    const attendedResult = ['19:40', '19:30', '19:20', '19:10']
    const attendedModifiedTimeSlot = new Map([['18:10', 0], ['18:20', 0], ['18:30', 0], ['18:40', 0], ['18:50', 0],
      ['19:00', 0], ['19:10', 1], ['19:20', 1], ['19:30', 1], ['19:40', 1], ['19:50', 0], ['20:00', 0]])

    const tm = new TimeManager()
    tm.init(datas)

    // Vérification du retour de la fonction
    run('deepEqual', tm.setSlotUsed(order), attendedResult)
    // Vérification de la mise à jour de la propriété timeSlots
    run('deepEqual', tm.timeslots, attendedModifiedTimeSlot)
  }

  static getAvailableTimeSlotsTest () {
    let result
    const usedDatas = [{ hour: '18:10', used: 0 }, { hour: '18:20', used: 0 }, { hour: '18:30', used: 1 }, { hour: '18:40', used: 0 },
      { hour: '18:50', used: 0 }, { hour: '19:00', used: 0 }, { hour: '19:10', used: 0 }]

    const tm = new TimeManager()
    tm.init(usedDatas)

    // Définition de l'heure actuelle
    Date.utcHours = 15
    Date.utcMinutes = 10

    // Lorsque le nombre de pizzas dépasse celui de slots disponibles
    result = tm.getAvailableTimeSlots(10)
    run('deepEqual', result, [])

    // Lorsqu'il existe des créneaux disponibles
    result = tm.getAvailableTimeSlots(3)
    run('deepEqual', result, ['19:00', '19:10'])

    // Lorsqu'il n'y a pas assez de slots consécutifs disponibles
    result = tm.getAvailableTimeSlots(5)
    run('deepEqual', result, [])
  }

  static checkCurrentHourTest () {
    const arr = ['18:10', '18:20', '18:30', '18:40', '18:50']
    const arr1 = ['18:30', '18:40', '18:50']
    const arr2 = ['18:10', '18:20', '18:30', '18:40', '18:50']
    let result

    const tm = new TimeManager()
    tm.init(datas)

    // Test lorsque l'heure actuelle est 18:25 (la fonction checkCurrentHour rajoute 1h car on utilise UTC)
    Date.utcHours = 17
    Date.utcMinutes = 25
    result = tm.checkCurrentHour(arr)
    run('deepEqual', result, arr1)

    // Test lorsque l'heure actuelle est 9:05
    Date.utcHours = 8
    Date.utcMinutes = 5
    result = tm.checkCurrentHour(arr)
    run('deepEqual', result, arr2)
  }

  static getEmptySlotsTest () {
    let result
    const usedDatas = [{ hour: '18:10', used: 1 }, { hour: '18:20', used: 0 }, { hour: '18:30', used: 1 }, { hour: '18:40', used: 0 },
      { hour: '18:50', used: 0 }, { hour: '19:00', used: 0 }, { hour: '19:10', used: 0 }]
    const attendedResult = ['18:20', '18:40', '18:50', '19:00', '19:10']

    const tm = new TimeManager()
    tm.init(usedDatas)

    // Vérifie que seuls les slots disponibles sont retournés dans un tableau
    result = tm.getEmptySlots()
    run('deepEqual', result, attendedResult)
  }

  static requestOrdToArrayTest () {
    let result
    const dbResult = [{ idOrder: 1, lastName: 'Tartampion', firstName: 'Eric', phone: '00.00.00.00.00', state: 0, price: 24, timeSlot: '19:30', name: 'Pacman', qty: 1 },
      { idOrder: 1, lastName: 'Tartampion', firstName: 'Eric', phone: '00.00.00.00.00', state: 0, price: 24, timeSlot: '19:30', name: 'Hello Pizzy', qty: 1 }]
    const attendedResult = [{ idOrder: 1, lastName: 'Tartampion', firstName: 'Eric', phone: '00.00.00.00.00', state: 0, price: 24, timeSlot: '19:30', pizzas: [{ name: 'Pacman', qty: 1 }, { name: 'Hello Pizzy', qty: 1 }] }]

    const tm = new TimeManager()
    tm.init(datas)

    // Vérifie que le tableau sortant correspond au format attendu
    result = tm.requestOrdToArray(dbResult)
    run('deepEqual', result, attendedResult)
  }
}

module.exports = TimeManagerTest
