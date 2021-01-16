const fs = require('fs')

const mimeType = {
  css: 'text/css',
  js: 'application/javascript',
  map: 'application/javascript',
  html: 'text/html',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml'
}

class Router {
  constructor(config) {
    this.distPath = config.distPath
    this.database = null
  }

  registerDataBase(Database) {
    this.database = Database
  }

  handle(req, res) {
    const fileName = req.url === '/' ? 'index.html' : req.url
    const extension = fileName.split('.')[fileName.split('.').length - 1]
    const method = req.method

    if (method === 'GET') {
      if (fileName === '/initCli') {
        res.statusCode = 200
        this.database.getMenu().then((result) => {
          res.end(JSON.stringify(result))
        }).catch((err) => {
          throw err
        })
      }
      else if (!fs.existsSync(this.distPath + fileName)) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html')
        res.end(`Error 404 : File "${this.distPath + fileName}" not found... (T_T)`)
      }
      else {
        res.statusCode = 200
        res.setHeader('Content-Type', mimeType[extension])
        res.end(fs.readFileSync(this.distPath + fileName))
      }
    }
  }
}

module.exports = Router