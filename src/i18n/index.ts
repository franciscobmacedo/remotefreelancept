import { computed } from 'vue';
import { useComparisonStore } from '@/store/comparison';
import { translations } from './translations';

/**
 * Composable global para traduções
 * Uso: const { t } = useI18n();
 */
export function useI18n() {
    const comparisonStore = useComparisonStore();

    const t = computed(() => translations[comparisonStore.language]);

    const setLanguage = (lang: 'pt' | 'en') => {
        comparisonStore.setLanguage(lang);
    };

    const currentLanguage = computed(() => comparisonStore.language);

    return {
        t,
        setLanguage,
        currentLanguage,
    };
}
