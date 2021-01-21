const Runner = require('./runner.js')
const TimeManagerTest = require('./server/assets/timemanager_test.js')


let tm = new TimeManagerTest()
const datas = [{ hour: '12:00', used: 0 }, { hour: '12:10', used: 0 }]
tm.init(datas)

console.log('Test OK : ' + Runner.right)
console.log('Test KO : ' + Runner.error)
