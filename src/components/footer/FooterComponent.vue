<script setup>
import { ref } from 'vue';
import VisitorsCountComponent from '@/components/footer/FooterVisitorsCountComponent.vue';
import FooterVersionComponent from '@/components/footer/FooterVersionComponent.vue';

const currentYear = ref(new Date().getFullYear());
const version = import.meta.env.VITE_APP_VERSION;
</script>

<template>
  <footer class="footer text-white py-6">
    <div
      class="container mx-auto px-4 flex justify-between md:justify-between items-center flex-col md:flex-row"
    >
      <VisitorsCountComponent />
      <div class="text-sm text-gray-400">
        © {{ currentYear }} CartoonJoy. All rights reserved.
      </div>
      <FooterVersionComponent />
    </div>
  </footer>
</template>
