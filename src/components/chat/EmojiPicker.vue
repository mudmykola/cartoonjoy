<script setup>
import { defineEmits } from 'vue';

const emojis = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😎',
  '🤓',
  '🤔',
  '🤑',
  '😛',
  '😜',
  '😝',
  '🤤',
  '😒',
  '😓',
  '😔',
  '😕',
  '🙁',
  '☹️',
  '😣',
  '😖',
  '😫',
  '😩',
  '😢',
  '😭',
  '😤',
  '😠',
  '😡',
  '🤬',
  '🤯',
  '😳',
  '🥵',
  '🥶',
  '😱',
  '😨',
  '😰',
  '😥',
  '😓',
  '🤗',
  '🤔',
  '🤭',
  '🤫',
  '🤥',
  '😶',
  '😐',
  '😑',
  '😶‍🌫️',
  '🙄',
  '😬',
  '🤐',
  '🤨',
  '🧐',
  '🤓',
  '😕',
  '😟',
  '🙁',
  '😔',
  '😲',
  '😳',
  '🤯',
  '😶',
  '😗',
  '😙',
  '😚',
  '😋',
  '😎',
  '🤓',
  '🤔',
  '🤑',
  '😛',
  '😜',
  '😝',
  '🤤',
  '😒',
  '😓',
  '😔',
  '😕',
  '🙁',
  '☹️',
];

const emit = defineEmits(['emoji-select']);

const selectEmoji = (emoji) => {
  emit('emoji-select', emoji);
};
</script>

<template>
  <div
    class="rounded-lg border border-gray-300 bg-white p-2 shadow-lg emoji-picker"
  >
    <div class="grid grid-cols-8 gap-2">
      <span
        v-for="emoji in emojis"
        :key="emoji"
        @click="selectEmoji(emoji)"
        class="cursor-pointer rounded p-1 text-xl hover:bg-gray-100"
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