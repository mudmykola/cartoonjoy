<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAuth } from 'firebase/auth';
import { ref as dbRef, set, onValue, remove } from 'firebase/database';
import { useRouter } from 'vue-router';
import { database } from '@/firebase';
import EmojiPicker from '@/components/chat/EmojiPicker.vue';

const auth = getAuth();
const router = useRouter();
const currentUserId = ref(null);
const messagesRef = dbRef(database, 'messages');
const newMessage = ref('');
const messages = ref([]);
const emojisVisible = ref(false);
const currentUser = ref({
  avatar: localStorage.getItem('avatar') || 'https://via.placeholder.com/40',
  name: localStorage.getItem('nickname') || 'Anonymous'
});
const replyingTo = ref(null);
const messagesContainer = ref(null);
const displayedMessages = ref([]);
const maxDisplayedMessages = ref(10);


const loadNewMessages = () => {
  const allMessages = messages.value;
  displayedMessages.value = allMessages.slice(-maxDisplayedMessages.value);
  scrollToBottom();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};


const confirmClearChat = () => {
  if (confirm("Are you sure you want to clear the chat? This action cannot be undone.")) {
    clearChat();
  }
};

const clearChat = async () => {
  try {
    await remove(messagesRef);
    messages.value = [];
  } catch (error) {
    console.error("Error clearing chat:", error);
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
      messages.value = Object.keys(data).map(key => ({
        ...data[key],
        timestamp: parseInt(key)
      }));
      loadNewMessages();
    }
  });


  scrollToBottom();
});

watch(messages, () => {
  loadNewMessages();
});

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const timestamp = Date.now();
    set(dbRef(database, 'messages/' + timestamp), {
      text: newMessage.value,
      timestamp: timestamp,
      user: currentUser.value,
      replyTo: replyingTo.value
    }).then(() => {
      newMessage.value = '';
      replyingTo.value = null;
    }).catch(error => {
      console.error("Error sending message:", error);
    });
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
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
  newMessage.value = `@${message.user.name} ${message.text}`;
  replyingTo.value = message;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
</script>

<template>
  <div class="messages-container flex flex-col h-full p-4 bg-gray-100 relative">
    <button
        @click="confirmClearChat"
        class="bg-red-600 text-white p-2 rounded-lg mb-4 shadow-lg hover:bg-red-700 transition-colors"
    >
      Очистити чат
    </button>
    <div ref="messagesContainer"
         class="flex-1 overflow-y-auto p-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[calc(100vh-200px)]">
      <div v-for="message in displayedMessages" :key="message.timestamp" class="flex items-start mb-4">
        <img :src="message.user?.avatar || 'https://via.placeholder.com/40'" alt="avatar"
             class="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"/>
        <div :class="[
            'flex flex-col p-4 rounded-lg max-w-[70%] shadow-md relative',
            message.replyTo ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-gray-50'
          ]">
          <div class="flex items-center mb-2">
            <strong class="text-gray-800 text-lg">{{ message.user?.name || 'Anonymous' }}</strong>
          </div>
          <p class="text-gray-700 whitespace-pre-wrap">
            <span v-if="message.replyTo" class="text-gray-600 italic block mb-2">Відповідає на {{
                message.replyTo.user.name
              }}: "{{ message.replyTo.text }}"</span>
            {{ message.text }}
          </p>
          <div class="flex items-center mt-2 text-gray-500 text-sm">
            <span>{{ formatDate(message.timestamp) }}</span>
            <button v-if="!message.replyTo" @click="replyMessage(message)" class="ml-4 text-blue-500 hover:underline">
              Відповісти
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="emojisVisible" class="absolute bottom-16 right-4 z-20">
      <EmojiPicker @emoji-select="handleEmojiSelect"/>
    </div>
    <div class="flex items-center mt-4">
      <input
          id="message-input"
          type="text"
          v-model="newMessage"
          @keypress="handleKeyPress"
          placeholder="Введіть повідомлення..."
          class="flex-1 border border-gray-300 p-2 rounded-l-lg bg-white text-gray-800 placeholder-gray-500 shadow-sm"
      />
      <button @click="toggleEmojiPicker" class="bg-gray-200 p-2 rounded-r-lg text-gray-600">
        😊
      </button>
      <button @click="sendMessage"
              class="bg-red-600 text-white p-2 rounded-lg ml-2 shadow-lg hover:bg-red-700 transition-colors">Надіслати
      </button>
    </div>
  </div>
</template>

<style scoped>
.messages-container {
  max-height: 500px;
  height: 100vh;
  overflow-y: auto;
}
</style>