<template>
  <div class="lineCart">
    <span class="name">{{ this.$getPizzaInfos(this.line.id, 'name') }}</span>
    <input
      type="number"
      class="qty"
      min="0"
      max="30"
      :value="qty"
      @input="$emit('change', line.id, $event.target.value)"
      required
    />
    <span class="price">{{ countPizzasPrice }} €</span>
  </div>
</template>

<script>
export default {
  name: 'LineCart',
  data() {
    return {
      qty: this.line.qty
    }
  },
  props: {
    line: {
      type: Object
    },
    unitPrice: {
      type: Number
    }
  },
  watch: {
    line: function (newVal, oldVal) {
      this.qty = newVal.qty
    }
  },
  computed: {
    countPizzasPrice: function () {
      return this.qty * this.unitPrice
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.lineCart {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr;
  grid-gap: 0.1rem;
  padding: 0.2rem;
}

.name {
  grid-column: 1;
}
.qty {
  grid-column: 2;
}
.price {
  grid-column: 3;
  text-align: right;
}
</style>