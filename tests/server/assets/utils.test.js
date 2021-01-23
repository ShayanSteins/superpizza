const { run } = require('../../runner.js')
const { hasher, compare } = require('../../../server/assets/utils.js')


class UtilsTest {
  static hasherTest() {
    let attendedResult = {
      salt: '4d803ff8ddc4',
      hashedpassword: '6a675368e5ed19ea108f87de5d823a58c8ecfafaf93cfcddb702b4c20f2aaa134c507c9e320ef3754bf1a96c4612083fa8c73d5855088eed772646ff49f397fd'
    }
    run('deepEqual', hasher('monsuperpassword', '4d803ff8ddc4'), attendedResult)
  }

  static compareTest() {
    run('throws', () => compare(null, 'admin'))
    run('throws', () => compare({ password: 'monsuperpassword' }, 'admin'))
    run('ok', !compare('monsuperpassword', 'admin'))
    run('ok', compare('admin', 'admin'))
  }
}

module.exports = UtilsTest
