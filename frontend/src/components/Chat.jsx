import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import Button from './Button';

const Chat = ({ currentUserId, targetUser, jobId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [targetUser.id]);

    useEffect(scrollToBottom, [messages]);

    const fetchHistory = async () => {
        try {
            const history = await api.getChatHistory(currentUserId, targetUser.id);
            setMessages(history);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const msg = {
                sender: { id: currentUserId },
                receiver: { id: targetUser.id },
                job: jobId ? { id: jobId } : null,
                content: newMessage
            };
            await api.sendMessage(msg);
            setNewMessage('');
            fetchHistory();
        } catch (err) {
            alert("Failed to send message");
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-primary p-3 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                        {targetUser.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold leading-tight">{targetUser.name}</p>
                        <p className="text-[10px] opacity-80">Online</p>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender.id === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender.id === currentUserId
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                <p>{msg.content}</p>
                                <p className={`text-[9px] mt-1 opacity-70 ${msg.sender.id === currentUserId ? 'text-right' : 'text-left'
                                    }`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="h-9 w-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
                    disabled={!newMessage.trim()}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
