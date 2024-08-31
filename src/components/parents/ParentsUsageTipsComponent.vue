<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  content: Array,
});
</script>

<template>
  <section class="usage-tips mb-10">
    <h2 class="text-2xl lg:text-3xl font-semibold mb-4 text-red-400">
      Рекомендації щодо використання сайту
    </h2>
    <ul
      class="list-disc list-inside space-y-2 text-base lg:text-lg text-gray-300 pl-5"
    >
      <li v-for="(item, index) in content" :key="index" v-html="item"></li>
    </ul>
  </section>
</template>

<style scoped></style>
