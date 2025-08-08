import axios from 'axios';
import type { BulletEntry, CreateEntryRequest, UpdateEntryRequest, StreakResponse, AIInsight } from '../types/api';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const entriesApi = {
  // Get all entries
  getEntries: async (): Promise<BulletEntry[]> => {
    const response = await api.get('/entries');
    return response.data;
  },

  // Get specific entry
  getEntry: async (id: number): Promise<BulletEntry> => {
    const response = await api.get(`/entries/${id}`);
    return response.data;
  },

  // Create new entry
  createEntry: async (data: CreateEntryRequest): Promise<BulletEntry> => {
    const response = await api.post('/entries', data);
    return response.data;
  },

  // Update entry
  updateEntry: async (id: number, data: UpdateEntryRequest): Promise<BulletEntry> => {
    const response = await api.put(`/entries/${id}`, data);
    return response.data;
  },

  // Delete entry
  deleteEntry: async (id: number): Promise<void> => {
    await api.delete(`/entries/${id}`);
  },

  // Get entry insight
  getInsight: async (id: number): Promise<AIInsight> => {
    const response = await api.get(`/entries/${id}/insight`);
    return response.data;
  },
};

export const streakApi = {
  // Get current streak
  getStreak: async (): Promise<StreakResponse> => {
    const response = await api.get('/streak');
    return response.data;
  },
};

export default api;
