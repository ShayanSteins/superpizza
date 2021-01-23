<template>
  <div>
    <header class="shadow">
      <div id="headerTitle" class="bold">Super Pizza</div>
    </header>

    <div id="body">
      <div class="loading" v-if="loading">Chargement...</div>

      <div id="content" :class="{ active: !isShoppingDisplayed }">
        <div id="cartIcon">
          <span class="italic small"
            >Notre plateforme vous propose des pizzas de choix à emporter
            uniquement. Le paiement se fera lors du retrait de la
            commande.</span
          >
          <img
            :src="getShoppingCart()"
            class="buttonImg shadow rounded border"
            title="Panier"
            @click="openShoppingCart"
          />
        </div>

        <div id="menu" v-if="menuPizzas">
          <PizzaDisplayer
            v-for="pizza in menuPizzas"
            :pizza="pizza"
            :key="pizza.idPizza"
            @add-pizza="addPizza"
          ></PizzaDisplayer>
        </div>
      </div>

      <ShoppingCart
        id="shoppingCartDiv"
        :class="{ active: isShoppingDisplayed }"
        :order="order"
        @close="closeShoppingCart"
        @reset="initEmptyOrder"
      >
      </ShoppingCart>
    </div>
    <footer class="center">Pizza(s) ajoutée(s)</footer>
  </div>
</template>

<script>
import shoppingCartIcon from '../assets/img/shopping_cart.svg'
import PizzaDisplayer from './components/PizzaDisplayer.vue'
import ShoppingCart from './components/ShoppingCart.vue'


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
      order: {}
    }
  },
  created() {
    this.getMenu()
    this.initEmptyOrder()
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
      this.calculateTotals()
      this.$ws.send(JSON.stringify({ "head": "getTimeSlots", "datas": this.order.totalQty }))
      this.cssTransition()
    },
    cssTransition() {
      let addingMessage = document.querySelector('footer')
      addingMessage.classList.add('move')
      setTimeout(() => addingMessage.classList.remove('move'), 2000)
    },
    calculateTotals() {
      this.order.totalPrice = this.$countTotalOfMap(this.order.pizzas, true)
      this.order.totalQty = this.$countTotalOfMap(this.order.pizzas, false)
    },
    openShoppingCart() {
      this.isShoppingDisplayed = true
    },
    closeShoppingCart() {
      this.isShoppingDisplayed = false
    },
    getShoppingCart() {
      return shoppingCartIcon
    },
    initEmptyOrder() {
      this.order = {
        pizzas: new Map(),
        totalPrice: 0.00,
        totalQty: 0,
        lastName: '',
        firstName: '',
        phone: '',
        timeSlot: ''
      }
    }
  }
}
</script>

<style>
:root {
  --main-bg-color: rgb(248, 248, 248);
  --light-white-color: rgb(222, 222, 222);
  --main-green-color: rgb(0 144 69);
  --main-red-color: rgb(208 44 55);
  --main-grey-color: rgb(41 41 41);
  --light-grey-color: rgb(64 64 64);
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
footer {
  position: fixed;
  width: 100%;
  height: 50px;
  left: 0;
  bottom: calc(-50px - 0.6rem);
  background-color: var(--main-red-color);
  color: var(--main-bg-color);
  transition-property: bottom;
  transition-duration: 0.5s, 1s;
  -webkit-transition-property: bottom;
  -webkit-transition-duration: 0.5s, 1s;
  padding: 0.3rem 0.5rem;
}
footer.move {
  bottom: 0px !important;
}
button {
  border: none;
  background-color: var(--main-green-color);
  padding: 0.3rem 0.5rem;
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
.shadow {
  box-shadow: var(--shadow-element);
}
.rounded {
  border-radius: 3px;
}
.border {
  border: 1px solid var(--main-grey-color);
}
.center {
  text-align: center;
}

#shoppingCartDiv {
  display: none;
  padding: 0.5rem;
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
  padding: 0.2rem;
  background-color: var(--main-green-color);
}
#cartIcon > img:hover,
button:hover {
  filter: brightness(1.2);
  cursor: pointer;
  color: var(--light-white-color);
}

@media screen and (min-width: 700px) {
  #body {
    display: flex;
  }

  #cartIcon > span {
    font-size: 1rem;
  }

  .buttonImg {
    display: none;
  }

  #content {
    padding: 0.5rem 0rem 0.5rem 0.5rem;
  }
  #content.active {
    width: 70%;
  }

  #menu {
    display: flex;
    flex-wrap: wrap;
  }

  #shoppingCartDiv {
    display: block;
    width: 30%;
    border-left: 1px solid var(--main-grey-color);
  }
}
</style>