export let Store = {
  menuPizzas: null,
  ws: null

}

Store.initWS = function () {
  Store.ws = new WebSocket('ws://' + document.location.host)
}

Store.install = function (Vue, options) {
  Vue.prototype.$ws = Store.ws

  Vue.prototype.$menuPizzasSave = function (menu) {
    Store.menuPizzas = menu
  }
  Vue.prototype.$getPizzaPrice = function (idPizza) {
    if (Store.menuPizzas !== null) {
      const pizz = Store.menuPizzas.find(p => p.idPizza === idPizza)
      if (pizz !== undefined)
        return pizz.price
    }
    return 0
  }
  Vue.prototype.$getPizzaName = function (idPizza) {
    if (Store.menuPizzas !== null) {
      const pizz = Store.menuPizzas.find(p => p.idPizza === idPizza)
      if (pizz !== undefined)
        return pizz.name
    }
    return 0
  }

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

  Vue.prototype.$countTotalOfMap = function (actualTotal, mapObj, price) {
    actualTotal = 0
    for (const [id, qty] of mapObj) {
      if (price)
        actualTotal = Number(actualTotal) + Number(qty) * Number(Vue.prototype.$getPizzaPrice(id))
      else
        actualTotal = Number(actualTotal) + Number(qty)
    }
    return actualTotal
  }
}