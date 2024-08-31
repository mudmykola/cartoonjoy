<script setup>
import { ref, onMounted } from 'vue';
import DefaultLayout from '../../layout/DefaultLayout.vue';
import HomeComponent from '../../components/home/HomeComponent.vue';
import Preloader from '@/ui/preloader/Preloader.vue';

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
</script>

<template>
  <DefaultLayout>
    <Preloader v-if="isLoading" />
    <div v-else class="home">
      <HomeComponent />
    </div>
  </DefaultLayout>
</template>
