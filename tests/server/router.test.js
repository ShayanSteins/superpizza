const fs = require('fs')
const { run } = require('../runner.js')
const Router = require('../../server/router.js')

class RouterTest {

  static constructorTest() {
    const router = new Router({ distPath: '/' })

    run('ok', router instanceof Router)
    run('equal', router.distPath, '/')
    run('equal', router.database, null)
  }

  static registerDataBaseTest() {
    //Mockup
    const f = {}
    const router = new Router({ distPath: '/' })

    router.registerDataBase(f)
    run('deepEqual', router.database, f)
  }

  static async handleTest() {
    // MockUp response
    const res = {
      head: [],
      data: '',
      statusCode: null,
      writeHead: (code, header) => { res.head = [code, header] },
      end: (data) => { res.data = data }
    }
    const f = {
      getMenu: () => Promise.resolve({})
    }

    const error404Html = '<html><body style="display: flex;background-color:  rgb(248, 248, 248);color: rgb(208 44 55);justify-content: center;align-items: center;"><h2>Error 404 : File "/errorPath" not found... (&deg;o&deg;)!</h2></body></html>'
    const router = new Router({ distPath: '/' })
    router.registerDataBase(f)

    // // Test de /
    // await router.handle({ url: '/' }, res)
    // // Test du statusCode
    // run('equal', res.statusCode, 200)
    // run('deepEqual', res.head, [200, { 'Content-Type': 'text/html' }])
    // // Test des datas
    // run('equal', res.data, '{}')
   
    // // Test de /admin
    // await router.handle({ url: '/admin' }, res)
    // // Test du statusCode
    // run('equal', res.statusCode, 200)
    // // Test des datas
    // run('equal', res.data, '{}')

    // Test de /initCli
    await router.handle({ url: '/initCli' }, res)
    // Test du statusCode
    run('equal', res.statusCode, 200)
    // Test des datas
    run('equal', res.data, '{}')

    // Test de /login fail
    res.head = []
    res.data = ''
    await router.handle({ url: '/login', headers: { authorization: 'Basic YWRtaW46YWRtaW4=' } }, res)
    // Test du statusCode
    run('equal', res.statusCode, 200)
    // Test des datas
    run('equal', res.data, '"OK"')
    
    // Test de /login success
    res.head = []
    res.data = ''
    await router.handle({ url: '/login', headers: { authorization: 'Basic YWRtaW46FTPtaW4=' } }, res)
    // Test du statusCode
    run('equal', res.statusCode, 400)
    // Test des datas
    run('equal', res.data, '"Erreur lors de l\'authentification. Merci de saisir à nouveau vos identifiants."')

    // Test de l'erreur 404
    res.head = []
    res.data = ''
    await router.handle({ url: 'errorPath' }, res)
    // Test du header
    run('deepEqual', res.head, [404, { 'Content-Type': 'text/html' }])
    // Test des datas
    run('equal', res.data, error404Html)

    // Test d'un fichier existant
    res.head = []
    res.data = ''
    await router.handle({ url: `${__dirname}/router.test.js` }, res)
    // Test du header
    run('deepEqual', res.head, [200, { 'Content-Type': 'application/javascript' }])
    // Test des datas
    run('equal', res.data.toString(), fs.readFileSync(`${__dirname}/router.test.js`).toString())
  }
}

module.exports = RouterTest