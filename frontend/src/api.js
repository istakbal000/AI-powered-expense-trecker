import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// User APIs
export const registerUser = (data) => api.post('/user/register', data);
export const loginUser = (data) => api.post('/user/login', data);
export const logoutUser = () => api.post('/user/logout');

// Expense APIs
export const addExpense = (data) => api.post('/expence/addexpence', data);
export const getAllExpenses = (params) => api.get('/expence/getallexpence', { params });
export const updateExpense = (id, data) => api.put(`/expence/updateexpence/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expence/deleteexpence/${id}`);
export const markExpenseDone = (id, done) => api.put(`/expence/markasdone/${id}`, { done });

// AI APIs
export const getAIInsights = (expenses) => api.post('/ai/insights', { expenses });
export const getBudgetSuggestions = (data) => api.post('/ai/budget-suggestions', data);
export const analyzeExpense = (data) => api.post('/ai/analyze-expense', data);
