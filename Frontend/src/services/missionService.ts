import api from './api';

interface Mission {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    topics: string[];
    duration: number;
    xpReward: number;
    isLocked?: boolean;
    progress?: number;
    isCompleted?: boolean;
    status?: string;
}

interface MissionSubmission {
    userCode?: string;
    testResults?: Array<{
        testCase: number;
        passed: boolean;
    }>;
    passed?: boolean;
    timeSpent?: number;
}

class MissionService {
    /**
     * Get all missions
     */
    async getAllMissions(category?: string, difficulty?: string) {
        const params: any = {};
        if (category) params.category = category;
        if (difficulty) params.difficulty = difficulty;

        const response = await api.get('/missions', { params });
        return response.data;
    }

    /**
     * Get user missions with progress
     */
    async getUserMissions() {
        const response = await api.get('/missions/my-missions');
        return response.data;
    }

    /**
     * Get mission by ID
     */
    async getMissionById(id: string) {
        const response = await api.get(`/missions/${id}`);
        return response.data;
    }

    /**
     * Get missions by category
     */
    async getMissionsByCategory(category: string) {
        const response = await api.get(`/missions/category/${category}`);
        return response.data;
    }

    /**
     * Start a mission
     */
    async startMission(id: string) {
        const response = await api.post(`/missions/${id}/start`);
        return response.data;
    }

    /**
     * Submit mission
     */
    async submitMission(id: string, submission: MissionSubmission) {
        const response = await api.post(`/missions/${id}/submit`, submission);
        return response.data;
    }
}

export default new MissionService();
