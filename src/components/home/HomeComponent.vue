<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoritesStore } from '@/stores/useFavoritesStore.js';
import IconClose from '@/components/icons/IconClose.vue';
import IconFavorite from '@/components/icons/IconFavorite.vue';
import IconFavoriteDone from '@/components/icons/IconFavoriteDone.vue';

const welcomeMessage = 'Ласкаво просимо до CartoonJoy';
const searchPlaceholder = 'Пошук мультфільмів...';
const newestOption = 'Найновіші';
const oldestOption = 'Найстаріші';
const featuredMoviesTitle = 'Найкращі мультфільми';
const noResultsMessage = 'По вашому запиту нічого не найшло.';
const loadMoreButtonText = 'Завантажити ще';

const featuredMovies = ref([]);
const searchQuery = ref('');
const sortOption = ref('newest');
const moviesPerPage = ref(12);
const currentStartIndex = ref(0);
const isLoading = ref(false);
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

const displayedMovies = computed(() => {
  return sortedMovies.value.slice(
    0,
    currentStartIndex.value + moviesPerPage.value
  );
});

const hasMoreMovies = computed(() => {
  return (
    currentStartIndex.value + moviesPerPage.value < sortedMovies.value.length
  );
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

const loadMoreMovies = async () => {
  if (hasMoreMovies.value && !isLoading.value) {
    isLoading.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      currentStartIndex.value += moviesPerPage.value;
    } finally {
      isLoading.value = false;
    }
  }
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
          class="absolute inset-y-0 right-0 px-4 py-2 text-sm bg-white text-black hover:text-white rounded-r-lg flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all hover:transition-shadow"
        >
          <IconClose />
        </button>
      </div>
      <select
        v-model="sortOption"
        class="border rounded-lg p-2 bg-white shadow-sm text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">{{ newestOption }}</option>
        <option value="oldest">{{ oldestOption }}</option>
      </select>
    </div>
    <section class="featured-section">
      <h2 class="text-2xl font-semibold mb-4">{{ featuredMoviesTitle }}</h2>
      <div
        v-if="displayedMovies.length > 0"
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="movie in displayedMovies"
          :key="movie.id"
          class="relative bg-white p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
          @click="navigateToMovie(movie.id)"
        >
          <div class="relative h-65 mb-2 overflow-hidden rounded-lg">
            <img
              :src="movie.posterUrl"
              :alt="`Poster for ${movie.title}`"
              class="w-full h-full object-cover"
            />
            <button
              @click.stop="toggleFavorite(movie)"
              class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg border border-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center"
            >
              <IconFavorite v-if="isFavorite(movie.id)" />
              <IconFavoriteDone v-else />
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
      <div class="flex justify-center mt-4">
        <button
          v-if="hasMoreMovies"
          @click="loadMoreMovies"
          :disabled="isLoading"
          class="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 flex items-center"
        >
          <span v-if="!isLoading">{{ loadMoreButtonText }}</span>
          <span
            v-else
            class="loader w-5 h-5 border-4 border-t-4 border-white border-opacity-25 rounded-full border-t-red-500 animate-spin"
          ></span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.loader {
  border-top-color: #fff;
}
</style>
