import Vue from 'vue'
import App from './App.vue'
import { Store } from '../assets/store.js'

Store.initWS()

Vue.use(Store)

new Vue({
  render: h => h(App)
}).$mount('#app')