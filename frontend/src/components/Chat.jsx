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
        <div className="fixed top-0 right-0 h-screen w-80 sm:w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 shadow-sm relative">
                        {targetUser.name.charAt(0).toUpperCase()}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 leading-tight">{targetUser.name}</p>
                        <p className="text-xs text-green-600 font-medium">Online</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:bg-gray-100 hover:text-gray-600 p-2 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
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
                            className={`flex gap-3 mb-4 ${msg.sender.id === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs shadow-sm overflow-hidden">
                                     {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>
                            <div className={`flex flex-col max-w-[75%] ${msg.sender.id === currentUserId ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-baseline gap-2 mb-1 px-1">
                                    <span className="text-xs font-semibold text-gray-700">
                                        {msg.sender.id === currentUserId ? 'You' : (msg.sender?.name || 'User')}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender.id === currentUserId
                                    ? 'bg-gray-100 text-gray-800 rounded-tr-sm border border-gray-100'
                                    : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                                    }`}>
                                    <p className="whitespace-pre-wrap word-break break-words leading-relaxed">{msg.content}</p>
                                </div>
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
                    className="h-10 w-10 bg-primary text-white rounded-md flex items-center justify-center hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                >
                    <Send size={18} className="ml-1" />
                </button>
            </form>
        </div>
    );
};

export default Chat;
