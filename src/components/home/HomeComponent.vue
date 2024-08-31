<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritesStore } from '@/stores/useFavoritesStore.js';

const welcomeMessage = 'Ласкаво просимо до CartoonJoy';
const searchPlaceholder = 'Пошук мультфільмів...';
const newestOption = 'Найновіші';
const oldestOption = 'Найстаріші';
const featuredMoviesTitle = 'Найкращі мультфільми';
const noResultsMessage = 'По вашому запиту нічого не найшло.';

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
    <h1 class="text-3xl font-bold mb-4">{{ welcomeMessage }}</h1>

    <div
      class="flex flex-col gap-4 mb-4 sm:flex-row sm:justify-between sm:gap-2"
    >
      <div class="relative flex-grow max-w-full sm:max-w-xs">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          class="w-full p-3 pr-10 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 px-4 py-2 text-sm bg-gray-800 text-white rounded-r-lg flex items-center justify-center hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <select
        v-model="sortOption"
        class="border rounded-lg p-2 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">{{ newestOption }}</option>
        <option value="oldest">{{ oldestOption }}</option>
      </select>
    </div>

    <section class="featured-section">
      <h2 class="text-2xl font-semibold mb-4">{{ featuredMoviesTitle }}</h2>
      <div
        v-if="sortedMovies.length > 0"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="movie in sortedMovies"
          :key="movie.id"
          class="relative bg-white p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
          @click="navigateToMovie(movie.id)"
        >
          <div class="relative h-48 mb-2 overflow-hidden rounded-lg">
            <img
              :src="movie.posterUrl"
              :alt="`Poster for ${movie.title}`"
              class="w-full h-full object-cover"
            />
            <button
              @click.stop="toggleFavorite(movie)"
              class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg border border-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
            >
              <svg
                v-if="isFavorite(movie.id)"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-5 h-5"
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
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <h3 class="text-sm font-semibold mb-1 truncate">
              {{ movie.title }}
            </h3>
            <p class="text-gray-600 text-xs truncate mb-2">
              {{ movie.description }}
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">{{ noResultsMessage }}</p>
      </div>
    </section>
  </div>
</template>
