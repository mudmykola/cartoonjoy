<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentVisitors = ref(0);

const updateVisitorsCount = () => {
  const storedCount = sessionStorage.getItem('visitorsCount') || 0;
  sessionStorage.setItem('visitorsCount', parseInt(storedCount) + 1);
  currentVisitors.value = parseInt(storedCount) + 1;
};

const decreaseVisitorsCount = () => {
  const storedCount = sessionStorage.getItem('visitorsCount') || 0;
  if (storedCount > 0) {
    sessionStorage.setItem('visitorsCount', storedCount - 1);
    currentVisitors.value = storedCount - 1;
  }
};

onMounted(() => {
  updateVisitorsCount();
});

onUnmounted(() => {
  decreaseVisitorsCount();
});
</script>

<template>
  <footer class="footer bg-gray-900 text-white py-6">
    <div class="container mx-auto px-4 flex justify-center md:justify-between items-center flex-col md:flex-row">
      <p class="text-lg font-semibold mb-2 md:mb-0">Зараз на сайті:
        <span class="text-red-600">{{ currentVisitors }}</span>
        відвідувачів
      </p>
      <div class="text-sm text-gray-400">
        © 2024 CartoonJoy. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #141414;
}

@media (min-width: 768px) {
  .footer p {
    font-size: 1.25rem;
  }
}
</style>