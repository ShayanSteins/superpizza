import Vue from 'vue'
import App from './App.vue'

let monPlugin = {
  menuPizzas1: null
}

monPlugin.install = function (Vue, options) {
  Vue.prototype.$menuPizzasSave = function (menu) {
    monPlugin.menuPizzas1 = menu
  }
  Vue.prototype.$getPizzaPrice = function (idPizza) {
    if (monPlugin.menuPizzas1 !== null) {
      const pizz = monPlugin.menuPizzas1.find(p => p.idPizza === idPizza)
      if (pizz !== undefined)
        return pizz.price
    }
    return 0
  }
  Vue.prototype.$getPizzaName = function (idPizza) {
    if (monPlugin.menuPizzas1 !== null) {
      const pizz = monPlugin.menuPizzas1.find(p => p.idPizza === idPizza)
      if (pizz !== undefined)
        return pizz.name
    }
    return 0
  }
}

Vue.use(monPlugin)

new Vue({
  render: h => h(App)
}).$mount('#app')