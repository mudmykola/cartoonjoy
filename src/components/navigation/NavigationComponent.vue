<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const menuItems = ref([
  { to: '/', label: 'Головна', icon: 'home' },
  { to: '/chat', label: 'Чат', icon: 'comments' },
  { to: '/favorites', label: 'Улюблені', icon: 'star' },
  { to: '/parents', label: 'Для батьків', icon: 'user' },
  { to: '/about', label: 'Про нас', icon: 'info-circle' },
]);

const route = useRoute();
</script>

<template>
  <nav class="bg-gray-900 p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="text-white text-3xl font-bold lg:hidden">
        <router-link to="/"
          ><p class="bg-red-600 px-2 py-1">
            Cartoon<span class="text-black">Joy</span>
          </p></router-link
        >
      </div>
      <div class="hidden lg:flex items-center w-full justify-between">
        <div class="text-white text-3xl font-bold">
          <router-link class="flex items-center" to="/"
            ><p class="bg-red-600 px-2 py-1">
              Cartoon<span class="text-black">Joy</span>
            </p>
          </router-link>
        </div>
        <ul class="flex space-x-6 overflow-x-auto">
          <li v-for="item in menuItems" :key="item.to">
            <router-link
              :to="item.to"
              class="text-white hover:text-red-500 flex items-center space-x-2"
              :class="{ 'border-b-2 border-red-500': route.path === item.to }"
            >
              <i :class="`fas fa-${item.icon}`"></i>
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="lg:hidden z-50 fixed bottom-0 inset-x-0 bg-gray-800 text-white flex justify-around py-2 border-t border-gray-700 shadow-lg"
    >
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center text-xs hover:text-red-500"
        :class="{ 'text-red-500': route.path === item.to }"
      >
        <i :class="`fas fa-${item.icon}`" class="w-6 h-6"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
i {
  font-size: 1.3rem;
}
</style>
