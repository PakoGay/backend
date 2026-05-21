import { getAxiosInstance } from '@/config/axios';
import { GamificationStats, StreakLog, Achievement } from '@/types/entities';

export const gamificationApi = {
  getStats: async (childId: string) => {
    const response = await getAxiosInstance().get<GamificationStats>(`/gamification/${childId}/stats`);
    return response.data;
  },

  getStreakLog: async (childId: string) => {
    const response = await getAxiosInstance().get<StreakLog>(`/gamification/${childId}/streak`);
    return response.data;
  },

  updateStreak: async (childId: string) => {
    const response = await getAxiosInstance().post(`/gamification/${childId}/streak/update`);
    return response.data;
  },

  getAchievements: async (childId: string) => {
    const response = await getAxiosInstance().get<Achievement[]>(`/gamification/${childId}/achievements`);
    return response.data;
  },

  unlockAchievement: async (childId: string, achievementId: string) => {
    const response = await getAxiosInstance().post(`/gamification/${childId}/achievements/${achievementId}/unlock`);
    return response.data;
  },

  getLeaderboard: async (limit: number = 10) => {
    const response = await getAxiosInstance().get('/gamification/leaderboard', { params: { limit } });
    return response.data;
  },
};

