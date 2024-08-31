<script setup>
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import DefaultLayout from '@/layout/DefaultLayout.vue';

const pageTitle = 'Улюблені мультфільми';
const removeFavoriteText = 'Видалити з улюблених';
const noFavoritesText = 'У вас ще немає улюблених мультфільмів';

const favoritesStore = useFavoritesStore();
const router = useRouter();

const favorites = computed(() => favoritesStore.favorites);

const removeFavorite = (movieId) => {
  favoritesStore.removeFavorite(movieId);
};

const navigateToMovie = (id) => {
  router.push({ name: 'movie', params: { id } });
};
</script>

<template>
  <DefaultLayout>
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-8">{{ pageTitle }}</h1>
      <div
        v-if="favorites.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="movie in favorites"
          :key="movie.id"
          class="bg-white border rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl cursor-pointer flex flex-col"
          @click="navigateToMovie(movie.id)"
        >
          <div class="relative h-60 overflow-hidden rounded-t-lg">
            <img
              :src="movie.posterUrl"
              :alt="`Poster for ${movie.title}`"
              class="w-full h-full object-cover absolute top-0 left-0"
            />
          </div>
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-xl font-semibold mb-2 truncate">
              {{ movie.title }}
            </h3>
            <p class="text-gray-600 truncate">{{ movie.description }}</p>
            <button
              @click.stop="removeFavorite(movie.id)"
              class="mt-4 py-2 px-4 border rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
            >
              {{ removeFavoriteText }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">{{ noFavoritesText }}</p>
      </div>
    </div>
  </DefaultLayout>
</template>
