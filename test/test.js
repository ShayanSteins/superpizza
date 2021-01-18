const assert = require('assert').strict
const TimeManager = require('../src/server/timemanager.js')

let right = 0
let error = 0

const tmTest = new TimeManager()

run('ok', (tmTest instanceof TimeManager))
run('ok', (tmTest.timeslots instanceof Map))
run('equal', tmTest.timeslots.size, 0)
run('ok', Array.isArray(tmTest.pile))
run('equal', tmTest.pile.length, 0)

console.log('Test OK : ' + right)
console.log('Test KO : ' + error)

function run(type, content, optionnal) {
  const test = assert[type]
  try {
    test(content, optionnal)
    right++
  } catch (err) {
    console.log(err)
    error++
  }
}