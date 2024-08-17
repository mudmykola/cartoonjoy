<script setup>
import { ref } from 'vue';
import IntroComponent from './ParentsIntroComponent.vue';
import UsageTipsComponent from './ParentsUsageTipsComponent.vue';
import InternetSafetyComponent from './ParentsInternetSafetyComponent.vue';
import EducationalContentComponent from './ParentsEducationalContentComponent.vue';
import ParentResourcesComponent from './ParentResourcesComponent.vue';
import ContactInfoComponent from './ParentsContactInfoComponent.vue';

const sections = ref([
  {
    title: "Вступний текст",
    content: "Ласкаво просимо на сторінку для батьків! Ми прагнемо зробити наш сайт не лише цікавим та захоплюючим для дітей, але й корисним для батьків. Тут ви знайдете поради та рекомендації щодо використання нашого сайту, а також інформацію про те, як забезпечити безпеку ваших дітей в Інтернеті.",
    type: 'text'
  },
  {
    title: "Рекомендації щодо використання сайту",
    content: [
      "Переглядайте мультфільми разом з дітьми, щоб бути впевненими в їхній якості.",
      "Встановіть обмеження часу на перегляд мультфільмів, щоб забезпечити здоровий баланс між розвагами та іншими активностями.",
      "Скористайтеся нашими освітніми матеріалами, щоб поєднувати розваги з навчанням."
    ],
    type: 'list'
  },
  {
    title: "Безпека в Інтернеті",
    content: [
      "Навчіть дітей не розголошувати особисту інформацію в Інтернеті.",
      "Використовуйте функції батьківського контролю на ваших пристроях.",
      "Регулярно перевіряйте, які сайти відвідують ваші діти та які додатки вони використовують."
    ],
    type: 'list'
  },
  {
    title: "Освітній контент",
    content: "Ми пропонуємо різноманітний освітній контент, який допоможе вашим дітям розвиватися та вивчати нові речі в ігровій формі. Відвідайте наш розділ з освітніми відео та матеріалами, щоб дізнатися більше.",
    type: 'text'
  },
  {
    title: "Ресурси для батьків",
    content: [
      "<a href='#' class='text-blue-400 hover:underline'>Посилання на статті та поради щодо виховання дітей</a>",
      "<a href='#' class='text-blue-400 hover:underline'>Корисні ресурси для підтримки освітнього процесу</a>"
    ],
    type: 'list'
  },
  {
    title: "Контактна інформація",
    content: "Якщо у вас виникли питання або пропозиції, зв'яжіться з нами через <a href='/contact' class='text-yellow-300 hover:underline'>форму зворотного зв'язку</a>.",
    type: 'text'
  }
]);
</script>

<template>
  <div class="parents-page-container p-6 lg:p-12 max-w-screen-lg mx-auto bg-gray-900 text-white">
    <h1 class="text-3xl lg:text-4xl font-bold mb-8 text-center text-red-500">Для батьків</h1>
    <IntroComponent :content="sections[0].content" />
    <UsageTipsComponent :content="sections[1].content" />
    <InternetSafetyComponent :content="sections[2].content" />
    <EducationalContentComponent :content="sections[3].content" />
    <ParentResourcesComponent :content="sections[4].content" />
    <ContactInfoComponent :content="sections[5].content" />
  </div>
</template>