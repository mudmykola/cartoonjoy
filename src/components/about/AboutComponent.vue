<script setup>
import { ref } from 'vue';

const mission = ref('На CartoonJoy ми створюємо та пропонуємо найкращий контент для дітей, щоб забезпечити розваги та навчання в цікавій і захоплюючій формі. Наші мультфільми та шоу розроблені, щоб надихати уяву та підтримувати розвиток дітей.');

const teamMembers = ref([
  {
    id: 1,
    image: 'https://media.licdn.com/dms/image/v2/D4E03AQFGRKoyoucwFw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1682867375530?e=1729123200&v=beta&t=BxKym7Wnko7-2pXsrPgcG_16qiVLwof0zMhI_DCAefU',
    name: 'Микола Мудь',
    role: 'Front-end Developer Vue'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150',
    name: 'Ім\'я Прізвище 2',
    role: 'Роль у команді 2'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150',
    name: 'Ім\'я Прізвище 3',
    role: 'Роль у команді 3'
  }
]);
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="bg-gray-800 py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">Про нас</h1>
      </div>
    </div>

    <div class="py-12">
      <div class="container mx-auto px-4">
        <section class="mb-12">
          <h2 class="text-3xl font-semibold mb-4">Наше призначення</h2>
          <p class="text-lg leading-relaxed">
            {{ mission }}
          </p>
        </section>

        <section>
          <h2 class="text-3xl font-semibold mb-4">Наша команда</h2>
          <div class="flex flex-wrap -mx-4">
            <div v-for="member in teamMembers" :key="member.id" class="w-full md:w-1/3 px-4 mb-8">
              <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <img :src="member.image" alt="Team Member" class="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-600">
                <h3 class="text-xl font-semibold mb-2 text-center">{{ member.name }}</h3>
                <p class="text-gray-400 text-center">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>