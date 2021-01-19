<template>
  <div>
    <div id="header">
      <div>
        <input type="checkbox" v-model="order.state" @change="setState" />
        <span class="bold">{{ order.timeSlot }}</span>
      </div>
      <div class="right">
        <span class="bold">{{ order.firstName }}</span>
        <span class="bold">{{ order.lastName }}</span
        ><br />
        <span class="italic">{{ order.phone }}</span>
      </div>
    </div>
    <div>
      <div v-for="p in order.pizzas" :key="p.name">
        <span>- {{ p.qty }} x {{ p.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDisplayer',
  props: {
    order: {
      type: Object
    }
  },
  methods: {
    setState() {
      this.$ws.send(JSON.stringify({ "head": "setState", "datas": { idOrder: this.order.idOrder, state: this.order.state } }))
    }
  }
}
</script>

<style scoped>
#header {
  display: flex;
  justify-content: space-between;
}
.right {
  text-align: right;
}
</style>