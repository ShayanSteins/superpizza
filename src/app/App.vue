<template>
  <div>
    <header class="shadow">
      <div id="headerTitle" class="bold">Super Pizza</div>
    </header>
    <div class="loading" v-if="loading">
      Chargement...
    </div>

    <ShoppingCart 
      id="shoppingCartDiv" 
      :class="{active : isShoppingDisplayed}" 
      :order="order" 
      @close="closeShoppingCart">
    </ShoppingCart>

    <div id="content" :class="{active : !isShoppingDisplayed}" >
      <div id="cartIcon">
        <span class="italic small">Notre plateforme vous propose des pizzas de choix à emporter uniquement. Le paiement se fera lors du retrait de la commande.</span>
        <img :src="getShoppingCart()" class="buttonImg shadow rounded" title="Panier" @click="openShoppingCart"> 
      </div>

      <div v-if="menuPizzas">
        <PizzaDisplayer v-for="pizza in menuPizzas" :pizza="pizza" :key="pizza.idPizza" @add-pizza="addPizza"></PizzaDisplayer>
      </div>
    </div>

   

    <!-- <div>
      <input type="text" v-model="inputText" />
      <button @click="addPizz">Add</button>
    </div>
    <span>Listes des pizzas : {{ pizzas.toString() }}</span>
  </div> -->
</template>

<script>
// const ws = new WebSocket('ws://' + document.location.host)
import shoppingCartIcon from './assets/shopping_cart.svg'
import PizzaDisplayer from './components/PizzaDisplayer.vue'
import ShoppingCart from './components/ShoppingCart.vue'
// import { setMenuPizzasSave } from './common.js'


export default {
  name: 'App',
  components: {
    PizzaDisplayer, ShoppingCart
  },
  data() {
    return {
      loading: false,
      isShoppingDisplayed: false,
      menuPizzas: null,
      order: {
        pizzas: new Map(),
        totalPrice: 0.00,
        lastName: 'ted',
        firstName: 'ted',
        phone: '00.00.00.00.00',
        timeSlot: '18:10'
      }
      // order: {
      //   pizzas: new Map([[1, 3], [4, 1], [5, 1]]),
      //   totalPrice: 0.00
      // }
    }
  },
  computed: {

  },
  created() {
    this.getMenu()
  },
  methods: {
    getMenu() {
      this.loading = true
      fetch('/initCli').then((response) => {
        return response.json()
      }).then((datas) => {
        this.loading = false
        this.menuPizzas = datas
        this.$menuPizzasSave(datas)
      }).catch((err) => {
        throw err
      })
    },
    addPizza([idPizz, qty]) {
      if (this.order.pizzas.has(idPizz))
        qty = Number(this.order.pizzas.get(idPizz)) + Number(qty)
      this.order.pizzas.set(idPizz, qty)
      this.calculateTotalOrderPrice()
    },
    calculateTotalOrderPrice() {
      this.order.totalPrice = 0
      for (const line of this.order.pizzas) {
        this.order.totalPrice = Number(this.order.totalPrice) + Number(line[1]) * Number(this.$getPizzaPrice(line[0]))
      }
    },
    openShoppingCart() {
      this.isShoppingDisplayed = true
    },
    closeShoppingCart() {
      this.isShoppingDisplayed = false
    },
    getShoppingCart() {
      return shoppingCartIcon
    }
    // addPizz() {
    //   // console.log('pizza ajoutée')
    //   this.menuPizzas.push(this.inputText)
    //   ws.send(this.inputText)
    //   ws.onmessage = function (msg) {
    //     console.log('message reçu : ' + msg.data)
    //   }
    //   this.inputText = ''
    // }
  }
}
</script>

<style>
:root {
  --main-bg-color: rgb(248, 248, 248);
  --main-green-color: rgb(0 144 69);
  --main-red-color: rgb(208 44 55);
  --main-grey-color: rgb(41 41 41);
  --shadow-element: 2px 2px 4px rgb(21 21 21 / 78%);
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  font: 1.2rem Helvetica, Arial, sans-serif;
  background-color: var(--main-bg-color);
}
header {
  background-color: var(--main-green-color);
  font-size: 2rem;
  padding: 0.5rem 0;
}
#headerTitle {
  font-family: fantasy;
  text-align: center;
}

.italic {
  font-style: italic;
}
.bold {
  font-weight: bold;
}
.small {
  font-size: 0.8rem;
}
.buttonImg {
  padding: 0.2rem;
  border: 1px solid var(--main-grey-color);
}
.shadow {
  box-shadow: var(--shadow-element);
}
.rounded {
  border-radius: 3px;
}

#shoppingCartDiv {
  display: none;
}
#shoppingCartDiv.active {
  display: block;
}

#content {
  display: none;
  padding: 0.5rem;
}
#content.active {
  display: block;
}
#cartIcon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}
#cartIcon > img {
  right: 0;
  margin-left: 0.4rem;
  background-color: var(--main-green-color);
}
#cartIcon > img:hover {
  cursor: pointer;
  border-color: var(--main-red-color);
  filter: brightness(0.5);
}
</style>