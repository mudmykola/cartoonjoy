<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { getAuth } from 'firebase/auth';
import { ref as dbRef, set, onValue, remove, update } from 'firebase/database';
import { useRouter } from 'vue-router';
import { database } from '@/firebase';
import EmojiPicker from '@/components/chat/EmojiPicker.vue';
import IconSend from '@/components/icons/IconSend.vue';

const auth = getAuth();
const router = useRouter();
const currentUserId = ref(null);
const messagesRef = dbRef(database, 'messages');
const typingStatusRef = dbRef(database, 'typingStatus');
const newMessage = ref('');
const messages = ref([]);
const emojisVisible = ref(false);
const currentUser = ref({
  avatar: localStorage.getItem('avatar') || 'https://via.placeholder.com/40',
  name: localStorage.getItem('nickname') || 'Anonymous',
});
const replyingTo = ref(null);
const messagesContainer = ref(null);
const displayedMessages = ref([]);
const maxDisplayedMessages = ref(10);
const isMobile = ref(window.innerWidth < 768);
const typingUsers = ref([]);
const showPasswordPrompt = ref(false);
const passwordInput = ref('');

const loadNewMessages = () => {
  const allMessages = messages.value;
  displayedMessages.value = allMessages.slice(-maxDisplayedMessages.value);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const confirmClearChat = () => {
  showPasswordPrompt.value = true;
};

const handlePasswordSubmit = () => {
  if (passwordInput.value === import.meta.env.VITE_CHAT_CLEAR_PASSWORD) {
    clearChat();
    showPasswordPrompt.value = false;
    passwordInput.value = '';
  } else {
    alert('Невірний пароль!');
  }
};

const clearChat = async () => {
  try {
    await remove(messagesRef);
    messages.value = [];
  } catch (error) {
    console.error('Error clearing chat:', error);
  }
};

onMounted(() => {
  if (auth.currentUser) {
    currentUserId.value = auth.currentUser.uid;
    const userRef = dbRef(database, 'users/' + currentUserId.value);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        currentUser.value = data;
        localStorage.setItem('avatar', data.avatar);
        localStorage.setItem('nickname', data.name);
      } else {
        router.push('/setup-profile');
      }
    });
  } else {
    router.push('/setup-profile');
  }

  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      messages.value = Object.keys(data).map((key) => ({
        ...data[key],
        timestamp: parseInt(key),
      }));
      loadNewMessages();
      scrollToBottom();
    }
  });

  onValue(typingStatusRef, (snapshot) => {
    const data = snapshot.val() || {};
    typingUsers.value = Object.values(data).filter(
      (user) => user.id !== currentUserId.value
    );
  });
});

watch(messages, () => {
  loadNewMessages();
  scrollToBottom();
});

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    try {
      const timestamp = Date.now();
      await set(dbRef(database, 'messages/' + timestamp), {
        text: newMessage.value,
        timestamp: timestamp,
        user: currentUser.value,
        replyTo: replyingTo.value,
      });
      newMessage.value = '';
      replyingTo.value = null;
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  stopTyping();
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const handleEmojiSelect = (emoji) => {
  newMessage.value += emoji;
  emojisVisible.value = false;
};

const toggleEmojiPicker = () => {
  emojisVisible.value = !emojisVisible.value;
};

const replyMessage = (message) => {
  newMessage.value = `@${message.user.name} `;
  replyingTo.value = message;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const startTyping = async () => {
  await update(dbRef(database, `typingStatus/${currentUserId.value}`), {
    id: currentUserId.value,
    name: currentUser.value.name,
  });
};

const stopTyping = async () => {
  await remove(dbRef(database, `typingStatus/${currentUserId.value}`));
};

watch(newMessage, (newVal) => {
  if (newVal) {
    startTyping();
  } else {
    stopTyping();
  }
});

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768;
});

onBeforeUnmount(() => {
  stopTyping();
});
</script>

