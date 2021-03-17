//Creado por Emanuel Vargas Gómez
//Este archivo enruta todos los sitios de la página web

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import LogIn from '../views/LogIn.vue'
import DashboardAgente from '../views/DashboardAgente.vue'
import ArticulosAgente from '../views/ArticulosAgentes.vue'

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
    component: LogIn
  },
  {
    path: '/webapp/dashboards',
    name: 'Dashboard',
    component: Dashboard,
    meta:{requiresAuth:true}//esto lo envía al router.beforeach, y ahí se realiza el proceso de autenticación para que pueda continuar.
  },
  {
    path: '/webapp/dashboardagente',
    name: 'DashboardAgente',
    component: DashboardAgente,
    meta:{requiresAuth:true}
  },
  {
    path:'/webapp/articulosagente',
    name:'ArticulosAgente',
    component:ArticulosAgente,
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
  if (to.matched.some(record => record.meta.requiresAuth)) {//aqui pregunta si requiere autorizacion
    if ((localStorage.getItem('token') !== null) == false) {//aqui pregunta si tiene token
      next('/webapp/#')//si no lo tiene, lo devuelve al login
    } else {
      next()//y si lo tiene lo deja seguir
    }
  } else {
    next()//y si no requiere autorizacion lo deja continuar
  }
})