const assert = require('assert').strict

exports.right = 0
exports.error = 0

exports.run = (type, content, optionnal) => {
  const test = assert[type]
  if(optionnal)
    console.log(`Test ${type} entre ${JSON.stringify(Array.from(content))} et ${JSON.stringify(Array.from(optionnal))}`)
  try {
    test(content, optionnal)
    exports.right++
    console.log('OK')
  } catch (err) {
    console.log('KO')
    // console.log(err)
    exports.error++
  }
}