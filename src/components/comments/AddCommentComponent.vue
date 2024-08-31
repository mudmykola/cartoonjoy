<script setup>
import { ref } from 'vue';
import EmojiPicker from '@/components/chat/EmojiPicker.vue';
import { database } from '@/firebase';
import { ref as dbRef, push } from 'firebase/database';

const props = defineProps({
  movieId: String,
});

const nickname = ref('');
const newComment = ref('');
const showEmojiPicker = ref(false);

const addCommentTitle = 'Додати коментар';
const nicknamePlaceholder = 'Ваш нікнейм';
const commentPlaceholder = 'Напишіть ваш коментар...';
const toggleEmojiText = 'Вибрати смайлик';
const submitCommentText = 'Додати коментар';

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const insertEmoji = (emoji) => {
  newComment.value += emoji;
  showEmojiPicker.value = false;
};

const submitComment = async () => {
  if (nickname.value.trim() === '' || newComment.value.trim() === '') return;

  const commentData = {
    text: newComment.value,
    nickname: nickname.value,
    timestamp: new Date().toISOString(),
  };

  try {
    const commentsRef = dbRef(database, `cartoons/${props.movieId}/comments`);
    await push(commentsRef, commentData);

    newComment.value = '';
    nickname.value = '';
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};
</script>

<template>
  <div
    class="mx-auto max-w-4xl rounded-lg bg-gray-800 p-6 shadow-md add-comment-section"
  >
    <h3 class="mb-4 text-xl font-bold text-white">{{ addCommentTitle }}</h3>

    <input
      v-model="nickname"
      type="text"
      :placeholder="nicknamePlaceholder"
      class="mb-4 w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600"
    />

    <textarea
      v-model="newComment"
      :placeholder="commentPlaceholder"
      class="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600"
      rows="3"
    ></textarea>

    <div class="mt-4 flex gap-2">
      <button
        @click="toggleEmojiPicker"
        class="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 shadow-md transition-colors duration-300 hover:bg-gray-100 hover:text-gray-900"
      >
        {{ toggleEmojiText }}
      </button>

      <button
        @click="submitComment"
        class="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 shadow-md transition-colors duration-300 hover:bg-gray-100 hover:text-gray-900"
      >
        {{ submitCommentText }}
      </button>
    </div>

    <EmojiPicker
      v-if="showEmojiPicker"
      @emoji-select="insertEmoji"
      class="mt-4"
    />
  </div>
</template>
