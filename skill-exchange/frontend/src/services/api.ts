const API_URL = '/api';

// Helper function for making API requests
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...(options.headers as Record<string, string>) },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// Auth API
export const authApi = {
    register: (data: { name: string; email: string; password: string; bio?: string }) =>
        fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getMe: () => fetchApi('/auth/me'),

    updateDetails: (data: Partial<{ name: string; bio: string; avatar: string; skillsOffered: string[]; skillsWanted: string[] }>) =>
        fetchApi('/auth/updatedetails', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    logout: () => fetchApi('/auth/logout'),
};

// Users API
export const usersApi = {
    getAll: (params?: { search?: string; skill?: string; page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchApi(`/users?${searchParams.toString()}`);
    },

    getById: (id: string) => fetchApi(`/users/${id}`),

    getStats: (id: string) => fetchApi(`/users/${id}/stats`),

    getLeaderboard: (limit?: number) =>
        fetchApi(`/users/leaderboard${limit ? `?limit=${limit}` : ''}`),
};

// Skills API
export const skillsApi = {
    getAll: (params?: Record<string, string | number | undefined>) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchApi(`/skills?${searchParams.toString()}`);
    },

    getById: (id: string) => fetchApi(`/skills/${id}`),

    create: (data: {
        title: string;
        description: string;
        category: string;
        pointsCost: number;
        duration: number;
        level?: string;
        tags?: string[];
    }) =>
        fetchApi('/skills', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: Partial<{
        title: string;
        description: string;
        category: string;
        pointsCost: number;
        duration: number;
        level: string;
        tags: string[];
        isActive: boolean;
    }>) =>
        fetchApi(`/skills/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi(`/skills/${id}`, {
            method: 'DELETE',
        }),

    getByTeacher: (teacherId: string) => fetchApi(`/skills/teacher/${teacherId}`),

    getMy: () => fetchApi('/skills/my'),

    getCategories: () => fetchApi('/skills/categories'),
};

// Sessions API
export const sessionsApi = {
    getAll: (params?: { status?: string; role?: string; page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchApi(`/sessions?${searchParams.toString()}`);
    },

    getById: (id: string) => fetchApi(`/sessions/${id}`),

    create: (data: { skillId: string; scheduledAt: string; notes?: string }) =>
        fetchApi('/sessions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: { status?: string; meetingLink?: string; cancellationReason?: string }) =>
        fetchApi(`/sessions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    getUpcoming: () => fetchApi('/sessions/upcoming'),

    getStats: () => fetchApi('/sessions/stats'),
};

// Ratings API
export const ratingsApi = {
    create: (data: { sessionId: string; rating: number; review?: string }) =>
        fetchApi('/ratings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getForUser: (userId: string, params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchApi(`/ratings/user/${userId}?${searchParams.toString()}`);
    },

    getForSkill: (skillId: string, params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchApi(`/ratings/skill/${skillId}?${searchParams.toString()}`);
    },

    checkCanRate: (sessionId: string) => fetchApi(`/ratings/check/${sessionId}`),
};

// Messages API
export const messagesApi = {
    getConversations: () => fetchApi('/messages/conversations'),

    getMessages: (userId: string, params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) searchParams.append(key, String(value));
            });
        }
        return fetchApi(`/messages/${userId}?${searchParams.toString()}`);
    },

    send: (data: { receiverId: string; content: string }) =>
        fetchApi('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getUnreadCount: () => fetchApi('/messages/unread/count'),

    markAsRead: (userId: string) =>
        fetchApi(`/messages/read/${userId}`, {
            method: 'PUT',
        }),

    clearChat: (userId: string) =>
        fetchApi(`/messages/clear/${userId}`, {
            method: 'DELETE',
        }),
};

export default {
    auth: authApi,
    users: usersApi,
    skills: skillsApi,
    sessions: sessionsApi,
    ratings: ratingsApi,
    messages: messagesApi,
};
