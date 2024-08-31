import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref([]);

  onMounted(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      favorites.value = JSON.parse(storedFavorites);
    }
  });

  const addFavorite = (movie) => {
    if (!favorites.value.some((fav) => fav.id === movie.id)) {
      favorites.value.push(movie);
      saveFavorites();
    }
  };

  const removeFavorite = (movieId) => {
    favorites.value = favorites.value.filter((fav) => fav.id !== movieId);
    saveFavorites();
  };

  const isFavorite = (movieId) => {
    return favorites.value.some((fav) => fav.id === movieId);
  };

  const saveFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
