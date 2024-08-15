<script setup>
import FooterComponent from "../components/footer/FooterComponent.vue";
import HeaderComponent from "../components/header/HeaderComponent.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen bg-blue-100">
    <header class="bg-black shadow-md py-4 ">
      <HeaderComponent />
    </header>
    <main class="flex-1 p-4">
      <slot />
    </main>
    <footer class="bg-black py-4 text-white">
      <FooterComponent />
    </footer>
  </div>
</template>