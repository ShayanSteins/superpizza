const { run } = require('../runner.js')
const mariadb = require('mariadb')

function createPool(config) {
  if (config === null || config === undefined) {
    throw new Error('Le fichier de configuration est manquant.')
  }
  return {
    config: config,
    batch: (query, params) => {
      return ['batch', params]
    },
    query: (query, params) => {
      if (query.match(/INSERT INTO Orders /))
        return { insertId: 15 }
      if (params !== undefined)
        return ['query', params]
      else
        return ['query']
    }
  }
}

module.children[1].exports.createPool = createPool

const Database = require('../../server/database.js')

class DatabaseTest {
  static constructorTest() {
    // Test de l'absence du fichier de configuration
    run('throws', () => new Database(), new Error('Le fichier de configuration est manquant.'))
  }

  static tearsDown() {
    // Rétablissement du comportement d'origine
    module.children[1].exports.createPool = mariadb.createPool
  }

  static testConnectionTest() {
    const db = new Database({ host: 'localhost' })
    run('doesNotThrow', async () => { return await db.testConnection() })
  }

  static async executeQueryTest() {
    const db = new Database({ host: 'localhost' })
    await db.executeQuery('SELECT').then((result) => run('deepEqual', result, ['query']))
    await db.executeQuery('INSERT', ['Data']).then((result) => run('deepEqual', result, ['query', ['Data']]))
    await db.executeQuery('UPDATE', [['', '']]).then((result) => run('deepEqual', result, ['batch', [['', '']]]))
  }

  static async setTimeSlotsTest() {
    const db = new Database({ host: 'localhost' })
    await db.setTimeSlots(['19:30']).then((result) => run('deepEqual', result, ['query', ['19:30']]))
    await db.setTimeSlots(['18:10', '18:20', '18:30']).then((result) => run('deepEqual', result, ['batch', [['18:10'], ['18:20'], ['18:30']]]))
  }

  static async addOrderTest() {
    const datas = {
      lastName: 'toto',
      firstName: 'titi',
      phone: '00.00.00.00.00',
      totalPrice: 10,
      timeSlot: '19:30',
      pizzas: [[1, 1]]
    }
    const db = new Database({ host: 'localhost' })
    await db.addOrder(datas).then((result) => {
      run('deepEqual', result, ['batch', [[15, 1, 1]]])
    })
  }


  // Test d'intégration
  static getMenuTest() { }
  static getOrdersTest() { }
  static getTimeSlotsFromDBTest() { }
  static setStateTest() { }
}

module.exports = DatabaseTest
