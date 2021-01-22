export let Store = {
  menuPizzas: null,
  ws: null
}

/**
 * Initialisation du WebSocket
 */
Store.initWS = function () {
  let proto = (document.location.protocol === "https:") ? "wss://" : "ws://"
  Store.ws = new WebSocket(proto + document.location.host)
}

/**
 * Enregistrement du Plugin et de ses méthodes
 * @param {Vue} Vue : instance de Vue 
 * @param {Array} options 
 */
Store.install = function (Vue, options) {
  Vue.prototype.$ws = Store.ws

  /**
   * Mise à jour du menu des pizas
   * @param {Array} menu 
   */
  Vue.prototype.$menuPizzasSave = function (menu) {
    Store.menuPizzas = menu
  }

  /**
   * Récupère la valeur d'un attribut d'une pizza donnée
   * @param {Number} idPizza : identifiant de la pizza
   * @param {String} something : nom de l'attribut désirée (ex : price, name, ...)
   */
  Vue.prototype.$getPizzaInfos = function (idPizza, something) {
    if (Store.menuPizzas !== null) {
      const pizz = Store.menuPizzas.find(p => p.idPizza === idPizza)
      if (pizz !== undefined)
        return pizz[something]
    }
    return 0
  }

  /**
   * Formate les Map contenu dans un Objet en Array
   * @param {Object} inObject : contenant une ou plusieurs Map
   * @returns {Object} contenant un ou plusieurs Array
   */
  Vue.prototype.$changeObjectMaptoArray = function (inObject) {
    let outObject, value, key
    outObject = {}

    for (key in inObject) {
      if (inObject[key] instanceof Map)
        value = Array.from(inObject[key])
      else
        value = inObject[key]
      outObject[key] = value
    }
    return outObject
  }

  /**
   * Calcule la quantité ou le prix total d'une commande
   * @param {Map} mapObj : Map de l'ensemble des pizzas pour une commande
   * @param {Boolean} price : True, pour obtenir le prix total, false pour obtenir la quantité totale
   */
  Vue.prototype.$countTotalOfMap = function (mapObj, price) {
    let total = 0
    for (const [id, qty] of mapObj) {
      if (price)
        total = Number(total) + Number(qty) * Number(Vue.prototype.$getPizzaInfos(id, 'price'))
      else
        total = Number(total) + Number(qty)
    }
    return total
  }
}