const mariadb = require('mariadb')

class Database {

  constructor(config) {
    this.pool = mariadb.createPool(config)
    this.testConnection()
  }

  async testConnection() {
    try {
      await this.pool.query("SELECT version()")
    } catch (error) {
      throw error
    }
  }


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

  getMenu() {
    return this.executeQuery('SELECT * FROM Pizzas')
  }

  getOrders() {
    return this.executeQuery('SELECT o.idOrder, o.lastName, o.firstName, o.phone, o.state, o.price, o.timeSlot, p.name, op.qty FROM Orders as o, OrderPizza as op, Pizzas as p WHERE p.idPizza = op.idPizza AND o.idOrder = op.idOrder ORDER BY o.timeSlot, o.idOrder')
  }

  getTimeSlotsFromDB() {
    return this.executeQuery('SELECT * FROM TimeSlot')
  }

  setTimeSlots(hour) {
    const updateOrder = "UPDATE TimeSlot SET used = 1 WHERE hour = ?"
    if (hour.length > 1) {
      for (let i = 0; i < hour.length; i++) {
        hour[i] = [hour[i]]
      }
    }
    return this.executeQuery(updateOrder, hour)
  }

  setState(id, state) {
    const updateStateOrder = "UPDATE Orders SET state = ? WHERE idOrder = ?"
    return this.executeQuery(updateStateOrder, [state, id])
  }

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

  



  // const getAllPizzas = 'SELECT * FROM Pizzas'
  // const getAllOrders = 'SELECT o.idOrder, o.timeSlot, p.idPizza, op.qty FROM Orders as o, OrderPizza as op, Pizzas as p WHERE p.idPizza = op.idPizza AND o.idOrder = op.idOrder'
  // const insertOrder = "INSERT INTO Orders (lastName, firstName, phone, state, price, timeSlot) VALUES('ted','ted','00.00.00.00.00','0',25.00,'19:30')"
  // const insertOrderPizza = "INSERT INTO OrderPizza (idOrder, idPizza, qty) VALUES(1,1,3),(1,3,1),(1,5,2)"
  // const reinitOrderPizza = "DELETE FROM OrderPizza"
  // const reinitOrders = "DELETE FROM Orders"
}

module.exports = Database