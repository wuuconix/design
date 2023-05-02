import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Main from "./Main.vue"
import Login from "./Login.vue"
import { createRouter, createWebHistory } from "vue-router"

const app = createApp(App)

const routes = [
  { 
    path: '/', 
    component: Main,
    beforeEnter: () => {
      if (localStorage.getItem("isLogin") != "1") {
        router.push("/login")
        return false
      } else {
        return true
      }
    }
  },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


app.use(ElementPlus)
app.use(router)
app.mount('#app')