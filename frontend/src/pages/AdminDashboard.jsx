import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, Check, X, LoaderCircle, Mail, Phone, Home, User as UserIcon, AlertCircle, Users, Building2, Activity, CalendarCheck, ChevronRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [landlords, setLandlords] = useState([]);
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && !user.is_staff) { navigate('/'); return; }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [landlordsRes, propertiesRes, bookingsRes] = await Promise.all([
                api.get('/auth/admin/landlords/'),
                api.get('/properties/admin/list/'),
                api.get('/bookings/')
            ]);
            setLandlords(landlordsRes.data.results || landlordsRes.data);
            setProperties(propertiesRes.data.results || propertiesRes.data);
            setBookings(bookingsRes.data.results || bookingsRes.data);
        } catch (error) { console.error("Admin Access Denied"); }
        finally { setLoading(false); }
    };

    const toggleLandlordVerify = async (id) => {
        try { await api.patch(`/auth/admin/landlords/${id}/verify/`); fetchData(); }
        catch (e) { alert("Action failed"); }
    };

    const updatePropertyStatus = async (id, status) => {
        try { await api.patch(`/properties/admin/${id}/verify/`, { status: status }); fetchData(); }
        catch (e) { alert("Action failed"); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoaderCircle className="w-12 h-12 text-primary-600 animate-spin" /></div>;

    const stats = [
        { label: 'Platform Users', value: landlords.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Listings', value: properties.length, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Volume', value: bookings.length, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Action Required', value: properties.filter(p => p.status === 'pending').length + landlords.filter(l => !l.is_verified).length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-slate-900 pt-16 pb-32">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary-400 font-bold mb-4 uppercase text-[10px] tracking-widest">
                                <ShieldCheck size={14} /> Global Administration
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Admin <span className="text-primary-500">Center</span></h1>
                            <p className="text-slate-400 font-medium mt-2">Oversee platform health, verify listings, and manage user roles.</p>
                        </div>
                        <div className="flex bg-white/10 p-1.5 rounded-[1.5rem] backdrop-blur-md border border-white/10">
                            {['overview', 'landlords', 'properties'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container-custom -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="card-saas p-8 border-none shadow-saas-xl flex flex-col items-center text-center">
                            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <s.icon size={24} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className="text-3xl font-black text-slate-900">{s.value}</p>
                        </div>
                    ))}
                </div>

                {activeTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in">
                    <div className="card-saas p-10 border-none shadow-saas-lg">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2"><Activity size={20} className="text-primary-600" /> Moderation Queue</h3>
                        <div className="space-y-4">
                            {properties.filter(p => p.status === 'pending').slice(0, 5).map(p => (
                                <div key={p.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Home size={18} className="text-slate-400" /></div>
                                        <div>
                                            <p className="font-bold text-slate-900">{p.title}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Verification</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('properties')} className="p-2 bg-white text-primary-600 rounded-lg shadow-sm border border-slate-100"><ChevronRight size={18} /></button>
                                </div>
                            ))}
                            {landlords.filter(l => !l.is_verified).length === 0 && properties.filter(p => p.status === 'pending').length === 0 && (
                                <div className="text-center py-10">
                                    <Check size={48} className="mx-auto text-emerald-100 mb-4" />
                                    <p className="text-slate-400 font-bold">No pending actions</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-saas p-10 border-none shadow-saas-lg">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2"><CalendarCheck size={20} className="text-primary-600" /> Recent Bookings</h3>
                        <div className="space-y-4">
                            {bookings.slice(0, 5).map(b => (
                                <div key={b.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600 font-black text-xs">{b.id}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 truncate">{b.property_details?.title}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}

                {activeTab === 'landlords' && <div className="card-saas border-none shadow-saas-xl animate-in overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {landlords.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center font-black text-primary-600">{l.username[0].toUpperCase()}</div>
                                                <p className="font-bold text-slate-900">{l.username}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-medium text-slate-600 mb-1">{l.email}</p>
                                            <p className="text-xs text-slate-400">{l.phone_number || 'No Phone'}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`badge-saas ${l.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{l.is_verified ? 'Verified' : 'Unverified'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => toggleLandlordVerify(l.id)} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${l.is_verified ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-100'}`}>{l.is_verified ? 'Revoke' : 'Verify'}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>}

                {activeTab === 'properties' && <div className="card-saas border-none shadow-saas-xl animate-in overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Landlord</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {properties.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-900 mb-1">{p.title}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-xs">{p.location}</p>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-slate-600 text-sm">{p.landlord_username}</td>
                                        <td className="px-8 py-6"><span className={`badge-saas ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : p.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span></td>
                                        <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                                            <button onClick={() => updatePropertyStatus(p.id, 'active')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all"><Check size={18} /></button>
                                            <button onClick={() => updatePropertyStatus(p.id, 'rejected')} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"><X size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>}
            </main>
        </div>
    );
};

export default AdminDashboard;
