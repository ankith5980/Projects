import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messagesApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Conversation, Message, User, ApiResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { Send, MessageCircle, Circle, Trash2 } from 'lucide-react';

export default function MessagesPage() {
    const { user } = useAuth();
    const { socket, isConnected, onlineUsers } = useSocket();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => { fetchConversations(); }, []);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for incoming messages
        socket.on('receive_message', (message: Message) => {
            // Add message if it's from the selected user
            if (selectedUser && message.sender === selectedUser._id) {
                setMessages(prev => [...prev, message]);
                // Mark as read
                socket.emit('mark_read', { senderId: message.sender });
            }
            // Refresh conversations to update last message
            fetchConversations();
        });

        // Listen for message sent confirmation
        socket.on('message_sent', (data: { _id: string; receiver: string; content: string; createdAt: string }) => {
            if (selectedUser && data.receiver === selectedUser._id) {
                const newMsg: Message = {
                    _id: data._id,
                    sender: user?._id || '',
                    receiver: data.receiver,
                    content: data.content,
                    read: false,
                    createdAt: data.createdAt
                };
                setMessages(prev => [...prev, newMsg]);
            }
        });

        // Listen for typing indicators
        socket.on('user_typing', (data: { userId: string; name: string }) => {
            if (selectedUser && data.userId === selectedUser._id) {
                setIsTyping(true);
                setTypingUser(data.name);
            }
        });

        socket.on('user_stop_typing', (data: { userId: string }) => {
            if (selectedUser && data.userId === selectedUser._id) {
                setIsTyping(false);
                setTypingUser(null);
            }
        });

        // Listen for read receipts
        socket.on('messages_read', (data: { readBy: string }) => {
            if (selectedUser && data.readBy === selectedUser._id) {
                setMessages(prev => prev.map(msg =>
                    msg.sender === user?._id ? { ...msg, read: true } : msg
                ));
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('message_sent');
            socket.off('user_typing');
            socket.off('user_stop_typing');
            socket.off('messages_read');
        };
    }, [socket, selectedUser, user]);

    // Handle URL params for direct messaging
    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            loadUserFromParam(userId);
        }
    }, [searchParams]);

    const loadUserFromParam = async (userId: string) => {
        try {
            const response = await usersApi.getById(userId) as ApiResponse<User>;
            setSelectedUser(response.data);
            fetchMessages(userId);
        } catch (error) { console.error('Failed to load user:', error); }
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await messagesApi.getConversations() as ApiResponse<Conversation[]>;
            setConversations(response.data);
        } catch (error) { console.error('Failed to fetch conversations:', error); }
        finally { setIsLoading(false); }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const response = await messagesApi.getMessages(userId) as { data: Message[]; otherUser: User };
            setMessages(response.data);
            // Mark messages as read via socket
            if (socket) {
                socket.emit('mark_read', { senderId: userId });
            }
        } catch (error) { console.error('Failed to fetch messages:', error); }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        // Stop typing indicator
        if (socket) {
            socket.emit('stop_typing', { receiverId: selectedUser._id });
        }

        // Use Socket.io if connected, otherwise fall back to REST
        if (socket && isConnected) {
            socket.emit('send_message', {
                receiverId: selectedUser._id,
                content: newMessage.trim()
            });
            setNewMessage('');
            fetchConversations();
        } else {
            // Fallback to REST API
            setIsSending(true);
            try {
                const response = await messagesApi.send({ receiverId: selectedUser._id, content: newMessage.trim() }) as ApiResponse<Message>;
                setMessages([...messages, response.data]);
                setNewMessage('');
                fetchConversations();
            } catch (error) { console.error('Failed to send message:', error); }
            finally { setIsSending(false); }
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (!socket || !selectedUser) return;

        // Emit typing event
        socket.emit('typing', { receiverId: selectedUser._id });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { receiverId: selectedUser._id });
        }, 1000);
    };

    const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const isUserOnline = (userId: string) => onlineUsers.has(userId);

    const handleClearChat = async () => {
        if (!selectedUser) return;
        setIsClearing(true);
        try {
            await messagesApi.clearChat(selectedUser._id);
            setMessages([]);
            setShowClearConfirm(false);
            fetchConversations();
        } catch (error) {
            console.error('Failed to clear chat:', error);
        } finally {
            setIsClearing(false);
        }
    };

    if (isLoading) return <LoadingSpinner text="Loading messages..." />;

    return (
        <div style={{
            position: 'fixed',
            top: '68px',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 'var(--spacing-xl)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-bg-primary)'
        }}>
            <div className="chat-container" style={{ flex: 1, minHeight: 0, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
                <div className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <h2>Messages</h2>
                        {isConnected && (
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--color-success)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <Circle size={8} fill="currentColor" />
                                Live
                            </span>
                        )}
                    </div>
                    <div className="chat-list">
                        {conversations.length === 0 ? (
                            <p style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-tertiary)' }}>No conversations yet</p>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.user._id}
                                    className={`chat-item ${selectedUser?._id === conv.user._id ? 'active' : ''}`}
                                    onClick={() => { setSelectedUser(conv.user); fetchMessages(conv.user._id); }}
                                >
                                    <div className="avatar" style={{ position: 'relative' }}>
                                        {conv.user.name?.charAt(0)}
                                        {isUserOnline(conv.user._id) && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: '10px',
                                                height: '10px',
                                                background: 'var(--color-success)',
                                                borderRadius: '50%',
                                                border: '2px solid var(--color-bg-primary)'
                                            }} />
                                        )}
                                    </div>
                                    <div className="chat-item-content">
                                        <div className="chat-item-name">{conv.user.name}</div>
                                        <div className="chat-item-preview">{conv.lastMessage}</div>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="chat-item-badge">{conv.unreadCount}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="chat-main">
                    {selectedUser ? (
                        <>
                            <div className="chat-header">
                                <div className="avatar" style={{ position: 'relative' }}>
                                    {selectedUser.name?.charAt(0)}
                                    {isUserOnline(selectedUser._id) && (
                                        <span style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            width: '10px',
                                            height: '10px',
                                            background: 'var(--color-success)',
                                            borderRadius: '50%',
                                            border: '2px solid var(--color-bg-primary)'
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{selectedUser.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                                        {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowClearConfirm(true)}
                                    className="btn btn-ghost btn-icon"
                                    title="Clear chat"
                                    style={{ color: 'var(--color-text-tertiary)' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="chat-messages">
                                {messages.map((m) => (
                                    <div key={m._id} className={`chat-message ${m.sender === user?._id ? 'sent' : 'received'}`}>
                                        <div>{m.content}</div>
                                        <div className="chat-message-time">
                                            {formatTime(m.createdAt)}
                                            {m.sender === user?._id && m.read && (
                                                <span style={{ marginLeft: '4px', color: 'var(--color-primary)' }}>✓✓</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="chat-message received" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                                        {typingUser} is typing...
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className="chat-input-container" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={handleTyping}
                                    disabled={isSending}
                                />
                                <button type="submit" className="btn btn-primary" disabled={!newMessage.trim() || isSending}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <MessageCircle size={48} />
                            <p>Select a conversation</p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleClearChat}
                title="Clear Chat"
                message={`Are you sure you want to clear this chat with ${selectedUser?.name}? This action only affects your view - ${selectedUser?.name} will still see the messages until they clear the chat from their side.`}
                confirmText="Clear Chat"
                cancelText="Cancel"
                variant="danger"
                isLoading={isClearing}
            />
        </div>
    );
}