<template>
  <div class="relative flex flex-col h-screen p-4 bg-gray-900 text-white">
    <button
      @click="confirmClearChat"
      class="bg-red-600 text-white p-2 rounded-lg mb-4 shadow-md hover:bg-red-700 transition-colors w-full md:w-auto"
    >
      Очистити чат
    </button>
    <div
      v-if="showPasswordPrompt"
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
    >
      <div class="bg-gray-900 p-4 rounded-lg shadow-lg">
        <p class="text-white mb-4">Введіть пароль для підтвердження:</p>
        <input
          v-model="passwordInput"
          type="password"
          placeholder="Пароль"
          class="border border-gray-700 bg-gray-800 text-white p-2 rounded-lg w-full mb-4"
        />
        <div class="flex justify-end">
          <button
            @click="handlePasswordSubmit"
            class="bg-blue-600 text-white p-2 rounded-lg mr-2 hover:bg-blue-500"
          >
            Підтвердити
          </button>
          <button
            @click="showPasswordPrompt = false"
            class="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-500"
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
    >
      <div
        v-for="message in displayedMessages"
        :key="message.timestamp"
        class="flex mb-4"
        :class="{
          'justify-end': message.user.id === currentUserId.value,
          'justify-start': message.user.id !== currentUserId.value,
        }"
      >
        <div
          :class="[
            'flex flex-col p-4 rounded-lg max-w-[75%] relative',
            message.user.id === currentUserId.value
              ? 'bg-blue-600'
              : 'bg-gray-700',
            message.replyTo ? 'border-l-4 border-yellow-500' : '',
          ]"
        >
          <div class="flex items-center mb-2">
            <strong class="text-gray-100 text-lg">
              {{ message.user?.name || 'Anonymous' }}
            </strong>
          </div>
          <p class="text-gray-300 whitespace-pre-wrap">
            <span
              v-if="message.replyTo"
              class="block mb-2 p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md"
            >
              Відповідає на {{ message.replyTo.user.name }}: "{{
                message.replyTo.text
              }}"
            </span>
            {{ message.text }}
          </p>
          <div class="flex items-center mt-2 text-gray-500 text-sm">
            <span>{{ formatDate(message.timestamp) }}</span>
            <button
              v-if="!message.replyTo"
              @click="replyMessage(message)"
              class="ml-4 text-blue-400 hover:underline"
            >
              Відповісти
            </button>
          </div>
        </div>
        <img
          v-if="message.user.id !== currentUserId.value"
          :src="message.user?.avatar || 'https://via.placeholder.com/40'"
          alt="avatar"
          class="w-10 h-10 rounded-full ml-4 border-2 border-gray-700"
        />
        <img
          v-if="message.user.id === currentUserId.value"
          :src="message.user?.avatar || 'https://via.placeholder.com/40'"
          alt="avatar"
          class="w-10 h-10 rounded-full mr-4 border-2 border-gray-700"
        />
      </div>

      <div v-if="typingUsers.length" class="text-gray-400 italic mb-4">
        <span v-for="(user, index) in typingUsers" :key="index">
          {{ user.name }}{{ index < typingUsers.length - 1 ? ', ' : '' }}
        </span>
        {{ typingUsers.length > 1 ? 'пишуть...' : 'пише...' }}
      </div>
    </div>

    <div class="flex items-center mt-4">
      <button
        @click="toggleEmojiPicker"
        class="p-2 bg-gray-700 text-white rounded-lg mr-2 hover:bg-gray-600"
      >
        😊
      </button>
      <input
        v-model="newMessage"
        @keydown="handleKeyPress"
        @focus="startTyping"
        @blur="stopTyping"
        type="text"
        placeholder="Ваше повідомлення..."
        class="flex-1 p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
      />
      <button
        @click="sendMessage"
        class="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        <IconSend class="w-6 h-6" />
      </button>
    </div>

    <EmojiPicker v-if="emojisVisible" @select="handleEmojiSelect" />
  </div>
</template>
