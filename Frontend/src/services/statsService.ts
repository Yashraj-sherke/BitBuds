import api from './api';

interface UserStats {
    totalXP: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    missionsCompleted: number;
    badges: any[];
    categoryProgress: any;
    achievements: any;
}

class StatsService {
    /**
     * Get current user stats
     */
    async getMyStats() {
        const response = await api.get('/stats/me');
        return response.data;
    }

    /**
     * Get dashboard data
     */
    async getDashboard() {
        const response = await api.get('/stats/dashboard');
        return response.data;
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(limit = 10, page = 1) {
        const response = await api.get('/stats/leaderboard', {
            params: { limit, page },
        });
        return response.data;
    }

    /**
     * Get user rank
     */
    async getMyRank() {
        const response = await api.get('/stats/rank');
        return response.data;
    }

    /**
     * Get category progress
     */
    async getCategoryProgress() {
        const response = await api.get('/stats/category-progress');
        return response.data;
    }

    /**
     * Get achievements
     */
    async getAchievements() {
        const response = await api.get('/stats/achievements');
        return response.data;
    }

    /**
     * Get activity timeline
     */
    async getActivity(limit = 20) {
        const response = await api.get('/stats/activity', {
            params: { limit },
        });
        return response.data;
    }

    /**
     * Get global statistics
     */
    async getGlobalStats() {
        const response = await api.get('/stats/global');
        return response.data;
    }

    /**
     * Update streak
     */
    async updateStreak() {
        const response = await api.post('/stats/streak');
        return response.data;
    }
}

export default new StatsService();
