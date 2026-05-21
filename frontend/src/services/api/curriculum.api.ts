import { getAxiosInstance } from '@/config/axios';
import { Curriculum, Lesson, Exercise, ExerciseSubmission } from '@/types/entities';

export const curriculumApi = {
  getCurriculums: async (childId?: string) => {
    const params = childId ? { childId } : {};
    const response = await getAxiosInstance().get<Curriculum[]>('/curriculum', { params });
    return response.data;
  },

  getCurriculumById: async (id: string) => {
    const response = await getAxiosInstance().get<Curriculum>(`/curriculum/${id}`);
    return response.data;
  },

  getLessons: async (curriculumId: string) => {
    const response = await getAxiosInstance().get<Lesson[]>(`/curriculum/${curriculumId}/lessons`);
    return response.data;
  },

  getLessonById: async (lessonId: string) => {
    const response = await getAxiosInstance().get<Lesson>(`/lessons/${lessonId}`);
    return response.data;
  },

  getExercises: async (lessonId: string) => {
    const response = await getAxiosInstance().get<Exercise[]>(`/lessons/${lessonId}/exercises`);
    return response.data;
  },

  submitExercise: async (exerciseId: string, childId: string, answer: string) => {
    const response = await getAxiosInstance().post<ExerciseSubmission>(`/exercises/${exerciseId}/submit`, {
      childId,
      answer,
    });
    return response.data;
  },

  completeLessonAsync: (lessonId: string, childId: string) => {
    return getAxiosInstance().post(`/lessons/${lessonId}/complete`, { childId });
  },
};

