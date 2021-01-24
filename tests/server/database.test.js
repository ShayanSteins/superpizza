const { run } = require('../runner.js')
const mariadb = require('mariadb')

// Mockup de la fonction createPool de MariaDb
function createPool (config) {
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
// Enregistrement du mockup dans module
module.children[1].exports.createPool = createPool
const Database = require('../../server/database.js')

/**
 * Test du fichier database.js
 */
class DatabaseTest {
  static constructorTest () {
    // Test de l'absence du fichier de configuration
    run('throws', () => new Database(), new Error('Le fichier de configuration est manquant.'))
  }

  static tearsDown () {
    // Rétablissement du comportement d'origine
    module.children[1].exports.createPool = mariadb.createPool
  }

  static testConnectionTest () {
    const db = new Database({ host: 'localhost' })
    // Vérification de la fonction testConnection, qui ne doit pas lancer d'exception
    run('doesNotThrow', async () => { return await db.testConnection() })
  }

  static async executeQueryTest () {
    const db = new Database({ host: 'localhost' })
    // Vérification d'une requête sans paramètre, qui doit passer par query
    await db.executeQuery('SELECT').then((result) => run('deepEqual', result, ['query']))
    // Vérification d'une requête avec un tableau de paramètres, qui doit passer par query
    await db.executeQuery('INSERT', ['data']).then((result) => run('deepEqual', result, ['query', ['data']]))
    // Vérification d'une requête avec un tableau de tableau de paramètres, qui doit passer par batch
    await db.executeQuery('UPDATE', [['', '']]).then((result) => run('deepEqual', result, ['batch', [['', '']]]))
  }

  static async setTimeSlotsTest () {
    const db = new Database({ host: 'localhost' })
    // Vérification du résultat et de la fonction employée, pour un élément en paramètre
    await db.setTimeSlots(['19:30']).then((result) => run('deepEqual', result, ['query', ['19:30']]))
    // Vérification du résultat et de la fonction employée, pour plusieurs éléments en paramètre
    await db.setTimeSlots(['18:10', '18:20', '18:30']).then((result) => run('deepEqual', result, ['batch', [['18:10'], ['18:20'], ['18:30']]]))
  }

  static async addOrderTest () {
    const datas = {
      lastName: 'toto',
      firstName: 'titi',
      phone: '00.00.00.00.00',
      totalPrice: 10,
      timeSlot: '19:30',
      pizzas: [[1, 1]]
    }
    const db = new Database({ host: 'localhost' })
    // Vérification du retour lors d'une requête d'Insert
    await db.addOrder(datas).then((result) => {
      run('deepEqual', result, ['batch', [[15, 1, 1]]])
    })
  }

  // Fonctions nécessitant des tests d'intégration : non traité dans le cadre des TU
  // static getMenuTest () { }
  // static getOrdersTest () { }
  // static getTimeSlotsFromDBTest () { }
  // static setStateTest () { }
  // static getCredentialsTest () { }
  // static setCredentialsTest () { }
}

module.exports = DatabaseTest
