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
   * Gestionnaire de routes et requêtes HTTP
   * @param {Request} req : requête à router
   * @param {Response} res : réponse reçue
   */
  async handle(req, res) {
    let fileName = req.url === '/' ? 'app/index.html' : req.url
    fileName = fileName === '/admin' ? 'admin/admin.html' : fileName
    const extension = fileName.split('.')[fileName.split('.').length - 1]

    if (fileName === '/initCli') { // Initialistion d'un client, retourne le menu de pizzas
      res.statusCode = 200
      this.database.getMenu().then((result) => {
        res.end(JSON.stringify(result))
      }).catch((err) => {
        throw err
      })
    } else if (fileName === '/login') { // Login sur l'interface d'admin
      try {
        if (req.headers.authorization !== undefined && req.headers.authorization !== '') {
          const credentials = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8')
          const [username, pwd] = credentials.split(':')
          const dbCred = await this.database.getCredentials()
          const match = await compare(pwd, username, dbCred[0])
          if (match) {
            res.statusCode = 200
            res.end(JSON.stringify('OK'))
            return
          }
        }
        res.statusCode = 400
        res.end(JSON.stringify('Erreur lors de l\'authentification. Merci de saisir à nouveau vos identifiants.'))
      } catch (error) {
        throw error
      }
    } else if (!fs.existsSync(this.distPath + fileName)) { // Erreur 404
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end(`<html><body style="display: flex;background-color:  rgb(248, 248, 248);color: rgb(208 44 55);font-size: 2rem;justify-content: center;align-items: center;text-align: center;font-family: monospace;"><h2>Error 404 : File "${this.distPath + fileName}" not found... (&deg;o&deg;)!</h2></body></html>`)
    } else { // Cas nominal des fichiers html, js, css, images
      res.writeHead(200, { 'Content-Type': mimeType[extension] })
      res.end(fs.readFileSync(this.distPath + fileName))
    }
  }
}

module.exports = Router
