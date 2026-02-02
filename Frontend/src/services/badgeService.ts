import api from './api';

interface Badge {
    _id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
    xpReward: number;
    earned?: boolean;
    eligible?: boolean;
    earnedAt?: string;
}

class BadgeService {
    /**
     * Get all badges
     */
    async getAllBadges(category?: string, rarity?: string) {
        const params: any = {};
        if (category) params.category = category;
        if (rarity) params.rarity = rarity;

        const response = await api.get('/badges', { params });
        return response.data;
    }

    /**
     * Get user badges
     */
    async getUserBadges() {
        const response = await api.get('/badges/my-badges');
        return response.data;
    }

    /**
     * Get available badges with eligibility
     */
    async getAvailableBadges() {
        const response = await api.get('/badges/available');
        return response.data;
    }

    /**
     * Check and award eligible badges
     */
    async checkEligibility() {
        const response = await api.post('/badges/check-eligibility');
        return response.data;
    }

    /**
     * Get badge by ID
     */
    async getBadgeById(id: string) {
        const response = await api.get(`/badges/${id}`);
        return response.data;
    }
}

export default new BadgeService();
