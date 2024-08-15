<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DefaultLayout from "../../layout/DefaultLayout.vue";

const seasonTitle = ref('Сезон');
const buttonPreviousEpisode = ref('Попередня серія');
const buttonNextEpisode = ref('Наступна серія');
const buttonBackHome = ref('На головну');

const movie = ref(null);
const selectedSeason = ref(null);
const currentEpisode = ref(null);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await fetchMovieDetails();
});

const fetchMovieDetails = async () => {
  try {
    const response = await fetch('/data/cartoons.json');
    const data = await response.json();
    const movieId = parseInt(route.params.id);
    movie.value = data.find(movie => movie.id === movieId) || null;
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

const getIframeSrc = (videoUrl) => {
  return videoUrl;
};

const selectEpisode = (episode) => {
  currentEpisode.value = currentEpisode === episode ? null : episode;
};

const playNextEpisode = (season) => {
  const currentEpisodeIndex = season.episodes.findIndex(e => e === currentEpisode.value);
  if (currentEpisodeIndex >= 0 && currentEpisodeIndex < season.episodes.length - 1) {
    const nextEpisode = season.episodes[currentEpisodeIndex + 1];
    currentEpisode.value = nextEpisode;
  }
};

const playPreviousEpisode = (season) => {
  const currentEpisodeIndex = season.episodes.findIndex(e => e === currentEpisode.value);
  if (currentEpisodeIndex > 0) {
    const prevEpisode = season.episodes[currentEpisodeIndex - 1];
    currentEpisode.value = prevEpisode;
  }
};

const toggleSeason = (seasonNumber) => {
  if (selectedSeason.value === seasonNumber) {
    selectedSeason.value = null;
  } else {
    selectedSeason.value = seasonNumber;
  }
};

const goBack = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <DefaultLayout>
    <div class="movie-details-container p-6 max-w-screen-lg mx-auto bg-gray-900 text-white">
      <button @click="goBack" class="back-button mb-4 p-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M14.293 6.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5z" clip-rule="evenodd" />
        </svg>
        {{buttonBackHome}}
      </button>

      <div v-if="movie" class="movie-details">
        <div class="movie-header flex flex-col items-center md:flex-row md:items-start">
          <img
              :src="movie.posterUrl"
              :alt="`Poster for ${movie.title}`"
              class="poster-image w-full md:w-1/3 md:mr-4 mb-4 md:mb-0"
          />
          <div class="movie-info flex-1">
            <h1 class="movie-title text-4xl font-extrabold mb-4">{{ movie.title }}</h1>
            <p class="movie-description text-lg mb-4">{{ movie.description }}</p>
          </div>
        </div>

        <div class="seasons-accordion">
          <div v-for="season in movie.seasons" :key="season.seasonNumber" class="season-section mb-6">
            <h2
                class="season-title text-2xl font-semibold mb-2 cursor-pointer flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-300"
                @click="toggleSeason(season.seasonNumber)"
            >
              {{ seasonTitle }} {{ season.seasonNumber }}
              <svg xmlns="http://www.w3.org/2000/svg" :class="{ 'rotate-180': selectedSeason === season.seasonNumber }" class="w-5 h-5 transform transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M14.293 6.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </h2>

            <transition name="fade">
              <div v-if="selectedSeason === season.seasonNumber" class="episodes mt-4">
                <div v-for="episode in season.episodes" :key="episode.episodeNumber" class="episode-item mb-4">
                  <div
                      class="episode-header flex items-center justify-between p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition duration-300"
                      @click="selectEpisode(episode)"
                  >
                    <h3 class="episode-title text-lg font-semibold">Серія {{ episode.episodeNumber }}: {{ episode.title }}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" :class="{ 'rotate-90': currentEpisode === episode }" class="w-5 h-5 transform transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M14.293 6.293a1 1 0 011.414 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>

                  <transition name="fade">
                    <div v-if="currentEpisode === episode" class="episode-details mt-2 p-2 bg-gray-800 rounded-md">
                      <iframe
                          :src="getIframeSrc(episode.videoUrl)"
                          frameborder="0"
                          allowfullscreen
                          class="video-player rounded-lg shadow-lg"
                      ></iframe>
                      <div class="controls mt-4 flex justify-between">
                        <button v-if="currentEpisode" @click="playPreviousEpisode(season)" class="control-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M15.707 5.707a1 1 0 010 1.414L11.414 12l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          {{buttonPreviousEpisode}}
                        </button>
                        <button v-if="currentEpisode" @click="playNextEpisode(season)" class="control-button bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M8.293 5.707a1 1 0 010 1.414L12.586 12l-4.293 4.293a1 1 0 011.414 1.414l5-5a1 1 0 010-1.414l-5-5a1 1 0 00-1.414 0z" clip-rule="evenodd" />
                          </svg>
                          {{buttonNextEpisode}}
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.movie-details-container {
  background-color: #1f1f1f;
}

.back-button {
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.poster-image {
  max-width: 100%;
  border-radius: 8px;
}

.movie-info {
  margin-top: 1rem;
}

.season-section {
  border-top: 1px solid #444;
  padding-top: 1rem;
}

.episode-item {
  cursor: pointer;
}

.episode-details {
  background-color: #2a2a2a;
}

.video-player {
  width: 100%;
  height: 500px;
}

.controls .control-button {
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media only screen and (max-width: 430px) {
  .video-player {
    height: auto;
  }
}
</style>