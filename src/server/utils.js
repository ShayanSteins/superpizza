'use strict'

let crypto = require('crypto')

let hasher = (password, salt) => {
  let hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  let value = hash.digest('hex')
  return {
    salt: salt,
    hashedpassword: value
  }
}

let compare = (password, username) => {
  let hash = {
    salt: '4d803ff8ddc4',
    hashedpassword: 'c4a3d9996e0c9d264f0b3ee5ba61707fdac09857c915dd0f97f221bc565f9d431c6876eb03cfb88ea5bd389de86296911204ea6112f972dab46b564ab517938f'
  }
  if (password == null || username == null) {
    throw new Error(`Un mot de passe et un nom d'utilisateur sont requis`)
  }
  if (typeof password !== 'string' || typeof username !== 'string') {
    throw new Error(`Le mot de passe et le nom d'utilisateur doivent être des String`)
  }
  let passwordData = hasher(password, hash.salt)
  if (passwordData.hashedpassword === hash.hashedpassword && username === 'admin') {
    return true
  }
  return false
}

module.exports = {
  compare
}