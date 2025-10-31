import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socket';

export const useSocket = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  return socketService;
};

export const useSocketEvent = (event, callback) => {
  const socket = useSocket();

  useEffect(() => {
    if (socket.isConnected()) {
      socket.on(event, callback);

      return () => {
        socket.off(event, callback);
      };
    }
  }, [event, callback, socket]);

  return socket;
};
