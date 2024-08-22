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
  <div class="add-comment-section bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
    <h3 class="text-xl font-bold mb-4 text-white">{{ addCommentTitle }}</h3>

    <input
        v-model="nickname"
        type="text"
        :placeholder="nicknamePlaceholder"
        class="w-full p-3 mb-4 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
    />

    <textarea
        v-model="newComment"
        :placeholder="commentPlaceholder"
        class="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        rows="3"
    ></textarea>

    <div class="flex gap-2 mt-4">
      <button
          @click="toggleEmojiPicker"
          class="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 shadow-md"
      >
        {{ toggleEmojiText }}
      </button>

      <button
          @click="submitComment"
          class="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 shadow-md"
      >
        {{ submitCommentText }}
      </button>
    </div>

    <EmojiPicker v-if="showEmojiPicker" @emoji-select="insertEmoji" class="mt-4" />
  </div>
</template>