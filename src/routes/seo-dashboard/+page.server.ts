import { seoAutomation } from '$lib/utils/colorado-seo-automation';
import { fail } from '@sveltejs/kit';

export const actions = {
    generateContent: async () => {
        try {
            const status = await seoAutomation.runFullSiteGeneration();
            return { success: true, status, message: 'Content generation completed successfully.' };
        } catch (error: any) {
            return fail(500, { success: false, message: error.message });
        }
    },

    triggerIndexing: async () => {
        try {
            const status = await seoAutomation.triggerBulkIndexing();
            return { success: true, status, message: 'Bulk indexing triggered successfully.' };
        } catch (error: any) {
            return fail(500, { success: false, message: error.message });
        }
    }
};

export async function load() {
    return {
        automationStatus: seoAutomation.getStatus()
    };
}
