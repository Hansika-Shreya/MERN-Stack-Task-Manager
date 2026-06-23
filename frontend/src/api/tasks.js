import API from './axios';

export const getTasks = (params) => API.get('/tasks', { params });
export const getStats = () => API.get('/tasks/stats/summary');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const toggleTask = (id) => API.patch(`/tasks/${id}/toggle`);
export const deleteCompletedTasks = () => API.delete('/tasks/completed');