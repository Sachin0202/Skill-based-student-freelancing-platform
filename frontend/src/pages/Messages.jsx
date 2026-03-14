import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { Send, User, MessageCircle, Search } from 'lucide-react';

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(false);
    const historyEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (selectedPartner) {
            fetchChatHistory(selectedPartner.id);
            interval = setInterval(() => fetchChatHistory(selectedPartner.id), 5000);
        }
        return () => clearInterval(interval);
    }, [selectedPartner]);

    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const fetchConversations = async () => {
        try {
            const data = await api.getConversations(user.id);
            setConversations(data);
        } catch (err) {
            console.error("Failed to fetch conversations", err);
        }
    };

    const fetchChatHistory = async (partnerId) => {
        try {
            const history = await api.getChatHistory(user.id, partnerId);
            setChatHistory(history);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPartner) return;

        try {
            const msg = {
                sender: { id: user.id },
                receiver: { id: selectedPartner.id },
                content: newMessage
            };
            await api.sendMessage(msg);
            setNewMessage('');
            fetchChatHistory(selectedPartner.id);
        } catch (err) {
            alert("Failed to send message");
        }
    };

    const sidebarLinks = [
        { label: 'Overview', path: user?.role === 'CLIENT' ? '/client' : '/student', icon: <MessageCircle size={20} /> },
        { label: 'Messages', path: '/messages', icon: <MessageCircle size={20} />, active: true }
    ];

    return (
        <DashboardLayout sidebarTitle="Messages" sidebarLinks={sidebarLinks}>
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                {/* Conversations Sidebar */}
                <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <h2 className="font-bold text-lg mb-4">Conversations</h2>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 italic text-sm">
                                No conversations yet.
                            </div>
                        ) : (
                            conversations.map((partner) => (
                                <button
                                    key={partner.id}
                                    onClick={() => setSelectedPartner(partner)}
                                    className={`w-full flex items-center gap-3 p-4 hover:bg-white transition-colors border-b border-gray-50 ${selectedPartner?.id === partner.id ? 'bg-white border-l-4 border-l-primary' : ''}`}
                                >
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">{partner.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{partner.role}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedPartner ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                        {selectedPartner.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{selectedPartner.name}</h3>
                                        <span className="text-[10px] text-green-500 flex items-center gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Online
                                        </span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">View Profile</Button>
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                                {chatHistory.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender.id === user.id
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}>
                                            <p className="leading-relaxed">{msg.content}</p>
                                            <p className={`text-[10px] mt-2 opacity-70 ${msg.sender.id === user.id ? 'text-right' : 'text-left'
                                                }`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={historyEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 bg-white">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Type your message here..."
                                        className="flex-1 bg-gray-100 border-none rounded-xl px-6 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-hover transition-all shadow-md disabled:opacity-50 font-bold text-sm"
                                        disabled={!newMessage.trim()}
                                    >
                                        <Send size={18} />
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/10">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <MessageCircle size={40} className="opacity-20" />
                            </div>
                            <h3 className="font-bold text-gray-500">Your Messages</h3>
                            <p className="text-sm">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Messages;
