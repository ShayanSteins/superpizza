<template>
  <div>
    <!-- <input
      type="number"
      min="0"
      max="30"
      v-model.number="qty"
      @input="checkQtyFormat"
    /> -->
  </div>
</template>

<script>
export default {
  name: 'InputQuantity',
  // methods: {
  //   checkQtyFormat() {
  //     if (this.qty === '')
  //       this.isIncorrectFormat = true
  //     else
  //       this.isIncorrectFormat = (this.qty < 0 || 30 < this.qty)
  //   }
  // }
}
</script>

<style scoped>
</style>