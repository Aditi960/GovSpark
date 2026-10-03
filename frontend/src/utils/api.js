const rawApiUrl = import.meta.env.VITE_API_URL ?? '';

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
