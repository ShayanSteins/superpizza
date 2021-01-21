const assert = require('assert').strict

exports.right = 0
exports.error = 0

exports.run = (type, content, optionnal) => {
  const test = assert[type]
  try {
    test(content, optionnal)
    exports.right++
  } catch (err) {
    console.log(err)
    exports.error++
  }
}