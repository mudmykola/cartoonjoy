<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useVisitorsStore } from '@/stores/visitors.js';

const visitorsStore = useVisitorsStore();

onMounted(() => {
  visitorsStore.updateVisitorsCount();
});

onUnmounted(() => {
  visitorsStore.decreaseVisitorsCount();
});
</script>

<template>
  <p class="text-lg font-semibold mb-2 md:mb-0">
    Зараз на сайті:
    <span class="text-red-600">{{ visitorsStore.currentVisitors }}</span>
    відвідувачів
  </p>
</template>