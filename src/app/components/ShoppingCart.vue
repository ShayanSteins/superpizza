<template>
  <div>
    <div id="title">
      <span class="bold">Panier</span>
      <button id="closeShoppingCart" class="shadow border" @click="$emit('close')">X</button>
    </div>

    <div v-if="popinDisplayed" class="center">
      <span>Merci pour votre commande, elle a été transmise à nos Pizzaïolos de
      compétition !</span><br>
      <button @click="closePopin">Ok</button>
    </div>

    <div v-if="order.totalPrice > 0" id="fullCart">
      <form @submit.prevent="checkForm">
        <div id="cart" class="border rounded">
          <LineCart
            v-for="[idPizza, qty] of pizzas"
            :line="{ id: idPizza, qty: qty }"
            :key="idPizza"
            :unitPrice="$getPizzaInfos(idPizza, 'price')"
            @change="updateOrderQty"
          ></LineCart>
          <div id="cartTotal" class="bold">
            <span>TOTAL</span>
            <span>{{ order.totalPrice }} €</span>
          </div>
        </div>

        <div class="separator center">-------------------------</div>

        <div>
          <span>Veuillez choisir l'heure de retrait : </span>
          <div class="center">
            <select v-model="order.timeSlot" id="selectHour" required>
              <option disabled value="">...</option>
              <option v-for="opt in timeSlotsAvailable" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
            <div v-if="timeSlotsAvailable.length == 0" class="error italic small">Veuillez nous excuser, il semble qu'il n'y ai pas de créneau possible pour votre commande. Veuillez tenter avec moins de pizzas, ou demain ヽ(*⌒▽⌒*)ﾉ</div>
          </div>
        </div>

        <div class="separator center">-------------------------</div>

        <div id="customersInfos">
          <span class="subtitle bold">Vos informations</span>
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
            placeholder="Téléphone : 00.00.00.00.00"
            required
          />
        </div>
        <div class="center">
          <button id="validBtn" class="bold shadow">Valider</button>
        </div>
      </form>
    </div>
    <div v-else id="emptyCart" class="center">Votre panier est vide.</div>
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
      timeSlotsAvailable: [],
      popinDisplayed: false
    }
  },
  props: {
    order: {
      type: Object
    }
  },
  watch: {
    order: {
      deep: true,
      handler(order) {
        this.pizzas = order.pizzas
      }
    }
  },
  methods: {
    updateOrderQty(idPizz, qty) {
      this.order.pizzas.set(idPizz, qty)
      this.updateTotalOrderPrice()
      this.$ws.send(JSON.stringify({ "head": "getTimeSlots", "datas": this.order.totalQty }))
    },
    updateTotalOrderPrice() {
      this.order.totalPrice = this.$countTotalOfMap(this.order.pizzas, true)
      this.order.totalQty = this.$countTotalOfMap(this.order.pizzas, false)
    },
    checkForm(e) {
      if (this.order.totalPrice > 0) {
        this.$ws.send(JSON.stringify({ "head": "newOrder", "datas": this.$changeObjectMaptoArray(this.order) }))
        this.popinDisplayed = true
        this.$emit('reset')
      }
    },
    getTimeSlots() {
      // Lors de la connexion au WS
      this.$ws.onopen = () => {
        this.$ws.send(JSON.stringify({ "head": "getTimeSlots" }))
      }
      // Traitement des messages reçus
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
    },
    closePopin() {
      this.popinDisplayed = false
    }
  }
}
</script>

<style scoped>
#main {
  padding: 0.5rem;
}
#title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

#closeShoppingCart {
  border-radius: 56%;
  background-color: var(--light-white-color);
  padding: 0.2rem 0.5rem;
}
#closeShoppingCart:hover {
  color: var(--main-grey-color);
}

.error {
  color: var(--main-red-color);
}

#emptyCart {
  margin: 4rem 0;
}

#cartTotal {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
  background-color: var(--light-grey-color);
  color: var(--main-bg-color);
}

.separator {
  margin: 2rem 0;
  font-family: monospace;
}

#selectHour {
  width: 35%;
  margin: 0.5rem 0rem;
  font-size: 1.2rem;
}

#customersInfos {
  display: flex;
  flex-direction: column;
}
.subtitle {
  margin-bottom: 0.5rem;
}
#customersInfos > input {
  margin: 0.3rem 1.8rem;
  height: 1.5rem;
  font-size: 1.1rem;
}

#validBtn {
  margin-top: 1.5rem;
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  background-color: var(--main-red-color);
  color: var(--main-bg-color);
}

@media screen and (min-width: 700px) {
  #closeShoppingCart {
    display: none;
  }
}
</style>