export function changeObjectMaptoArray(inObject) {
  let outObject, value, key

  outObject = {}

  for (key in inObject) {
    if(inObject[key] instanceof Map)
      value = Array.from(inObject[key])
    else  
      value = inObject[key]
    outObject[key] = value
  }
  return outObject
}


/**
 * Renvoi la copie d'un objet complet et non de sa référence
 * @param {object | Array} inObject : objet à copier
 */
export function deepCopy(inObject) {
  let outObject, value, key

  if ((typeof inObject !== "object" || inObject instanceof Date) || inObject === null) {
    return inObject
  }
  outObject = Array.isArray(inObject) ? [] : {}
  
  for (key in inObject) {
    value = inObject[key]
    outObject[key] = deepCopy(value)
  }
  
  return outObject
}