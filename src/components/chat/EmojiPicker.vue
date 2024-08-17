<template>
  <div class="emoji-picker bg-white border border-gray-300 p-2 rounded-lg shadow-lg">
    <div class="grid grid-cols-8 gap-2">
      <span
          v-for="emoji in emojis"
          :key="emoji"
          @click="selectEmoji(emoji)"
          class="text-xl cursor-pointer"
      >
        {{ emoji }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emojis = [
  '😀', '😁', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😍',
  '🥰', '😘', '😗', '😙', '😚', '😋', '😎', '🤓', '🤔', '🤑',
  '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙁', '☹️',
  '😣', '😖', '😫', '😩', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😶‍🌫️', '🙄', '😬',
  '🤐', '🤨', '🧐', '🤓', '😕', '😟', '🙁', '😔', '😲', '😳',
  '🤯', '😶', '😗', '😙', '😚', '😋', '😎', '🤓', '🤔', '🤑',
  '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙁', '☹️'
];

const emit = defineEmits(['emoji-select']);

const selectEmoji = (emoji) => {
  emit('emoji-select', emoji);
};
</script>

<style scoped>
.emoji-picker {
  max-height: 200px;
  overflow-y: auto;
}
</style>