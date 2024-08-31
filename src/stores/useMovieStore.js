import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMovieStore = defineStore('movie', () => {
  const movie = ref(null);
  const selectedSeason = ref(null);
  const currentEpisode = ref(null);

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch('/data/cartoons.json');
      const data = await response.json();
      movie.value = data.find((m) => m.id === movieId) || null;

      currentEpisode.value = null;
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const selectEpisode = (episode) => {
    currentEpisode.value = currentEpisode.value === episode ? null : episode;
  };

  const playNextEpisode = (season) => {
    const currentEpisodeIndex = season.episodes.findIndex(
      (e) => e === currentEpisode.value
    );
    if (
      currentEpisodeIndex >= 0 &&
      currentEpisodeIndex < season.episodes.length - 1
    ) {
      const nextEpisode = season.episodes[currentEpisodeIndex + 1];
      currentEpisode.value = nextEpisode;
    }
  };

  const playPreviousEpisode = (season) => {
    const currentEpisodeIndex = season.episodes.findIndex(
      (e) => e === currentEpisode.value
    );
    if (currentEpisodeIndex > 0) {
      const prevEpisode = season.episodes[currentEpisodeIndex - 1];
      currentEpisode.value = prevEpisode;
    }
  };

  const toggleSeason = (seasonNumber) => {
    selectedSeason.value =
      selectedSeason.value === seasonNumber ? null : seasonNumber;
  };

  const resetCurrentEpisode = () => {
    currentEpisode.value = null;
  };

  return {
    movie,
    selectedSeason,
    currentEpisode,
    fetchMovieDetails,
    selectEpisode,
    playNextEpisode,
    playPreviousEpisode,
    toggleSeason,
    resetCurrentEpisode,
  };
});
