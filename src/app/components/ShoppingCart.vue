<template>
  <div id="main">
    <div id="title">
      <span>Panier</span>
      <button id="closeShoppingCart" @click="$emit('close')">X</button>
    </div>

    <div v-if="order.totalPrice > 0">
      <form @submit.prevent="checkForm">
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
            <option v-for="opt in timeSlotsAvailable" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>

        <br /><br /><br />
        <div>******************************************</div>
        <br /><br /><br />

        <div>
          <span>Vos informations</span>
          <input
            type="text"
            minlength="3"
            maxlength="30"
            v-model="order.lastName"
            placeholder="Nom"
            required
          />
          <input
            type="text"
            minlength="3"
            maxlength="30"
            v-model="order.firstName"
            placeholder="Prénom"
            required
          />
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

export default {
  name: 'ShoppingCart',
  components: {
    LineCart
  },
  created() {
    this.updateTotalOrderPrice()
    this.getTimeSlots()
  },
  data() {
    return {
      pizzas: this.order.pizzas,
      timeSlotsAvailable: []
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
      this.$ws.send(JSON.stringify({ "head": "getTimeSlots", "datas": this.order.totalQty }))
    },
    updateTotalOrderPrice() {
      this.order.totalPrice = this.$countTotalOfMap(this.order.totalPrice, this.order.pizzas, true)
      this.order.totalQty = this.$countTotalOfMap(this.order.totalPrice, this.order.pizzas, false)
    },
    checkForm(e) {
      if(this.order.totalPrice > 0)
        this.$ws.send(JSON.stringify({ "head": "newOrder", "datas": this.$changeObjectMaptoArray(this.order) }))
    },
    getTimeSlots() {
      this.$ws.onopen = () => {
        this.$ws.send(JSON.stringify({ "head": "getTimeSlots" }))
      }
      this.$ws.onmessage = (msg) => {
        msg = JSON.parse(msg.data)
        switch (msg.head) {
          case 'updateSlots':
            this.timeSlotsAvailable = msg.datas
            break;

          case 'updateSlotsRequired':
            this.$ws.send(JSON.stringify({ "head": "getTimeSlots", "datas": this.order.totalQty }))
            break;
        
          default:
            break;
        }
      }
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
@media screen and (min-width: 700px) {
  #closeShoppingCart {
    display: none;
  }
}
</style>