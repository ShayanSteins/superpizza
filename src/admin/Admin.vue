<template>
  <div>
    <header class="shadow">
      <div id="headerTitle" class="bold center">Super Pizza</div>
    </header>

    <div id="body">
      <form @submit.prevent="login" v-if="!isLogged" class="loginDiv">
        <input type="text" v-model="id" placeholder="Identifiant" required />
        <input type="password" v-model="pwd" placeholder="Password" required />
        <button>Connexion</button>
      </form>
      <span>{{ errorMsg }}</span>

      <div v-if="isLogged">
        <div class="title bold"><span>Commandes à traiter</span></div>
        <div v-if="orders.length === 0" class="center">
          <span>Pas encore de commande pour ce soir... Veuillez patienter =)</span>
        </div>
        <OrderDisplayer
          v-for="o in orders"
          :key="o.idOrder"
          :order="o"
          class="orderDisplayer border rounded"
          :class="{ disable: o.state }"
        ></OrderDisplayer>
      </div>
    </div>
  </div>
</template>

<script>
import OrderDisplayer from './components/OrderDisplayer.vue'

export default {
  name: 'Admin',
  components: {
    OrderDisplayer
  },
  data() {
    return {
      isLogged: false,
      errorMsg: '',
      id: '',
      pwd: '',
      orders: []
    }
  },
  created() {
    if (localStorage.getItem('logged') !== null)
      this.isLogged = localStorage.getItem('logged')

    this.$ws.onopen = () => {
      this.$ws.send(JSON.stringify({ "head": "getOrders" }))
    }

    this.$ws.onmessage = (msg) => {
      let response = JSON.parse(msg.data)

      switch (response.head) {
        case 'updateOrders':
          this.refreshOrders(response.datas)
          break
        case 'updateSlotsRequired': {
          this.$ws.send(JSON.stringify({ "head": "getOrders" }))
          break
        }
        case 'updateState':
          try {
            let odr = this.orders.find(o => o.idOrder == response.datas.idOrder)
            if (odr !== undefined)
              odr.state = response.datas.state
          } catch (error) {
            throw error
          }
          break
        default:
          break
      }
    }
  },
  methods: {
    login(e) {
      fetch('/login', {
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Basic ' + btoa(`${this.id}:${this.pwd}`)
        }
      }).then((response) => {
        return response.json()
      }).then((datas) => {
        if (datas === 'OK') {
          this.isLogged = true
          this.errorMsg = ''
          localStorage.setItem('logged', true)
        }
        else {
          this.errorMsg = datas
        }
      }).catch((err) => {
        throw err
      })
    },
    refreshOrders(datas) {
      this.orders = []
      for (const line of datas) {
        this.orders.push({
          idOrder: line.idOrder,
          lastName: line.lastName,
          firstName: line.firstName,
          phone: line.phone,
          state: line.state,
          totalPrice: line.price,
          timeSlot: line.timeSlot,
          pizzas: line.pizzas
        })
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
}

.italic {
  font-style: italic;
}
.bold {
  font-weight: bold;
}
.rounded {
  border-radius: 3px;
}
.border {
  border: 1px solid var(--main-grey-color);
}
.title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}
.center {
  text-align: center;
}

#body {
  padding: 0.5rem;
}

.loginDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
.loginDiv > input {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}
button {
  font-size: 1.2rem;
  border: none;
  background-color: var(--main-green-color);
  margin-top: 1rem;
  padding: 0.3rem 0.5rem;
}
button:hover {
  filter: brightness(1.2);
  cursor: pointer;
  color: var(--light-white-color);
}

.orderDisplayer {
  margin-top: 0.5rem;
  padding: 0.2rem 0.5rem;
  border: 2px solid var(--main-red-color);
}
.disable {
  border: 2px solid var(--light-grey-color);
  background-color: var(--light-white-color);
  filter: opacity(0.5);
}

@media screen and (min-width: 600px) {
  .orderDisplayer {
    width: 60%;
  }
}
</style>