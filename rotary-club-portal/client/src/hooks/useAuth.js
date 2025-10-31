import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, member, isAuthenticated, isLoading, error } = useSelector((state) => state.auth || {
    user: null,
    member: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  return {
    user,
    member,
    isAuthenticated,
    loading: isLoading,
    error,
  };
};
