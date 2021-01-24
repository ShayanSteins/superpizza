import Vue from 'vue'
import Admin from './Admin.vue'
import { Store } from '../assets/store.js'

Store.initWS()

Vue.use(Store)

new Vue({
  render: h => h(Admin)
}).$mount('#admin')
