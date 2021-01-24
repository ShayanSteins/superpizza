const fs = require('fs')
const path = require('path')
const dirTest = './tests/server/'
const Runner = require('./runner.js')

const filesName = getAllFiles(dirTest)

runAll()

async function runAll () {
  for (const file of filesName) {
    await execFunctions(file)
  }
  
  console.log('Total test passés : ' + (Runner.right + Runner.error))
  console.log('Test OK : ' + Runner.right)
  console.log('Test KO : ' + Runner.error)
}

function getAllFiles (dir) {
  const allFiles = []
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory())
      allFiles.push(...getAllFiles(dir + file.name + '/'))
    else
      allFiles.push(dir + file.name)
  }
  return allFiles
}

async function execFunctions (file) {
  const obj = require(path.resolve(file))
  const methods = Object.getOwnPropertyNames(obj).filter(name => name.match(/Test$/) !== null)
  console.log('************************************************************************')
  console.log(`Execution des tests pour la classe : ${obj.name}`)
  console.log('************************************************************************')
  if (typeof obj.tearsUp === 'function') obj.tearsUp()
  for (const method of methods) {
    console.log(`=> Fonction ${method}`)
    await obj[method]()
    console.log('')
  }
  if (typeof obj.tearsDown === 'function') obj.tearsDown()
}
