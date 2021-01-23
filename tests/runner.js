const assert = require('assert').strict

exports.right = 0
exports.error = 0

exports.run = (type, content, optionnal) => {
  const test = assert[type]
  if(optionnal && process.env.silent !== "1")
    console.log(`Test ${type} entre ${JSON.stringify(content)} et ${JSON.stringify(optionnal)}`)
  try {
    test(content, optionnal)
    exports.right++
    console.log('OK')
  } catch (err) {
    console.log(err.stack)
    console.log(`Test ${type} : KO`)
    // console.log(err)
    exports.error++
  }
}