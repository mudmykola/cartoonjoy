<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritesStore } from '@/stores/useFavoritesStore.js';

// Тексти для шаблону
const welcomeMessage = 'Ласкаво просимо до CartoonJoy';
const searchPlaceholder = 'Пошук мультфільмів...';
const sortLabel = 'Сортувати за:';
const newestOption = 'Найновіші';
const oldestOption = 'Найстаріші';
const featuredMoviesTitle = 'Найкращі мультфільми';
const noResultsMessage = 'По вашому запиту нічого не найшло.';
const addToFavorites = 'Додати до улюблених';
const removeFromFavorites = 'Видалити з улюблених';

const featuredMovies = ref([]);
const searchQuery = ref('');
const sortOption = ref('newest');
const router = useRouter();
const favoritesStore = useFavoritesStore();

onMounted(async () => {
  await fetchMovies();
});

const fetchMovies = async () => {
  try {
    const response = await fetch('/data/cartoons.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    featuredMovies.value = data;
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

const filteredMovies = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return featuredMovies.value.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query)
  );
});

const sortedMovies = computed(() => {
  const movies = [...filteredMovies.value];
  if (sortOption.value === 'newest') {
    return movies.sort(
      (firstMovie, secondMovie) =>
        new Date(secondMovie.releaseDate) - new Date(firstMovie.releaseDate)
    );
  } else {
    return movies.sort(
      (firstMovie, secondMovie) =>
        new Date(firstMovie.releaseDate) - new Date(secondMovie.releaseDate)
    );
  }
});

const toggleFavorite = (movie) => {
  if (favoritesStore.isFavorite(movie.id)) {
    favoritesStore.removeFavorite(movie.id);
  } else {
    favoritesStore.addFavorite(movie);
  }
};

const isFavorite = (movieId) => {
  return favoritesStore.isFavorite(movieId);
};

const navigateToMovie = (id) => {
  router.push({ name: 'movie', params: { id } });
};
</script>

<template>
  <div class="home-container p-4">
    <h1 class="text-3xl font-bold mb-8">{{ welcomeMessage }}</h1>
    <div class="search-section mb-8">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="searchPlaceholder"
        class="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div class="sort-section mb-8 flex justify-between items-center">
      <span class="text-lg font-medium">{{ sortLabel }}</span>
      <select
        v-model="sortOption"
        class="border rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">{{ newestOption }}</option>
        <option value="oldest">{{ oldestOption }}</option>
      </select>
    </div>
    <section class="featured-section mb-8">
      <h2 class="text-2xl font-semibold mb-4">{{ featuredMoviesTitle }}</h2>
      <div
        v-if="sortedMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="movie in sortedMovies"
          :key="movie.id"
          class="bg-white p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          @click="navigateToMovie(movie.id)"
        >
          <div class="mb-4 h-[500px]">
            <img
              :src="movie.posterUrl"
              :alt="`Poster for ${movie.title}`"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 class="text-xl font-semibold mb-2 truncate">
            {{ movie.title }}
          </h3>
          <p class="text-gray-600 truncate">
            {{ movie.description }}
          </p>
          <button
            @click="toggleFavorite(movie)"
            class="mt-2 p-3 border rounded-lg text-sm transition-colors duration-200 ease-in-out hover:scale-105"
            :class="{
              'bg-red-600 text-white border-red-600 hover:bg-red-700':
                isFavorite(movie.id),
              'bg-gray-300 text-black border-gray-400 hover:bg-gray-400':
                !isFavorite(movie.id),
            }"
          >
            <svg
              v-if="isFavorite(movie.id)"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5 inline-block mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 9.879a3 3 0 114.242-4.242L12 6.585l2.637-2.948a3 3 0 114.242 4.242L12 14.415l-6.879-6.536z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-5 h-5 inline-block mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
            {{ isFavorite(movie.id) ? removeFromFavorites : addToFavorites }}
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">{{ noResultsMessage }}</p>
      </div>
    </section>
  </div>
</template>
