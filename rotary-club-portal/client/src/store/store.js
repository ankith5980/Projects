import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import memberReducer from '../features/members/memberSlice';
import projectReducer from '../features/projects/projectSlice';
import paymentReducer from '../features/payments/paymentSlice';
import notificationReducer from '../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: memberReducer,
    projects: projectReducer,
    payments: paymentReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
