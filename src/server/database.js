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
  

  async executeQuery(query) {
    try {
      return await this.pool.query(query)
    } catch (error) {
      throw error
    }
  }
  

// const getAllPizzas = 'SELECT * FROM Pizzas'
// const getAllOrders = 'SELECT o.idOrder, o.timeSlot, p.idPizza, op.qty FROM Orders as o, OrderPizza as op, Pizzas as p WHERE p.idPizza = op.idPizza AND o.idOrder = op.idOrder'
// const insertOrder = "INSERT INTO Orders (lastName, firstName, phone, state, price, timeSlot) VALUES('ted','ted','00.00.00.00.00','0',25.00,'19:30')"
// const insertOrderPizza = "INSERT INTO OrderPizza (idOrder, idPizza, qty) VALUES(1,1,3),(1,3,1),(1,5,2)"
}

module.exports = Database