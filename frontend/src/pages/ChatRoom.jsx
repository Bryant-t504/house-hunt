import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Send, User, Loader2, MessageSquare } from 'lucide-react';

const ChatRoom = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(searchParams.get('with') || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    
    const messagesEndRef = useRef(null);

    // Helper: Create a unique room name for two users (sorted to match backend)
    const getRoomName = (id1, id2) => {
        return [id1, id2].sort((a, b) => a - b).join('_');
    };

    // 1. Fetch conversation list (sidebar)
    useEffect(() => {
        fetchConversations();
    }, []);

    // 2. Manage WebSocket Connection
    useEffect(() => {
        if (!activeChat || !user) return;

        // Fetch history first
        fetchMessages();

        const token = localStorage.getItem('access_token');
        const roomName = getRoomName(user.id, activeChat);
        
        // Connect to the WebSocket
        const ws = new WebSocket(
            `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`
        );

        ws.onmessage = (e) => {
            const data = json.loads(e.data);
            // Add the new message to the list instantly
            setMessages((prev) => [...prev, {
                id: Date.now(), // Temp ID for React key
                sender: data.sender_id,
                sender_username: data.sender_username,
                content: data.message,
                timestamp: data.timestamp
            }]);
        };

        ws.onclose = () => console.log("Chat Socket closed");
        ws.onerror = (e) => console.error("Chat Socket error", e);

        setSocket(ws);

        // Cleanup on unmount or chat switch
        return () => ws.close();
    }, [activeChat, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/chat/conversations/');
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/history/${activeChat}/`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        // Send the message via WebSocket instead of HTTP!
        socket.send(JSON.stringify({
            'message': newMessage,
            'receiver_id': activeChat
        }));

        setNewMessage('');
    };

    if (loading) return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-120px)]">
            <div className="bg-white h-full rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex">
                
                {/* Sidebar */}
                <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary-600" />
                            Messages
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(partner => (
                            <button
                                key={partner.id}
                                onClick={() => {
                                    setActiveChat(partner.id);
                                    navigate('/chat', { replace: true });
                                }}
                                className={`w-full p-6 text-left hover:bg-white transition-all border-b border-slate-100/50 flex items-center gap-4 ${activeChat == partner.id ? 'bg-white border-l-4 border-l-primary-600 shadow-sm' : ''}`}
                            >
                                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-bold">
                                    {partner.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{partner.username}</p>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">{partner.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeChat ? (
                        <>
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        {conversations.find(c => String(c.id) === String(activeChat))?.username || 'Chatting...'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                                {messages.map(msg => {
                                    const isMe = String(msg.sender?.id || msg.sender) === String(user.id);
                                    return (
                                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex max-w-[80%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isMe ? 'bg-primary-100 text-primary-700' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                                    {isMe ? 'Me' : (msg.sender_username?.[0]?.toUpperCase() || '?')}
                                                </div>
                                                <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    <p className={`text-[10px] mt-2 opacity-50 ${isMe ? 'text-white' : 'text-slate-500'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary-500"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn-primary p-4 rounded-2xl shadow-lg shadow-primary-200">
                                    <Send className="w-6 h-6" />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                            <p>Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
