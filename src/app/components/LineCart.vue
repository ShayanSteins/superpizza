<template>
  <div>
    <span>{{ this.$getPizzaName(this.line.id) }}</span>
    <input
      type="number"
      min="0"
      max="30"
      :value="qty"
      @input="$emit('change', line.id, $event.target.value)"
    />
    <span>{{ countPizzasPrice }} €</span>
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
    line : function (newVal, oldVal) {
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
</style>