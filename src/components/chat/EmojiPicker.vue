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

<template>
  <div class="emoji-picker bg-white border border-gray-300 p-2 rounded-lg shadow-lg">
    <div class="grid grid-cols-8 gap-2">
      <span
          v-for="emoji in emojis"
          :key="emoji"
          @click="selectEmoji(emoji)"
          class="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded"
      >
        {{ emoji }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker {
  max-height: 200px;
  overflow-y: auto;
}

.emoji-picker span {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>