const fs = require('fs')
const { compare } = require('./assets/utils.js')


// Types MIME
const mimeType = {
  css: 'text/css',
  js: 'application/javascript',
  map: 'application/javascript',
  html: 'text/html',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
  ico: 'image/x-icon'
}

/**
 * Routeur web
 * @property {String} distPath : chemin d'accès au dossier dist (parcel)
 */
class Router {
  constructor(config) {
    this.distPath = config.distPath
    this.database = null
  }

  /**
   * Enregistrement du gestionnaire de base de données
   * @param {Database} Database : gestionnaire de base de données
   */
  registerDataBase(Database) {
    this.database = Database
  }

  /**
   * Gestionnaire de route et requête HTTP
   * @param {Request} req : requête à router
   * @param {Response} res : réponse reçue
   */
  async handle(req, res) {
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
      else if (fileName === '/login') {
        try {
          let credentials = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8')
          let [username, pwd] = credentials.split(':')  
          let match = await compare(pwd, username)
          if (match) {
            res.statusCode = 200
            res.end(JSON.stringify('OK'))
          }
          else {
            res.statusCode = 400
            res.end(JSON.stringify(`Erreur lors de l'authentification. Merci de saisir à nouveau vos identifiants.`))
          }
          
        } catch (error) {
          throw error
        }
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