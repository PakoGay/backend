const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export function getToken() {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function saveTokens(tokens) {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(tokens.user));
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export function getSavedUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed: ${response.status}`);
  }

  return data;
}

export const api = {
  login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),

  register: (name, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }),

  logout: () =>
      request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: getRefreshToken() })
      }),

  me: () => request('/parents/me'),

  getChildren: () => request('/children?page=0&page_size=50'),

  createChild: (child) =>
      request('/children', {
        method: 'POST',
        body: JSON.stringify(child)
      }),

  updateChild: (childId, child) =>
      request(`/children/${childId}`, {
        method: 'PUT',
        body: JSON.stringify(child)
      }),

  deleteChild: (childId) =>
      request(`/children/${childId}`, {
        method: 'DELETE'
      }),

  getProgress: (childId) =>
      request(`/children/${childId}/progress?page=0&page_size=10`),

  getBadges: (childId) =>
      request(`/children/${childId}/badges?page=0&page_size=10`),

  getUnits: () => request('/units'),

  getLessons: (unitId) =>
      request(`/lessons?unitId=${unitId}&page=0&page_size=50&sort=sortOrder`),

  createLesson: (lesson) =>
      request('/lessons', {
        method: 'POST',
        body: JSON.stringify(lesson)
      }),

  getExercises: (lessonId) =>
      request(`/lessons/${lessonId}/exercises?page=0&page_size=50`),

  createExercise: (lessonId, exercise) =>
      request(`/lessons/${lessonId}/exercises`, {
        method: 'POST',
        body: JSON.stringify(exercise)
      }),

  submitExercise: (exerciseId, childId, answer, timeTakenSeconds = 30) =>
      request(`/exercises/${exerciseId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ childId, answer, timeTakenSeconds })
      }),

  completeLesson: (lessonId, childId, durationSeconds = 90) =>
      request(`/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ childId, accuracy: 1, durationSeconds })
      }),

  getNotifications: () =>
      request('/notifications?page=0&page_size=10'),

  markNotificationRead: (id) =>
      request(`/notifications/${id}/read`, {
        method: 'PATCH'
      })
};