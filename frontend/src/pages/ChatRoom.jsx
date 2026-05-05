import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Send, User, LoaderCircle, MessageSquare, Info, MoreVertical, Building2, Wifi, WifiOff, ChevronLeft, Search } from 'lucide-react';

const ChatRoom = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [closeCode, setCloseCode] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/chat/conversations/');
            const data = response.data.results || response.data;
            setConversations(data);
            return data;
        } catch (error) { return []; }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const initChat = async () => {
            const currentConversations = await fetchConversations();
            const withId = searchParams.get('with');
            const propertyId = searchParams.get('property');

            if (withId && propertyId) {
                try {
                    const res = await api.post('/chat/conversations/create/', { landlord: withId, property: propertyId });
                    setActiveConversationId(res.data.id);
                    fetchConversations();
                } catch (err) { console.error(err); }
            } else if (currentConversations.length > 0 && !activeConversationId) {
                setActiveConversationId(currentConversations[0].id);
            }
        };
        initChat();
    }, [searchParams]);

    useEffect(() => {
        if (!activeConversationId || !user) return;
        fetchMessages(activeConversationId);

        const token = localStorage.getItem('access_token');
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/conv/${activeConversationId}/?token=${token}`);

        ws.onopen = () => setConnectionStatus('connected');
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'chat_message') {
                setMessages(prev => [...prev, { id: data.message_id, sender: data.sender_id, sender_username: data.sender_username, content: data.message, created_at: data.created_at }]);
            }
        };
        ws.onerror = () => setConnectionStatus('error');
        ws.onclose = (e) => { setConnectionStatus('disconnected'); setCloseCode(e.code); };
        
        setSocket(ws);
        return () => ws.close();
    }, [activeConversationId, user]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const fetchMessages = async (convId) => {
        try {
            const response = await api.get(`/chat/conversations/${convId}/messages/`);
            setMessages(response.data.results || response.data);
        } catch (error) { console.error(error); }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify({ 'message': newMessage }));
        setNewMessage('');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoaderCircle className="w-12 h-12 text-primary-600 animate-spin" /></div>;

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const partnerName = activeConversation ? (user.id === activeConversation.tenant ? activeConversation.landlord_username : activeConversation.tenant_username) : 'Select Chat';

    return (
        <div className="bg-primary-50/50 min-h-[calc(100vh-80px)]">
            <div className="container-custom py-8 h-[calc(100vh-120px)]">
                <div className="bg-white rounded-[2.5rem] shadow-saas-xl flex h-full overflow-hidden border border-primary-100/50">
                    
                    {/* Sidebar */}
                    <div className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-8 border-b border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">Inbox</h2>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input type="text" placeholder="Search conversations..." className="input-saas pl-12 py-3 text-sm bg-slate-50 border-none" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-slate-50/30">
                            {conversations.length > 0 ? conversations.map(conv => (
                                <button key={conv.id} onClick={() => setActiveConversationId(conv.id)} className={`w-full p-6 text-left transition-all flex items-center gap-4 border-b border-primary-100/30 ${activeConversationId === conv.id ? 'bg-primary-50/50 shadow-inner' : 'hover:bg-primary-50/30'}`}>
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 font-black text-xl shadow-sm border border-primary-100/50">
                                        {(user.id === conv.tenant ? conv.landlord_username : conv.tenant_username)?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 truncate">{user.id === conv.tenant ? conv.landlord_username : conv.tenant_username}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mt-1 flex items-center gap-1">
                                            <Building2 size={10} /> {conv.property_title || 'General'}
                                        </p>
                                    </div>
                                </button>
                            )) : <div className="p-12 text-center text-slate-300 font-bold">No messages yet</div>}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className={`flex-1 flex flex-col bg-white ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                        {activeConversationId ? (
                            <>
                                {/* Header */}
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setActiveConversationId(null)} className="md:hidden p-2 text-slate-400"><ChevronLeft /></button>
                                        <div className="w-12 h-12 bg-primary-100 text-primary-900 rounded-2xl flex items-center justify-center font-black text-lg">
                                            {partnerName[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-slate-900 text-lg">{partnerName}</h3>
                                                <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400">{activeConversation?.property_title || 'Property Inquiry'}</p>
                                        </div>
                                    </div>
                                    <button className="p-3 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical /></button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
                                    {messages.map(msg => {
                                        const isMe = String(msg.sender?.id || msg.sender) === String(user.id);
                                        return (
                                            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                                <div className={`flex max-w-[80%] md:max-w-[60%] gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className={`p-5 shadow-sm ${isMe ? 'bg-primary-900 text-white rounded-[2rem] rounded-tr-lg' : 'bg-white text-slate-700 border border-primary-100/50 rounded-[2rem] rounded-tl-lg'}`}>
                                                        <p className="text-[15px] leading-relaxed font-medium">{msg.content}</p>
                                                        <p className={`text-[10px] font-black mt-2 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                                                            {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-6 bg-white border-t border-primary-100/30">
                                    <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-primary-50/50 p-2 pl-6 rounded-3xl border border-primary-100/50 focus-within:ring-8 focus-within:ring-primary-500/5 transition-all duration-300">
                                        <input type="text" placeholder="Type a message..." disabled={connectionStatus !== 'connected'} className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 placeholder:text-slate-400 disabled:opacity-50" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                        <button type="submit" disabled={!newMessage.trim() || connectionStatus !== 'connected'} className="bg-primary-900 text-white p-4 rounded-[1.5rem] shadow-lg shadow-primary-900/10 hover:bg-black transition-all active:scale-95 disabled:opacity-30">
                                            <Send size={20} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-8"><MessageSquare size={48} /></div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2">Your Conversations</h3>
                                <p className="text-slate-400 font-medium max-w-xs">Select a contact from the left to start chatting about properties.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
