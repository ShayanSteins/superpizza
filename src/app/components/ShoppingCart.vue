<template>
  <div id="main">
    <div id="title">
      <span>Panier</span>
      <button @click="$emit('close')">X</button>
    </div>

    <div v-if="order.totalPrice > 0">
      <form @submit="checkForm">
        <LineCart
          v-for="[idPizza, qty] of pizzas"
          :line="{ id: idPizza, qty: qty }"
          :key="idPizza"
          :unitPrice="$getPizzaPrice(idPizza)"
          @change="updateOrderQty"
        ></LineCart>
        <div>
          <span>TOTAL</span>
          <span>{{ order.totalPrice }} €</span>
        </div>

        <br /><br /><br />
        <div>******************************************</div>
        <br /><br /><br />

        <div>
          <span>Veuillez choisir l'heure de retrait : </span>
          <select v-model="order.timeSlot">
            <option disabled value="">...</option>
            <option>18:10</option>
            <option>18:20</option>
            <option>18:30</option>
            <option>18:40</option>
            <option>18:50</option>
            <option>19:00</option>
          </select>
        </div>

        <br /><br /><br />
        <div>******************************************</div>
        <br /><br /><br />

        <div>
          <span>Vos informations</span>
          <input type="text" minlength="3" maxlength="30" v-model="order.lastName" placeholder="Nom" required />
          <input type="text" minlength="3" maxlength="30" v-model="order.firstName"  placeholder="Prénom" required />
          <input
            type="text"
            v-model="order.phone"
            pattern="[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}"
            placeholder="00.00.00.00.00"
            required
          />
        </div>
        <button>Valider</button>
      </form>
    </div>
    <div v-else>Votre panier est vide.</div>
  </div>
</template>

<script>
import LineCart from './LineCart.vue'
import { changeObjectMaptoArray } from '../utils.js'
const ws = new WebSocket('ws://' + document.location.host)

export default {
  name: 'ShoppingCart',
  components: {
    LineCart
  },
  created() {
    this.updateTotalOrderPrice()
  },
  data() {
    return {
      pizzas: this.order.pizzas
    }
  },
  props: {
    order: {
      type: Object
    }
  },
  methods: {
    updateOrderQty(idPizz, qty) {
      this.order.pizzas.set(idPizz, qty)
      this.updateTotalOrderPrice()
    },
    updateTotalOrderPrice() {
      this.order.totalPrice = 0
      for (const line of this.order.pizzas) {
        this.order.totalPrice = Number(this.order.totalPrice) + Number(line[1]) * Number(this.$getPizzaPrice(line[0]))
      }
    },
    checkForm(e) {
      e.preventDefault()
      ws.send(JSON.stringify({ "head": "newOrder","datas": changeObjectMaptoArray(this.order)}))
    }
  }
}
</script>

<style scoped>
#title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>