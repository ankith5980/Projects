// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    points: number;
    averageRating: number;
    totalRatings: number;
    totalSessionsAsTeacher: number;
    totalSessionsAsStudent: number;
    isOnline?: boolean;
    lastSeen?: string;
    createdAt: string;
}

// Skill types
export interface Skill {
    _id: string;
    title: string;
    description: string;
    category: SkillCategory;
    teacher: User | string;
    pointsCost: number;
    duration: number;
    level: SkillLevel;
    availability?: Availability[];
    tags: string[];
    isActive: boolean;
    totalBookings: number;
    averageRating: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
}

export type SkillCategory =
    | 'Programming'
    | 'Design'
    | 'Marketing'
    | 'Music'
    | 'Languages'
    | 'Business'
    | 'Photography'
    | 'Writing'
    | 'Fitness'
    | 'Cooking'
    | 'Arts & Crafts'
    | 'Finance'
    | 'Science'
    | 'Other';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Availability {
    day: string;
    startTime: string;
    endTime: string;
}

// Session types
export interface Session {
    _id: string;
    skill: Skill | string;
    teacher: User | string;
    student: User | string;
    scheduledAt: string;
    duration: number;
    status: SessionStatus;
    pointsTransferred: number;
    notes?: string;
    meetingLink?: string;
    teacherRated: boolean;
    studentRated: boolean;
    createdAt: string;
    updatedAt: string;
}

export type SessionStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

// Rating types
export interface Rating {
    _id: string;
    session: string;
    skill: string;
    rater: User | string;
    rated: User | string;
    rating: number;
    review?: string;
    type: 'teacher' | 'student';
    createdAt: string;
}

// Message types
export interface Message {
    _id: string;
    sender: string;
    receiver: string;
    content: string;
    read: boolean;
    readAt?: string;
    createdAt: string;
}

export interface Conversation {
    user: User;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    count: number;
    total: number;
    pages: number;
    currentPage: number;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    data: User;
}

// Form types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    bio?: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
}

export interface SkillForm {
    title: string;
    description: string;
    category: SkillCategory;
    pointsCost: number;
    duration: number;
    level: SkillLevel;
    tags: string[];
}

export interface SessionBookingForm {
    skillId: string;
    scheduledAt: string;
    notes?: string;
}

export interface RatingForm {
    sessionId: string;
    rating: number;
    review?: string;
}

// Filter types
export interface SkillFilters {
    search?: string;
    category?: SkillCategory;
    level?: SkillLevel;
    minPoints?: number;
    maxPoints?: number;
    sortBy?: 'createdAt' | 'pointsCost' | 'averageRating' | 'totalBookings';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// Category info
export interface CategoryInfo {
    name: SkillCategory;
    count: number;
}
