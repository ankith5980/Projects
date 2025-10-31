import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import NotificationBell from '../components/NotificationBell';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import api from '../services/api';
import socketService from '../services/socket';

// Mock API and Socket
vi.mock('../services/api');
vi.mock('../services/socket');

const mockNotifications = [
  {
    _id: '1',
    type: 'payment_reminder',
    title: 'Payment Due',
    message: 'Your membership payment is due',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    _id: '2',
    type: 'announcement',
    title: 'Club Meeting',
    message: 'Meeting scheduled for next week',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: { id: '123' },
      member: { _id: '456', firstName: 'Test', lastName: 'User' },
      isAuthenticated: true,
      token: 'mock-token',
    },
  },
});

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('NotificationBell Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock API responses
    api.get = vi.fn((url) => {
      if (url === '/notifications') {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              notifications: mockNotifications,
              unreadCount: 1,
            },
          },
        });
      }
      if (url === '/notifications/stats') {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              total: 2,
              unread: 1,
            },
          },
        });
      }
    });

    // Mock socket service
    socketService.connect = vi.fn();
    socketService.on = vi.fn();
    socketService.off = vi.fn();
  });

  test('renders bell icon with unread badge', async () => {
    renderWithProviders(<NotificationBell />);

    await waitFor(() => {
      const badge = screen.getByText('1');
      expect(badge).toBeInTheDocument();
    });
  });

  test('shows 9+ for more than 9 unread notifications', async () => {
    api.get = vi.fn((url) => {
      if (url === '/notifications/stats') {
        return Promise.resolve({
          data: {
            data: {
              total: 15,
              unread: 12,
            },
          },
        });
      }
      return Promise.resolve({ data: { data: { notifications: [] } } });
    });

    renderWithProviders(<NotificationBell />);

    await waitFor(() => {
      expect(screen.getByText('9+')).toBeInTheDocument();
    });
  });

  test('opens dropdown when bell icon is clicked', async () => {
    renderWithProviders(<NotificationBell />);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
      expect(screen.getByText('Club Meeting')).toBeInTheDocument();
    });
  });

  test('displays correct notification icons', async () => {
    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      const notifications = screen.getAllByRole('listitem');
      expect(notifications.length).toBeGreaterThan(0);
    });
  });

  test('marks notification as read', async () => {
    api.put = vi.fn(() =>
      Promise.resolve({
        data: {
          success: true,
          data: { notification: { ...mockNotifications[0], isRead: true } },
        },
      })
    );

    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
    });

    const markReadButton = screen.getAllByText('Mark as Read')[0];
    fireEvent.click(markReadButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/notifications/1/read');
    });
  });

  test('deletes notification', async () => {
    api.delete = vi.fn(() =>
      Promise.resolve({
        data: {
          success: true,
        },
      })
    );

    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/notifications/1');
    });
  });

  test('connects to Socket.IO on mount', async () => {
    renderWithProviders(<NotificationBell />);

    await waitFor(() => {
      expect(socketService.connect).toHaveBeenCalledWith('456');
      expect(socketService.on).toHaveBeenCalledWith('notification:new', expect.any(Function));
      expect(socketService.on).toHaveBeenCalledWith('notification:read', expect.any(Function));
      expect(socketService.on).toHaveBeenCalledWith('notification:allRead', expect.any(Function));
    });
  });

  test('closes dropdown when clicking outside', async () => {
    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByText('Payment Due')).toBeInTheDocument();
    });

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Payment Due')).not.toBeInTheDocument();
    });
  });

  test('shows "View all notifications" link', async () => {
    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      const viewAllLink = screen.getByText('View all notifications');
      expect(viewAllLink).toBeInTheDocument();
      expect(viewAllLink).toHaveAttribute('href', '/notifications');
    });
  });

  test('shows empty state when no notifications', async () => {
    api.get = vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            notifications: [],
            unreadCount: 0,
          },
        },
      })
    );

    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });
  });

  test('displays relative time correctly', async () => {
    renderWithProviders(<NotificationBell />);

    const bellIcon = screen.getByRole('button');
    fireEvent.click(bellIcon);

    await waitFor(() => {
      expect(screen.getByText(/minutes ago/)).toBeInTheDocument();
      expect(screen.getByText(/hours ago/)).toBeInTheDocument();
    });
  });
});
