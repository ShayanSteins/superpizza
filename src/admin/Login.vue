<template>
  <div>
    <header class="shadow">
      <div id="headerTitle" class="bold">Super Pizza</div>
    </header>

    <input type="checkbox" v-model="isLogged"> Logged

    <form @submit.prevent="login" v-if="!isLogged">
      <input type="text" v-model="id" placeholder="Identifiant" required />
      <input type="password" v-model="pwd" placeholder="Password" required />
      <button>Connexion</button>
    </form>
    <Admin v-if="isLogged"></Admin>
  </div>
</template>

<script>
import Admin from './Admin.vue'
// const ws = new WebSocket('ws://localhost:4040')

export default {
  name: 'Login',
  components: {
    Admin
  },
  data() {
    return {
      isLogged: false,
      id: '',
      pwd: ''
    }
  },
  created() {
    if (localStorage.getItem('logged') !== null) {
      this.isLogged = localStorage.getItem('logged')
    }
  },
  methods: {
    login(e) {
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Basic ' + btoa(`${this.id}:${this.pwd}`)
        },
        body: JSON.stringify({ id: this.id, pwd: this.pwd })
      }).then((response) => {
        return response.json()
      }).then((datas) => {
        if (datas === 'OK') {
          this.isLogged = true
          localStorage.setItem('logged', true)
        }
      }).catch((err) => {
        throw err
      })

      // let response = await fetch('/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8'
      //   },
      //   body: JSON.stringify({id: this.id, pwd: this.pwd})
      // })
    }
  }
}
</script>

<style>
:root {
  --main-bg-color: rgb(248, 248, 248);
  --main-green-color: rgb(0 144 69);
  --main-red-color: rgb(208 44 55);
  --main-grey-color: rgb(41 41 41);
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
  text-align: center;
}
</style>