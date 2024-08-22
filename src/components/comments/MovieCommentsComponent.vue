<script setup>
import { ref, onMounted, computed } from 'vue';
import { database } from '@/firebase';
import { ref as dbRef, onValue } from 'firebase/database';

const props = defineProps({
  movieId: String,
});

const comments = ref([]);
const showAll = ref(false);

const visibleComments = computed(() => {
  return showAll.value ? comments.value : comments.value.slice(0, 5);
});

const toggleComments = () => {
  showAll.value = !showAll.value;
};

const fetchComments = () => {
  const commentsRef = dbRef(database, `cartoons/${props.movieId}/comments`);
  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    comments.value = data
        ? Object.keys(data).map((key) => ({id: key, ...data[key]}))
        : [];
  });
};

onMounted(() => {
  fetchComments();
});

const commentsTitle = 'Коментарі';
const noCommentsText = 'Коментарі відсутні.';
</script>

<template>
  <div class="comments-section bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
    <h3 class="text-xl font-bold mb-4 text-white">{{ commentsTitle }}</h3>

    <div v-if="visibleComments.length > 0">
      <div
          v-for="comment in visibleComments"
          :key="comment.id"
          class="comment bg-gray-700 p-4 rounded-lg mb-4 shadow-sm"
      >
        <div class="flex items-center mb-2">
          <div class="bg-red-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {{ comment.nickname.charAt(0).toUpperCase() }}
          </div>
          <p class="text-lg font-semibold text-white">{{ comment.nickname || 'Анонім' }}</p>
        </div>
        <p class="comment-text text-gray-300 mb-2">{{ comment.text }}</p>
        <p class="comment-timestamp text-sm text-gray-400">{{ new Date(comment.timestamp).toLocaleString() }}</p>
      </div>
    </div>

    <div v-if="comments.length > visibleComments.length">
      <button
          @click="toggleComments"
          class="text-red-600 font-semibold hover:text-red-500 transition-colors"
      >
        {{ showAll ? 'Згорнути' : 'Показати більше коментарів' }}
      </button>
    </div>

    <div v-else-if="visibleComments.length === 0">
      <p class="text-gray-500">{{ noCommentsText }}</p>
    </div>
  </div>
</template>