const { run } = require('../../runner.js')
const TimeManager = require('../../../server/assets/timemanager.js')

class TimeManagerTest {
  constructor() {
    this.tmTest = new TimeManager()

    run('ok', (this.tmTest instanceof TimeManager))
    run('ok', (this.tmTest.timeslots instanceof Map))
    run('equal', this.tmTest.timeslots.size, 0)
    run('ok', Array.isArray(this.tmTest.pile))
    run('equal', this.tmTest.pile.length, 0)
  }

  init(datas) {
    this.tmTest.init(datas)

    run('equal', this.tmTest.timeslots.size, datas.length)
    run('equal', this.tmTest.pile.length, datas.length)
  }

}

module.exports = TimeManagerTest