<template>
  <div>
    <header>
      <div id="headerTitle">Super Pizza</div>
    </header>
    <div class="loading" v-if="loading">
      Chargement...
    </div>
    <div class="content">
      <div id="cartIcon"><img :src="getShoppingCart()"></div>
      <div v-if="pizzas">
        <div v-for="pizza in pizzas" :key="pizza.id" class="pizzaContainer">
          <div class="pizzaTitle">{{pizza.name}}</div>
          <div class="pizzaContent">
            <div class="pizzaImg">
              <img :src="imagePath(pizza.img)" :alt="pizza.name">
            </div>
            <div class="pizzaNoImg">
              <span class="pizzaDesc">{{pizza.description}}</span>
              <input type="number">
              <span class="pizzaPrice">{{ pizza.price }} €</span>
            </div>
          </div>
          
        </div>
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
const ws = new WebSocket('ws://' + document.location.host)
import images from './assets/img/*.jpeg'
import shoppingCart from './assets/shopping_cart.svg'


export default {
  name: 'App',
  data() {
    return {
      loading: false,
      pizzas: null,
      inputText: ''
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
      ws.onopen = function () {
        ws.send('getMenu')
      }
      ws.onmessage = (msg) => {
        this.loading = false
        this.pizzas = JSON.parse(msg.data)
      }
    },
    imagePath(fileName) {
      return images[fileName]
    },
    getShoppingCart() {
      return shoppingCart
    }
    // addPizz() {
    //   // console.log('pizza ajoutée')
    //   this.pizzas.push(this.inputText)
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

.content {
  padding: 0.5rem;
}
#cartIcon {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.3rem;
}
#cartIcon > img {
  right: 0;
  text-align: right;
  padding: 0.1rem;
  border: 1px solid var(--main-grey-color);
  border-radius: 20%;
}
#cartIcon > img:hover {
  cursor: pointer;
  border-color: var(--main-red-color);
}

.pizzaTitle {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: var(--main-red-color);
  color: var(--main-bg-color);
  margin-bottom: 0.2rem;
  padding: 0.3rem;
}
.pizzaContent {
  display: flex;
}
.pizzaNoImg {
  padding: 0 0 0 0.5rem;
}
.pizzaImg {
  width: 40rem;
}
.pizzaImg img {
  width: 100%;
}
</style>