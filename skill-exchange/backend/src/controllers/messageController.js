import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get conversations list
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
    try {
        // Get all unique users the current user has messaged with
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { receiver: req.user._id }
                    ],
                    $and: [
                        {
                            $or: [
                                { clearedBy: { $exists: false } },
                                { clearedBy: { $nin: [req.user._id] } }
                            ]
                        }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', req.user._id] },
                            '$receiver',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$content' },
                    lastMessageType: { $first: '$type' },
                    lastMessageAt: { $first: '$createdAt' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', req.user._id] },
                                        { $eq: ['$read', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { lastMessageAt: -1 }
            }
        ]);

        // Populate user info
        const userIds = messages.map(m => m._id);
        const users = await User.find({ _id: { $in: userIds } })
            .select('name avatar isOnline lastSeen');

        const userMap = {};
        users.forEach(u => {
            userMap[u._id.toString()] = u;
        });

        const conversations = messages.map(m => ({
            user: userMap[m._id.toString()],
            lastMessage: m.lastMessage,
            lastMessageAt: m.lastMessageAt,
            unreadCount: m.unreadCount
        }));

        res.status(200).json({
            success: true,
            count: conversations.length,
            data: conversations
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get messages with a user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        const messages = await Message.find({
            $and: [
                {
                    $or: [
                        { sender: req.user.id, receiver: req.params.userId },
                        { sender: req.params.userId, receiver: req.user.id }
                    ]
                },
                {
                    $or: [
                        { clearedBy: { $exists: false } },
                        { clearedBy: { $nin: [req.user.id] } }
                    ]
                }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Mark messages as read
        await Message.updateMany(
            {
                sender: req.params.userId,
                receiver: req.user.id,
                read: false
            },
            {
                read: true,
                readAt: Date.now()
            }
        );

        const total = await Message.countDocuments({
            $and: [
                {
                    $or: [
                        { sender: req.user.id, receiver: req.params.userId },
                        { sender: req.params.userId, receiver: req.user.id }
                    ]
                },
                {
                    $or: [
                        { clearedBy: { $exists: false } },
                        { clearedBy: { $nin: [req.user.id] } }
                    ]
                }
            ]
        });

        // Get other user info
        const otherUser = await User.findById(req.params.userId)
            .select('name avatar isOnline lastSeen');

        res.status(200).json({
            success: true,
            count: messages.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            otherUser,
            data: messages.reverse() // Return in chronological order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, content } = req.body;

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Can't message yourself
        if (receiverId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send message to yourself'
            });
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user.id,
            read: false
        });

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:userId
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        await Message.updateMany(
            {
                sender: req.params.userId,
                receiver: req.user.id,
                read: false
            },
            {
                read: true,
                readAt: Date.now()
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Clear chat with a user (only for current user)
// @route   DELETE /api/messages/clear/:userId
// @access  Private
export const clearChat = async (req, res, next) => {
    try {
        // Add current user to clearedBy array for all messages in this conversation
        await Message.updateMany(
            {
                $or: [
                    { sender: req.user.id, receiver: req.params.userId },
                    { sender: req.params.userId, receiver: req.user.id }
                ],
                clearedBy: { $nin: [req.user.id] }
            },
            {
                $addToSet: { clearedBy: req.user.id }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Chat cleared successfully'
        });
    } catch (err) {
        next(err);
    }
};
