const crypto = require('crypto')

/**
 * Fonction d'hachage de mot de passe. Retourne un objet contenant le salt de génération et le mdp haché
 * @param {String} password
 * @param {String} salt
 */
const hasher = (password, salt = null) => {
  if (salt === null)
    salt = crypto.randomBytes(Math.ceil(12 / 2)).toString('hex').slice(0, 12)
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  const value = hash.digest('hex')
  return {
    salt: salt,
    hashedPassword: value
  }
}

/**
 * Compare le password et le username donné à ceux attendu
 * @param {String} password
 * @param {String} username
 */
const compare = (password = null, username = null, hash = null) => {
  if (password === null || username === null || hash === null)
    throw new Error('Un mot de passe et un nom d\'utilisateur sont requis.')
  if (typeof password !== 'string' || typeof username !== 'string' || typeof hash !== 'object' )
    throw new Error('Le mot de passe et le nom d\'utilisateur doivent être des string.')
  const passwordData = hasher(password, hash.salt)
  if (passwordData.hashedPassword === hash.hashedPassword && username === hash.username)
    return true
  return false
}

module.exports = {
  hasher,
  compare
}