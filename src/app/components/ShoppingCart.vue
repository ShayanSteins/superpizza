<template>
  <div id="main">
    <div id="title">
      <span>Panier</span>
      <button @click="$emit('close')">X</button>
    </div>

    <div v-if="order.totalPrice > 0">
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

      <div>Choix de l'heure</div>

      <br /><br /><br />
      <div>******************************************</div>
      <br /><br /><br />

      <div>Formulaire infos persos</div>
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