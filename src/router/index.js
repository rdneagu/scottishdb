import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/constituencies',
    name: 'constituencies',
    component: () => import('../views/Constituencies.vue'),
  },
  {
    path:
    '/cities',
    name: 'cities',
    component: () => import('../views/Cities.vue'),
  },
  {
    path: '/occupations',
    name: 'occupations',
    component: () => import('../views/Occupations.vue'),
    props: route => ({ query: route.query }),
  },
  {
    path: '/contact-us',
    name: 'contact-us',
    component: () => import('../views/ContactUs.vue'),
  },
  {
    path: '/searchResult',
    name: 'search-result',
    component: () => import('../views/SearchResult.vue'),
    props: route => ({ query: route.query }),
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404.vue'),
  },
];

export default new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
