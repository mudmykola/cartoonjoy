<template>
  <router-link
      :to="to"
      class="text-white hover:text-red-500 transition-colors duration-300"
  >
    {{ label }}
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: String,
  label: String,
});
</script>