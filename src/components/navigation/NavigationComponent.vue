<script setup>
import NavLink from './NavLinkComponent.vue';
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
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
        <li><NavLink to="/" label="Головна" /></li>
        <li><NavLink to="/about" label="Про нас" /></li>
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
                <li><NavLink to="/" label="Головна" /></li>
                <li><NavLink to="/about" label="Про нас" /></li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>



<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-gray-800 {
  background-color: #141414;
}

.bg-gray-900 {
  background-color: #000000;
}

.text-white {
  color: #ffffff;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>