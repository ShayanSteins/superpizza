const mariadb = require('mariadb')

/**
 * Gestionnaire de base de données
 * @property {mariadb.Pool} : Pool de connexion à la DB
 */
class Database {
  constructor(config) {
    try {
      this.pool = mariadb.createPool(config)
      this.testConnection()
    } catch (error) {
      throw error
    }
  }

  /**
   * Teste la connexion à la DB via une requête simple
   */
  async testConnection() {
    try {
      await this.pool.query("SELECT version()")
    } catch (error) {
      throw error
    }
  }

  /**
   * Fonction d'exécution des requêtes
   * @param {String} query : requête paramétrée à exécuter
   * @param {Array[Array]|Array|null} params : paramètres à inclure dans la requête
   */
  async executeQuery(query, params) {
    try {
      if (Array.isArray(params) && Array.isArray(params[0]))
        return await this.pool.batch(query, params)
      else if (Array.isArray(params))
        return await this.pool.query(query, params)
      else
        return await this.pool.query(query)

    } catch (error) {
      throw error
    }
  }

  /**
   * Retourne l'ensemble des pizzas de la carte
   */
  getMenu() {
    return this.executeQuery('SELECT * FROM Pizzas')
  }

  /**
   * Retourne l'ensemble des commandes, avec les pizzas de chacune
   */
  getOrders() {
    return this.executeQuery('SELECT o.idOrder, o.lastName, o.firstName, o.phone, o.state, o.price, o.timeSlot, p.name, op.qty FROM Orders as o, OrderPizza as op, Pizzas as p WHERE p.idPizza = op.idPizza AND o.idOrder = op.idOrder ORDER BY o.timeSlot, o.idOrder')
  }

  /**
   * Retourne l'ensemble des TimeSlots 
   */
  getTimeSlotsFromDB() {
    return this.executeQuery('SELECT * FROM TimeSlot')
  }

  /**
   * Mets à jour un timeSlot
   * @param {Array} hour : Tableau des horaires à modifier
   */
  setTimeSlots(hour) {
    const updateOrder = "UPDATE TimeSlot SET used = 1 WHERE hour = ?"
    if (hour.length > 1) {
      for (let i = 0; i < hour.length; i++) {
        hour[i] = [hour[i]]
      }
    }
    return this.executeQuery(updateOrder, hour)
  }

  /**
   * Mets à jour le statut d'une commande
   */
  setState(id, state) {
    const updateStateOrder = "UPDATE Orders SET state = ? WHERE idOrder = ?"
    return this.executeQuery(updateStateOrder, [state, id])
  }

  /**
   * Ajoute une commande en base de données
   * @param {Object} datas : objet représentant la commande 
   */
  async addOrder(datas) {
    const insertOrder = "INSERT INTO Orders (lastName, firstName, phone, state, price, timeSlot) VALUES(?,?,?,0,?,?)"
    let res = await this.executeQuery(insertOrder, [datas.lastName, datas.firstName, datas.phone, datas.totalPrice, datas.timeSlot])

    const insertOrderPizza = "INSERT INTO OrderPizza (idOrder, idPizza, qty) VALUES (?, ?, ?)"
    const params = []
    for (const [id, qty] of datas.pizzas) {
      if (qty > 0) params.push([res.insertId, id, qty])
    }
    return await this.executeQuery(insertOrderPizza, params)
  }
}

module.exports = Database