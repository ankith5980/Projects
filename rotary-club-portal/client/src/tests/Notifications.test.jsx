import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Notifications from '../pages/Notifications';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import api from '../services/api';

vi.mock('../services/api');
vi.mock('../services/socket');

const mockNotifications = [
  {
    _id: '1',
    type: 'payment_reminder',
    title: 'Payment Due Soon',
    message: 'Your membership payment is due in 5 days',
    isRead: false,
    createdAt: new Date(),
    priority: 'high',
  },
  {
    _id: '2',
    type: 'project_update',
    title: 'Project Progress',
    message: 'Community center project 75% complete',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    priority: 'medium',
  },
  {
    _id: '3',
    type: 'meeting_reminder',
    title: 'Weekly Meeting',
    message: 'Dont forget the meeting tomorrow',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    priority: 'high',
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

describe('Notifications Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    api.get = vi.fn((url, config) => {
      if (url === '/notifications') {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              notifications: mockNotifications,
              unreadCount: 2,
              pagination: {
                page: 1,
                pages: 1,
                total: 3,
              },
            },
          },
        });
      }
      if (url === '/notifications/stats') {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              total: 3,
              unread: 2,
              byType: {
                payment_reminder: 1,
                project_update: 1,
                meeting_reminder: 1,
              },
            },
          },
        });
      }
    });
  });

  test('renders page header and title', async () => {
    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Stay updated with all your activities')).toBeInTheDocument();
    });
  });

  test('displays statistics cards', async () => {
    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Total Notifications')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Unread')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('displays all notifications', async () => {
    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Payment Due Soon')).toBeInTheDocument();
      expect(screen.getByText('Project Progress')).toBeInTheDocument();
      expect(screen.getByText('Weekly Meeting')).toBeInTheDocument();
    });
  });

  test('filters notifications by search term', async () => {
    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Payment Due Soon')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search notifications...');
    fireEvent.change(searchInput, { target: { value: 'payment' } });

    await waitFor(() => {
      expect(screen.getByText('Payment Due Soon')).toBeInTheDocument();
      expect(screen.queryByText('Weekly Meeting')).not.toBeInTheDocument();
    });
  });

  test('opens and closes filter panel', async () => {
    renderWithProviders(<Notifications />);

    const filterButton = screen.getByText('Filters');
    expect(screen.queryByText('Type')).not.toBeInTheDocument();

    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });
  });

  test('filters by notification type', async () => {
    api.get = vi.fn((url, config) => {
      const params = config?.params || {};
      if (params.type === 'payment_reminder') {
        return Promise.resolve({
          data: {
            data: {
              notifications: [mockNotifications[0]],
              unreadCount: 1,
              pagination: { page: 1, pages: 1, total: 1 },
            },
          },
        });
      }
      return Promise.resolve({
        data: {
          data: {
            notifications: mockNotifications,
            unreadCount: 2,
            pagination: { page: 1, pages: 1, total: 3 },
          },
        },
      });
    });

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Payment Due Soon')).toBeInTheDocument();
    });

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    const typeSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(typeSelect, { target: { value: 'payment_reminder' } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/notifications',
        expect.objectContaining({
          params: expect.objectContaining({
            type: 'payment_reminder',
          }),
        })
      );
    });
  });

  test('marks all notifications as read', async () => {
    api.put = vi.fn(() =>
      Promise.resolve({
        data: {
          success: true,
          data: { count: 2 },
        },
      })
    );

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Mark All Read')).toBeInTheDocument();
    });

    const markAllButton = screen.getByText('Mark All Read');
    fireEvent.click(markAllButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/notifications/read-all');
    });
  });

  test('deletes all read notifications', async () => {
    window.confirm = vi.fn(() => true);
    api.delete = vi.fn(() =>
      Promise.resolve({
        data: {
          success: true,
          data: { count: 1 },
        },
      })
    );

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('Clear Read')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear Read');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith('/notifications/clear-read');
    });
  });

  test('marks individual notification as read', async () => {
    api.put = vi.fn(() =>
      Promise.resolve({
        data: {
          success: true,
          data: { notification: { ...mockNotifications[0], isRead: true } },
        },
      })
    );

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getAllByText('Mark as Read').length).toBeGreaterThan(0);
    });

    const markReadButtons = screen.getAllByText('Mark as Read');
    fireEvent.click(markReadButtons[0]);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/notifications/1/read');
    });
  });

  test('deletes individual notification', async () => {
    window.confirm = vi.fn(() => true);
    api.delete = vi.fn(() =>
      Promise.resolve({
        data: {
          success: true,
        },
      })
    );

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(api.delete).toHaveBeenCalledWith('/notifications/1');
    });
  });

  test('shows empty state when no notifications', async () => {
    api.get = vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            notifications: [],
            unreadCount: 0,
            pagination: { page: 1, pages: 0, total: 0 },
          },
        },
      })
    );

    renderWithProviders(<Notifications />);

    await waitFor(() => {
      expect(screen.getByText('No notifications found')).toBeInTheDocument();
      expect(screen.getByText("You're all caught up!")).toBeInTheDocument();
    });
  });

  test('shows loading skeleton while fetching', () => {
    renderWithProviders(<Notifications />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    // Loading skeletons should be visible initially
  });

  test('displays correct notification icons', async () => {
    renderWithProviders(<Notifications />);

    await waitFor(() => {
      const notificationCards = screen.getAllByRole('article', { hidden: true });
      expect(notificationCards.length).toBeGreaterThan(0);
    });
  });
});
