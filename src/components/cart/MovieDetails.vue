<script setup>
import { onMounted, watch, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/useMovieStore.js';
import DefaultLayout from '../../layout/DefaultLayout.vue';
import AddComment from '@/components/comments/AddCommentComponent.vue';
import MovieComments from '@/components/comments/MovieCommentsComponent.vue';
import LeftArrow from '@/components/icons/leftArrow.vue';

const seasonTitle = 'Сезон';
const buttonPreviousEpisode = 'Попередня серія';
const buttonNextEpisode = 'Наступна серія';
const buttonBackHome = 'На головну';
const buttonAutoPlayOn = 'Автоперемикання увімкнено';
const buttonAutoPlayOff = 'Автоперемикання вимкнено';
const buttonShowComments = 'Показати коментарі';
const buttonHideComments = 'Сховати коментарі';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();
const episodePlayer = ref(null);
const isLoading = ref(true);
const videoElement = ref(null);
const autoPlayEnabled = ref(true);
const showComments = ref(false);

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

const goBack = () => {
  router.push({ name: 'home' });
};

const handleVideoEnd = () => {
  if (autoPlayEnabled.value) {
    movieStore.playNextEpisode(
      movieStore.movie.seasons.find(
        (s) => s.seasonNumber === movieStore.selectedSeason
      )
    );
  }
};

const toggleAutoPlay = () => {
  autoPlayEnabled.value = !autoPlayEnabled.value;
};

const toggleComments = () => {
  showComments.value = !showComments.value;
};
</script>

<template>
  <DefaultLayout>
    <div class="relative min-h-screen bg-gray-900 text-white">
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{
          backgroundImage: `url(${movieStore.movie?.bgPosterUrl || movieStore.movie?.posterUrl})`,
        }"
      >
        <div
          class="bg-gradient-to-t from-gray-900 via-gray-900 to-transparent h-full"
        ></div>
      </div>

      <div class="relative p-4 sm:p-6 max-w-full mx-auto z-10">
        <button
          @click="goBack"
          class="back-btn absolute top-4 left-4 p-3 bg-gray-800 text-white rounded-md flex items-center hover:bg-red-600 transition duration-300 shadow-lg"
        >
          <LeftArrow />
          {{ buttonBackHome }}
        </button>
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
          <div
            class="border-t-4 border-red-600 rounded-full w-16 h-16 animate-spin"
          ></div>
        </div>
        <div v-else>
          <div class="flex flex-col md:flex-row md:items-center">
            <img
              :src="movieStore.movie?.posterUrl"
              alt="Movie Poster"
              class="w-full md:w-80 h-64 md:h-96 object-cover rounded-md shadow-lg border-4 border-red-600"
            />
            <div class="md:pl-6 mt-4 md:mt-0 flex-1">
              <h1
                class="text-2xl md:text-4xl font-bold mb-4 border-b-2 border-red-600 pb-2"
              >
                {{ movieStore.movie?.title }}
              </h1>
              <p class="text-sm md:text-lg mb-4">
                {{ movieStore.movie?.description }}
              </p>

              <div class="space-y-4 md:space-y-2">
                <div
                  v-for="season in movieStore.movie?.seasons"
                  :key="season.seasonNumber"
                  class="bg-gray-800 p-4 rounded-md border-2 border-gray-700"
                >
                  <h2
                    class="text-lg md:text-xl font-semibold mb-2 cursor-pointer flex items-center justify-between"
                    @click="movieStore.toggleSeason(season.seasonNumber)"
                  >
                    {{ seasonTitle }} {{ season.seasonNumber }}
                    <LeftArrow
                      :class="{
                        'rotate-180':
                          movieStore.selectedSeason === season.seasonNumber,
                      }"
                    />
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
                        'text-red-400': movieStore.currentEpisode === episode,
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
          <div
            v-if="movieStore.currentEpisode"
            ref="episodePlayer"
            class="mt-6"
          >
            <h3
              class="episode-player__title text-xl text-white md:text-2xl font-semibold mb-4 border-b-2 border-red-600 pb-2 flex items-center justify-between"
            >
              {{ movieStore.currentEpisode.title }}
              <button
                @click="toggleAutoPlay"
                class="autoplay-btn px-4 py-2 bg-gray-800 text-white rounded-md flex items-center hover:bg-red-600 transition duration-300 shadow-lg"
              >
                {{ autoPlayEnabled ? buttonAutoPlayOn : buttonAutoPlayOff }}
              </button>
            </h3>
            <video
              ref="videoElement"
              v-if="movieStore.currentEpisode.videoUrl"
              :src="movieStore.currentEpisode.videoUrl"
              class="w-full h-[50vh] md:h-[60vh] rounded-md border border-gray-800 shadow-lg"
              controls
              autoplay
              @ended="handleVideoEnd"
            ></video>
          </div>
          <div
            v-if="movieStore.currentEpisode"
            class="mt-6 flex flex-col md:flex-row md:space-x-4 justify-center space-y-4 md:space-y-0"
          >
            <button
              @click="
                movieStore.playPreviousEpisode(
                  movieStore.movie.seasons.find(
                    (s) => s.seasonNumber === movieStore.selectedSeason
                  )
                )
              "
              class="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center hover:bg-red-600 transition duration-300 shadow-lg"
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
              class="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center hover:bg-red-600 transition duration-300 shadow-lg"
            >
              {{ buttonNextEpisode }}
            </button>
          </div>
          <div class="mt-6 flex justify-center">
            <button
              @click="toggleComments"
              class="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center hover:bg-red-600 transition duration-300 shadow-lg"
            >
              {{ showComments ? buttonHideComments : buttonShowComments }}
            </button>
          </div>
          <div v-if="showComments" class="mt-6">
            <AddComment />
            <MovieComments />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style lang="scss" scoped>
video {
  max-width: 100%;
  height: auto;
}
.autoplay-btn {
  font-size: 18px;
  line-height: 24px;
}

@media only screen and (max-width: 430px) {
  .episode-player__title {
    flex-direction: column;
  }
  .autoplay-btn {
    font-size: 15px;
    line-height: 15px;
    background: red;
    margin-left: auto;
    display: block;
  }
  .back-btn {
    top: 0;
    font-size: 15px;
    line-height: 15px;
  }
}
</style>
