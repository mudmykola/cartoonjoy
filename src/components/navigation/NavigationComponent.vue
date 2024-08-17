<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const menuItems = ref([
  { to: "/", label: "Головна" },
  { to: "/chat", label: "Чат" },
  { to: "/parents", label: "Для батьків" },
  { to: "/about", label: "Про нас" }
]);

const route = useRoute();
</script>

<template>
  <nav class="bg-gray-900 p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="text-white text-3xl font-bold">
        <router-link to="/">CartoonJoy</router-link>
      </div>
      <button @click="toggleMenu" class="lg:hidden text-white focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <ul class="hidden lg:flex space-x-6">
        <li v-for="item in menuItems" :key="item.to">
          <router-link
              :to="item.to"
              class="text-white hover:text-red-500"
              :class="{ 'border-b-2 border-red-500': route.path === item.to }"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
      <transition name="fade">
        <div v-if="isMenuOpen" class="fixed inset-0 z-50 bg-gray-800 bg-opacity-90 overflow-auto">
          <div class="flex flex-col h-full">
            <button @click="toggleMenu" class="absolute top-4 right-4 text-white text-3xl p-2">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div class="flex flex-col items-center justify-center flex-grow space-y-6">
              <ul class="text-white text-2xl space-y-6">
                <li v-for="item in menuItems" :key="item.to">
                  <router-link
                      :to="item.to"
                      class="text-white hover:text-red-500"
                      :class="{ 'border-b-2 border-red-500': route.path === item.to }"
                      @click="toggleMenu"
                  >
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>