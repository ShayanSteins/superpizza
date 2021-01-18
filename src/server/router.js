const fs = require('fs')
const { resolve } = require('path')

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
    let fileName = req.url === '/' ? 'app/index.html' : req.url
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
      else if (fileName === '/admin') {
        fileName = 'admin/admin.html'
        res.statusCode = 200
        res.setHeader('Content-Type', mimeType['html'])
        res.end(fs.readFileSync(this.distPath + fileName))
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
    else {
      if(fileName === '/login') {
        let body = ''
        let result = 'OK'
        req.on('data', (data) => { body += data })
        req.on('end', () => {
          console.log(Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8'))
          let credentials = JSON.parse(body)
          if(credentials.id!=='admin' || credentials.pwd!=='admin'){
            result = 'KO'
          }
          res.statusCode = 200
          res.end(JSON.stringify(result))
        })
        req.on('error', (e) => { console.error(e.message) })
      }
    }
  }
}

module.exports = Router