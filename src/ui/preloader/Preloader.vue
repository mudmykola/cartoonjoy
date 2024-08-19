<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    document.querySelector('.curtain').classList.add('curtain-open');
  }, 100);

  setTimeout(() => {
    router.push({name: 'home'});
  }, 1500);
});
</script>

<template>
  <div class="preloader fixed inset-0 bg-gray-900 flex items-center justify-center z-50 overflow-hidden">
    <div class="preloader-content relative flex flex-col items-center justify-center p-4 md:p-8">
      <div class="curtain absolute top-0 left-0 w-full h-full bg-black transition-transform duration-1000"></div>
      <div class="preloader-inner flex flex-col items-center justify-center relative">
        <div class="loader-wrapper relative mb-6 flex flex-col items-center justify-center">
          <div class="loader animate-pulse z-20">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 md:w-24 md:h-24 text-red-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 4a1 1 0 011 1v14a1 1 0 01-2 0V5a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="loader-pulses flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 z-30">
            <div class="pulse bg-red-600 shadow-lg"></div>
            <div class="pulse bg-red-400 shadow-lg"></div>
            <div class="pulse bg-red-200 shadow-lg"></div>
          </div>
        </div>
        <h1 class="text-5xl md:text-8xl font-extrabold text-gradient mt-4 md:mt-8 relative z-20 animate-fade-in-out">CartoonJoy</h1>
        <p class="text-base md:text-lg text-white text-shadow mt-2 md:mt-4 relative z-20 animate-fade-in-out">Приготуйтеся до світу веселощів!</p>
        <div class="glass-effect absolute inset-0 z-10"></div>
        <div class="shimmer-overlay absolute top-0 left-0 w-full h-full opacity-50 z-5"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "style.css";
</style>