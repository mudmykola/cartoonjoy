<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { database } from '@/firebase';
import { ref as dbRef, set, onValue } from 'firebase/database';
import axios from 'axios';
import Loader from '@/components/chat/Loader.vue';

const auth = getAuth();
const router = useRouter();
const avatars = ref([]);
const selectedAvatar = ref('');
const nickname = ref('');
const showAllAvatars = ref(false);
const isLoading = ref(true);

const loadAvatars = async () => {
  try {
    const response = await axios.get('https://api.multiavatar.com/');
    avatars.value = Array.from({length: 12}, (_, i) => `https://api.multiavatar.com/${i}.png`);
    if (avatars.value.length > 0) {
      selectedAvatar.value = avatars.value[0];
    }
  } catch (error) {
    console.error('Error fetching avatars:', error);
  }
};

const ensureUserAuthenticated = async () => {
  const user = auth.currentUser;
  if (!user) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  }
};

const checkProfileSetup = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = dbRef(database, 'users/' + user.uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        localStorage.setItem('profileSetup', 'true');
        router.push('/chat');
      } else {
        localStorage.setItem('profileSetup', 'false');
        router.push('/setup-profile');
      }
    });
  } else {
    router.push('/setup-profile');
  }
};

const setupProfile = async () => {
  await ensureUserAuthenticated();

  const user = auth.currentUser;
  if (user) {
    const userRef = dbRef(database, 'users/' + user.uid);
    try {
      await set(userRef, {
        avatar: selectedAvatar.value,
        name: nickname.value,
      });
      localStorage.setItem('profileSetup', 'true');
      router.push('/chat');
    } catch (error) {
      console.error('Error setting up profile:', error);
    }
  } else {
    router.push('/setup-profile');
  }
};

const handleAvatarClick = (avatar) => {
  selectedAvatar.value = avatar;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      selectedAvatar.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

onMounted(async () => {
  await ensureUserAuthenticated();
  await loadAvatars();

  const profileSetup = localStorage.getItem('profileSetup');
  if (profileSetup === 'true') {
    router.push('/chat');
  } else {
    checkProfileSetup();
  }

  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading">
    <Loader/>
  </div>
  <div v-else class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold mb-6 text-center">Налаштування профілю</h1>
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium">Виберіть Аватар:</label>
        <div class="flex flex-wrap space-x-2">
          <template v-for="(avatar, index) in avatars.slice(0, showAllAvatars ? avatars.length : 6)" :key="index">
            <img
                :src="avatar"
                @click="handleAvatarClick(avatar)"
                :class="{'border-4 border-red-500': selectedAvatar === avatar}"
                class="w-16 h-16 cursor-pointer rounded-full"
            />
          </template>
        </div>
        <button
            @click="showAllAvatars = !showAllAvatars"
            class="mt-2 text-sm text-blue-500 hover:underline"
        >
          {{ showAllAvatars ? 'Показати менше' : 'Показати все' }}
        </button>
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium">Нікнейм:</label>
        <input
            v-model="nickname"
            type="text"
            placeholder="Введіть свій нікнейм"
            class="border p-2 w-full rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm font-medium">Завантажте свій аватар:</label>
        <input
            type="file"
            @change="handleFileUpload"
            class="border p-2 w-full rounded bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
      </div>
      <button
          @click="setupProfile"
          class="bg-red-600 hover:bg-red-700 text-white p-2 rounded w-full font-semibold"
      >
        Save
      </button>
    </div>
  </div>
</template>