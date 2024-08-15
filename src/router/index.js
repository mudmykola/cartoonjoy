import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/home/HomePage.vue'
import MovieDetail from '../components/cart/MovieDetails.vue';
import AboutPage from "../views/about/AboutPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: {title: 'Home Page'}
        },
        {
            path: '/movie/:id',
            name: 'movie',
            component: MovieDetail,
            meta: {title: 'Movies Details'}
        },
        {
            path: '/about',
            name: 'about',
            component: AboutPage,
            meta: {title: 'About Page'}
        },
    ]
})

export default router