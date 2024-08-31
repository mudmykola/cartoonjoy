<script setup>
import { onMounted, watch, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/useMovieStore.js';
import DefaultLayout from '../../layout/DefaultLayout.vue';
import AddComment from '@/components/comments/AddCommentComponent.vue';
import MovieComments from '@/components/comments/MovieCommentsComponent.vue';

const seasonTitle = 'Сезон';
const buttonPreviousEpisode = 'Попередня серія';
const buttonNextEpisode = 'Наступна серія';
const buttonBackHome = 'На головну';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();
const episodePlayer = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  const movieId = parseInt(route.params.id);
  await movieStore.fetchMovieDetails(movieId);
  isLoading.value = false;
});

watch(
  () => route.params.id,
  async (newId) => {
    isLoading.value = true;
    movieStore.resetCurrentEpisode();
    await movieStore.fetchMovieDetails(parseInt(newId));
    isLoading.value = false;
  }
);

watch(
  () => movieStore.currentEpisode,
  async (newEpisode) => {
    if (newEpisode) {
      await nextTick();
      if (episodePlayer.value) {
        episodePlayer.value.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  },
  { immediate: true }
);

const getIframeSrc = (videoUrl) => videoUrl;

const goBack = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <DefaultLayout>
    <div class="p-4 sm:p-6 max-w-full mx-auto bg-gray-900 text-white">
      <button
        @click="goBack"
        class="mb-4 p-3 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M14.293 6.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ buttonBackHome }}
      </button>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"
        ></div>
      </div>

      <div v-else>
        <div v-if="movieStore.movie" class="flex flex-col md:flex-row">
          <div class="flex-shrink-0 mb-6 md:mb-0 md:w-1/3">
            <img
              :src="movieStore.movie.posterUrl"
              alt="Movie Poster"
              class="w-full h-64 md:h-80 object-cover rounded-md shadow-lg"
            />
          </div>

          <div class="flex-1 md:pl-6">
            <h1 class="text-2xl md:text-3xl font-bold mb-4">
              {{ movieStore.movie.title }}
            </h1>
            <p class="text-sm md:text-base mb-4">
              {{ movieStore.movie.description }}
            </p>

            <div class="max-h-80 overflow-y-auto">
              <div
                v-for="season in movieStore.movie.seasons"
                :key="season.seasonNumber"
                class="mb-6"
              >
                <h2
                  class="text-lg md:text-xl font-semibold mb-2 cursor-pointer flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-300"
                  @click="movieStore.toggleSeason(season.seasonNumber)"
                >
                  {{ seasonTitle }} {{ season.seasonNumber }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :class="{
                      'rotate-180':
                        movieStore.selectedSeason === season.seasonNumber,
                    }"
                    class="w-5 h-5 transform transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14.293 6.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </h2>

                <ul
                  v-if="movieStore.selectedSeason === season.seasonNumber"
                  class="list-disc list-inside pl-4"
                >
                  <li
                    v-for="episode in season.episodes"
                    :key="episode.id"
                    @click="movieStore.selectEpisode(episode)"
                    :class="{
                      'text-red-500': movieStore.currentEpisode === episode,
                    }"
                    class="mb-2 cursor-pointer hover:underline transition duration-300"
                  >
                    {{ episode.episodeNumber }}. {{ episode.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div v-if="movieStore.currentEpisode" ref="episodePlayer" class="mt-6">
          <h3 class="text-lg md:text-xl font-semibold mb-2">
            {{ movieStore.currentEpisode.title }}
          </h3>
          <iframe
            v-if="movieStore.currentEpisode.videoUrl"
            :src="getIframeSrc(movieStore.currentEpisode.videoUrl)"
            class="w-full h-[50vh] md:h-[60vh] rounded-md border border-gray-800 shadow-lg"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <div
          v-if="movieStore.currentEpisode"
          class="mt-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button
            @click="
              movieStore.playPreviousEpisode(
                movieStore.movie.seasons.find(
                  (s) => s.seasonNumber === movieStore.selectedSeason
                )
              )
            "
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            {{ buttonPreviousEpisode }}
          </button>
          <button
            @click="
              movieStore.playNextEpisode(
                movieStore.movie.seasons.find(
                  (s) => s.seasonNumber === movieStore.selectedSeason
                )
              )
            "
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            {{ buttonNextEpisode }}
          </button>
        </div>

        <div class="comment mt-8">
          <div v-if="movieStore.currentEpisode">
            <MovieComments :movieId="route.params.id" />
          </div>

          <div v-if="movieStore.currentEpisode" class="mt-6">
            <AddComment :movieId="route.params.id" />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.loader {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fa2b38;
}
</style>
