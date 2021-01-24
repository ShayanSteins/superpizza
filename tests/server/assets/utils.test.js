const { run } = require('../../runner.js')
const { hasher, compare } = require('../../../server/assets/utils.js')

/**
 * Test du fichier assets/utils.js
 */
class UtilsTest {
  static hasherTest () {
    const attendedResult = {
      salt: '4d803ff8ddc4',
      hashedPassword: '6a675368e5ed19ea108f87de5d823a58c8ecfafaf93cfcddb702b4c20f2aaa134c507c9e320ef3754bf1a96c4612083fa8c73d5855088eed772646ff49f397fd'
    }
    // Vérification du résultat de la fonction en spécifiant un salt
    run('deepEqual', hasher('monsuperpassword', '4d803ff8ddc4'), attendedResult)

    // Vérification du fonctionnement sans salt
    run('ok', hasher('monsuperpassword'))
  }

  static compareTest () {
    const attendedResult = {
      salt: '4d803ff8ddc4',
      hashedPassword: 'c4a3d9996e0c9d264f0b3ee5ba61707fdac09857c915dd0f97f221bc565f9d431c6876eb03cfb88ea5bd389de86296911204ea6112f972dab46b564ab517938f',
      username: 'admin'
    }
    // Vérification lorsque l'un des paramètres est null
    run('throws', () => compare(null, 'admin'))
    // Vérification lorsque le type attendu n'est pas respecté
    run('throws', () => compare({ password: 'monsuperpassword'}, 'admin', {}))
    // Vérification lorsque l'un des paramètres n'a pas la valeur attendue
    run('ok', !compare('monsuperpassword', 'admin', attendedResult))
    // Vérification lorsque les paramètres ont le bon type et la bonne valeur
    run('ok', compare('admin', 'admin', attendedResult))
  }
}

module.exports = UtilsTest
