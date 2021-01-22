const fs = require('fs')
const path = require('path')
const dirTest = './test/server/'
const Runner = require('./runner.js')



let filesName = getAllFiles(dirTest)

for (const file of filesName) {
  execFunctions(file)
}

console.log('Total test passés : ' + (Runner.right + Runner.error))
console.log('Test OK : ' + Runner.right)
console.log('Test KO : ' + Runner.error)



function getAllFiles(dir) {
  let allFiles = []
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory())
      allFiles.push(...getAllFiles(dir + file.name + '/'))
    else
      allFiles.push(dir + file.name)
  }
  return allFiles
}

function execFunctions(file) {
  const obj = require(path.resolve(file))
  const methods = Object.getOwnPropertyNames(obj).filter(name => name.match(/Test$/) !== null)

  if (typeof obj.tearsUp === 'function') obj.tearsUp()
  for (const method of methods) {
    console.log(`Exécution de ${obj.name} pour ${method}`)
    obj[method]()
  }
  if (typeof obj.tearsDown === 'function') obj.tearsDown()
}
