import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import ShowGames from './components/views/ShowGames.vue';
import AddGame from './components/views/AddGame.vue';  // Assuming this component exists
import StartView from './components/views/StartView.vue';

// Define the routes and their components
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: StartView,
    },
    {
        path: '/ShowGames',
        name: 'ShowGame',
        component: ShowGames,
    },
    {
        path: '/addGame',
        name: 'AddGame',
        component: AddGame,
    },
];

// Create and export the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;