const Server = require('./server.js')
const Router = require('./router.js')
const Database = require('./database.js')
const config = require('./assets/config.json')

try {
  new Server()
    .registerDataBase(new Database(config.database))
    .registerRouter(new Router(config.server))
    .registerWebSocketServer()
    .start(config.server)

} catch (error) {
  throw error
}
