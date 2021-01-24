<template>
  <div class="main">
    <div class="pizzaTitle rounded bold">
      <span>{{ pizza.name }}</span>
      <span class="pizzaPrice">{{ pizza.price }} €</span>
    </div>
    <div class="pizzaContent">
      <div class="pizzaImg">
        <img :src="imagePath(pizza.img)" :title="pizza.name" />
      </div>
      <div class="pizzaNoImg">
        <span class="pizzaDesc">{{ pizza.description }}</span>
        <div class="pizzaAddForm">
          <input
            type="number"
            min="0"
            max="30"
            v-model.number="qty"
            @input="checkQtyFormat"
          />
          <button class="bold"
            @click="$emit('add-pizza', [pizza.idPizza, qty])"
            :disabled="isIncorrectFormat"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import images from '../../assets/img/*.jpeg'

export default {
  name: 'PizzaDisplayer',
  data() {
    return {
      qty: 1,
      isIncorrectFormat: false
    }
  },
  props: {
    'pizza': {
      type: Object
    }
  },
  methods: {
    checkQtyFormat() {
      this.isIncorrectFormat = this.qty === '' || this.qty < 0 || 30 < this.qty
    },
    imagePath(fileName) {
      return images[fileName]
    }
  }
}
</script>

<style scoped>
.pizzaTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  background-color: var(--main-red-color);
  color: var(--main-bg-color);
  margin-bottom: 0.2rem;
  padding: 0.3rem;
}
.pizzaPrice {
  font-size: 1.2rem;
}

.pizzaContent {
  display: flex;
  margin-bottom: 0.5rem;
}
.pizzaNoImg {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 0.3rem 0.5rem;
}
.pizzaImg {
  width: 40rem;
}
.pizzaImg img {
  width: 100%;
}

.pizzaAddForm {
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}



@media screen and (min-width: 700px) {
  .main {
    max-width: calc(50% - 0.5rem);
    padding-right: 0.5rem;
  }
}
</style>