const assert = require('assert').strict

exports.right = 0
exports.error = 0

exports.run = (type, content, optionnal) => {
  const test = assert[type]
  try {
    test(content, optionnal)
    exports.right++
    process.stdout.write('OK ')
  } catch (err) {
    if (optionnal && process.env.silent !== "1") 
      console.log(`!!! Test Failed : ${type} entre ${JSON.stringify(content)} et ${JSON.stringify(optionnal)}`)
    console.log(err.stack)
    exports.error++
  }
}
