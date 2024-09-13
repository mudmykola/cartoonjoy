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
  if (
    confirm(
      'Are you sure you want to clear the chat? This action cannot be undone.'
    )
  ) {
    clearChat();
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
  newMessage.value = `@${message.user.name} ${message.text}`;
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
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
    >
      <div
        v-for="message in displayedMessages"
        :key="message.timestamp"
        :class="[
          'flex items-start mb-4',
          message.user.id === currentUserId.value
            ? 'justify-end'
            : 'justify-start',
        ]"
      >
        <img
          :src="message.user?.avatar || 'https://via.placeholder.com/40'"
          alt="avatar"
          class="w-10 h-10 rounded-full mr-4 border-2 border-gray-700"
        />
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
              class="text-gray-400 italic block mb-2"
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
      </div>
      <div v-if="typingUsers.length" class="text-gray-400 italic mb-4">
        <span v-for="(user, index) in typingUsers" :key="user.id">
          {{ user.name }}{{ index < typingUsers.length - 1 ? ', ' : '' }}
        </span>
        друкує...
      </div>
    </div>
    <div v-if="emojisVisible" class="absolute bottom-16 right-4 z-20">
      <EmojiPicker @emoji-select="handleEmojiSelect" />
    </div>
    <div
      class="flex items-center justify-between border-t border-gray-700 bg-gray-800 p-2"
    >
      <button
        @click="toggleEmojiPicker"
        class="bg-gray-700 p-2 rounded-lg text-gray-300 mr-2 hover:bg-gray-600"
      >
        😊
      </button>
      <input
        id="message-input"
        type="text"
        v-model="newMessage"
        @keypress="handleKeyPress"
        placeholder="Введіть повідомлення..."
        class="flex-1 border border-gray-700 bg-gray-900 p-2 rounded-lg text-white"
      />
      <button
        @click="sendMessage"
        class="bg-blue-600 text-white p-2 rounded-lg ml-2 flex-shrink-0 hover:bg-blue-500"
      >
        <IconSend />
      </button>
    </div>
  </div>
</template>
