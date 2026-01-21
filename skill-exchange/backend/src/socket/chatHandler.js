import User from '../models/User.js';
import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';

const setupSocket = (io) => {
    // Store online users
    const onlineUsers = new Map();

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.user.name}`);

        // Update user online status
        await User.findByIdAndUpdate(socket.user._id, { isOnline: true });
        onlineUsers.set(socket.user._id.toString(), socket.id);

        // Broadcast online status
        socket.broadcast.emit('user_online', {
            userId: socket.user._id,
            isOnline: true
        });

        // Join user's own room for direct messages
        socket.join(socket.user._id.toString());

        // Handle sending messages
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, content } = data;

                // Save message to database
                const message = await Message.create({
                    sender: socket.user._id,
                    receiver: receiverId,
                    content
                });

                // Emit to receiver if online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive_message', {
                        _id: message._id,
                        sender: socket.user._id,
                        receiver: receiverId,
                        content,
                        read: false,
                        createdAt: message.createdAt
                    });
                }

                // Confirm to sender
                socket.emit('message_sent', {
                    _id: message._id,
                    receiver: receiverId,
                    content,
                    createdAt: message.createdAt
                });
            } catch (err) {
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { receiverId } = data;
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', {
                    userId: socket.user._id,
                    name: socket.user.name
                });
            }
        });

        // Handle stop typing
        socket.on('stop_typing', (data) => {
            const { receiverId } = data;
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_stop_typing', {
                    userId: socket.user._id
                });
            }
        });

        // Handle message read
        socket.on('mark_read', async (data) => {
            const { senderId } = data;
            await Message.updateMany(
                {
                    sender: senderId,
                    receiver: socket.user._id,
                    read: false
                },
                {
                    read: true,
                    readAt: Date.now()
                }
            );

            // Notify sender that messages were read
            const senderSocketId = onlineUsers.get(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit('messages_read', {
                    readBy: socket.user._id
                });
            }
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${socket.user.name}`);

            await User.findByIdAndUpdate(socket.user._id, {
                isOnline: false,
                lastSeen: Date.now()
            });

            onlineUsers.delete(socket.user._id.toString());

            socket.broadcast.emit('user_online', {
                userId: socket.user._id,
                isOnline: false,
                lastSeen: Date.now()
            });
        });
    });
};

export default setupSocket;
