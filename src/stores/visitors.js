import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVisitorsStore = defineStore('visitors', () => {
    const currentVisitors = ref(0);

    const updateVisitorsCount = () => {
        const storedCount = sessionStorage.getItem('visitorsCount') || 0;
        sessionStorage.setItem('visitorsCount', parseInt(storedCount) + 1);
        currentVisitors.value = parseInt(storedCount) + 1;
    };

    const decreaseVisitorsCount = () => {
        const storedCount = sessionStorage.getItem('visitorsCount') || 0;
        if (storedCount > 0) {
            sessionStorage.setItem('visitorsCount', storedCount - 1);
            currentVisitors.value = storedCount - 1;
        }
    };

    return {
        currentVisitors,
        updateVisitorsCount,
        decreaseVisitorsCount,
    };
});