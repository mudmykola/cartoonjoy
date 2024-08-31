<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const featuredMovies = ref([]);
const searchQuery = ref("");
const sortOption = ref("newest");
const router = useRouter();

onMounted(async () => {
  await fetchMovies();
});

const fetchMovies = async () => {
  try {
    const response = await fetch("/data/cartoons.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    featuredMovies.value = data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const filteredMovies = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return featuredMovies.value.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query),
  );
});

const sortedMovies = computed(() => {
  const movies = [...filteredMovies.value];
  if (sortOption.value === "newest") {
    return movies.sort(
      (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
    );
  } else {
    return movies.sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
    );
  }
});

const navigateToMovie = (id) => {
  router.push({ name: "movie", params: { id } });
};
</script>

<template>
  <div class="home-container p-4">
    <h1 class="text-3xl font-bold mb-8">Ласкаво просимо до CartoonJoy</h1>
    <div class="search-section mb-8">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Пошук мультфільмів..."
        class="search-input w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div class="sort-section mb-8 flex justify-between items-center">
      <span class="text-lg font-medium">Сортувати за:</span>
      <select
        v-model="sortOption"
        class="border rounded-lg p-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">Найновіші</option>
        <option value="oldest">Найстаріші</option>
      </select>
    </div>
    <section class="featured-section mb-8">
      <h2 class="text-2xl font-semibold mb-4">Найкращі мультфільми</h2>
      <div
        v-if="sortedMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="movie in sortedMovies"
          :key="movie.id"
          class="movie-card bg-white p-4 border rounded-lg shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
          @click="navigateToMovie(movie.id)"
        >
          <div class="poster-wrapper mb-4">
            <img
              :src="movie.posterUrl"
              :alt="`Poster for ${movie.title}`"
              class="poster-image w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 class="movie-title text-xl font-semibold mb-2">
            {{ movie.title }}
          </h3>
          <p class="movie-description text-gray-600">{{ movie.description }}</p>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">По вашому запиту нічого не найшло.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-input {
  border-color: #ddd;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3b82f6;
}

.movie-card {
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.movie-card:hover {
  background-color: #f0f0f0;
}

.poster-wrapper {
  height: 500px;
}

.poster-image {
  object-fit: cover;
  height: 100%;
}

.movie-title,
.movie-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.5rem;
}

.movie-description {
  height: 4.5em;
}
</style>