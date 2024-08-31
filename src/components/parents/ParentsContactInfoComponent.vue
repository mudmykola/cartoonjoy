<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  content: String,
});
</script>

<template>
  <section class="contact-info">
    <h2 class="text-2xl lg:text-3xl font-semibold mb-4 text-red-400">
      Контактна інформація
    </h2>
    <p class="text-base lg:text-lg text-gray-300" v-html="content"></p>
  </section>
</template>
