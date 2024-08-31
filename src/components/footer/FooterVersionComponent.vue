<script setup>
const version = import.meta.env.VITE_APP_VERSION;
console.log('Current version:', version);
</script>

<template>
  <div class="version-component text-sm text-gray-400">
    Version {{ version }}
  </div>
</template>

<style scoped>
.version-component {
  font-size: 0.875rem;
  color: #e0e0e0;
}
</style>
