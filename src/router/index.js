import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import LogIn from '../views/LogIn.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/webapp/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/webapp/',
    name: 'LogIn',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: LogIn
  },
  {
    path: '/webapp/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Dashboard,
    meta:{requiresAuth:true}
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    console.log((localStorage.getItem('token') !== null))
    if ((localStorage.getItem('token') !== null) == false) {
      console.log(!(localStorage.getItem('token') !== undefined))
      next('/webapp/#')
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})