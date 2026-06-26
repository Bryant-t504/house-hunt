import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Calendar, MapPin, CheckCircle, XCircle, Clock, LoaderCircle, User, Building2, Trash2, Edit, Eye, EyeOff, Plus, MessageSquare, ChevronRight, Activity, Home, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ListingSkeleton = () => (
    <div className="card-saas animate-pulse border-none shadow-saas">
        <div className="h-56 bg-slate-200"></div>
        <div className="p-8 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="flex gap-2 pt-6 border-t border-slate-100">
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-xl ml-auto"></div>
            </div>
        </div>
    </div>
);

const BookingSkeleton = () => (
    <div className="card-saas p-8 animate-pulse border-none shadow-saas space-y-6">
        <div className="flex items-center gap-3">
            <div className="h-6 bg-slate-200 rounded w-20"></div>
            <div className="h-4 bg-slate-100 rounded w-12"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-16 bg-slate-100 rounded-2xl"></div>
            <div className="h-16 bg-slate-100 rounded-2xl"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, properties, bookings
    const [deleteModal, setDeleteModal] = useState({ open: false, propertyId: null });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, propertiesRes] = await Promise.all([
                api.get('/bookings/'),
                user?.role === 'landlord' ? api.get('/properties/') : Promise.resolve({ data: { results: [] } })
            ]);
            setBookings(bookingsRes.data.results || bookingsRes.data);
            if (user?.role === 'landlord') {
                const allProps = propertiesRes.data.results || propertiesRes.data;
                setProperties(allProps.filter(p => p.landlord === user.id));
            }
        } catch (error) { console.error("Error:", error); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, s) => {
        try { await api.patch(`/bookings/${id}/`, { status: s }); fetchData(); }
        catch (e) { alert("Error updating status"); }
    };

    const toggleVisibility = async (p) => {
        try { await api.patch(`/properties/${p.id}/`, { status: p.status === 'active' ? 'hidden' : 'active' }); fetchData(); }
        catch (e) { alert("Error updating visibility"); }
    };

    const handleDelete = async () => {
        try { await api.delete(`/properties/${deleteModal.propertyId}/`); setDeleteModal({ open: false, propertyId: null }); fetchData(); }
        catch (e) { alert("Error deleting"); }
    };

    const stats = [
        { label: 'Total Properties', value: loading ? '...' : properties.length, icon: Building2, color: 'text-primary-900', bg: 'bg-primary-100' },
        { label: 'Pending Requests', value: loading ? '...' : bookings.filter(b => b.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Approved Viewings', value: loading ? '...' : bookings.filter(b => b.status === 'approved').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="min-h-screen bg-primary-50/20 pb-20">
            {/* Header */}
            <header className="bg-primary-50 border-b border-primary-100/50 pt-16 pb-20">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary-600 font-black mb-4 uppercase text-[10px] tracking-widest">
                                <Activity size={14} /> Discovery Center
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                                Hello, {user?.username}
                            </h1>
                            <p className="text-slate-500 font-medium mt-2">Manage your listings and viewing schedules in one place.</p>
                        </div>
                        {user?.role === 'landlord' && (
                            <Link to="/add-property" className="btn-primary py-3.5 px-8 shadow-xl shadow-primary-200">
                                <Plus size={20} /> Add Listing
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="container-custom -mt-10">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="card-saas p-6 flex items-center gap-6 border-none shadow-saas-lg">
                            <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}>
                                <s.icon size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <p className="text-3xl font-black text-slate-900">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-12 border-b border-primary-100/50 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('overview')} className={`pb-4 font-black text-sm uppercase tracking-widest transition-all border-b-2 ${activeTab === 'overview' ? 'border-primary-900 text-primary-900' : 'border-transparent text-slate-400 hover:text-primary-600'}`}>Overview</button>
                    {user?.role === 'landlord' && <button onClick={() => setActiveTab('properties')} className={`pb-4 font-black text-sm uppercase tracking-widest transition-all border-b-2 ${activeTab === 'properties' ? 'border-primary-900 text-primary-900' : 'border-transparent text-slate-400 hover:text-primary-600'}`}>My Listings</button>}
                    <button onClick={() => setActiveTab('bookings')} className={`pb-4 font-black text-sm uppercase tracking-widest transition-all border-b-2 ${activeTab === 'bookings' ? 'border-primary-900 text-primary-900' : 'border-transparent text-slate-400 hover:text-primary-600'}`}>Viewings</button>
                </div>

                {/* Properties Section */}
                {activeTab === 'properties' && user?.role === 'landlord' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in">
                        {loading ? (
                            [...Array(3)].map((_, idx) => <ListingSkeleton key={idx} />)
                        ) : properties.length > 0 ? properties.map(p => (
                            <div key={p.id} className="card-saas group flex flex-col border-none shadow-saas hover:shadow-saas-xl">
                                <div className="relative h-56 overflow-hidden">
                                    <img src={p.images?.[0]?.image_url.startsWith('http') ? p.images[0].image_url : `http://127.0.0.1:8000${p.images?.[0]?.image_url}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`badge-saas ${p.is_verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{p.is_verified ? 'Verified' : 'Pending'}</span>
                                        {p.status === 'hidden' && <span className="badge-saas bg-slate-900 text-white">Hidden</span>}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{p.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-8">
                                        <MapPin size={14} className="text-primary-500" /> {p.location}
                                    </div>
                                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-slate-100">
                                        <div className="flex gap-2">
                                            <button onClick={() => toggleVisibility(p)} className="p-3 bg-slate-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all">{p.status === 'active' ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                            <button onClick={() => navigate(`/add-property?edit=${p.id}`)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><Edit size={18} /></button>
                                        </div>
                                        <button onClick={() => setDeleteModal({ open: true, propertyId: p.id })} className="p-3 bg-slate-50 text-rose-300 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        )) : <EmptyState icon={Home} title="No listings found" desc="Share your first property to start receiving requests." btn="Create Listing" link="/add-property" />}
                    </div>
                )}

                {/* Bookings Section */}
                {(activeTab === 'bookings' || activeTab === 'overview') && (
                    <div className="space-y-6 animate-in">
                        {bookings.length > 0 ? bookings.map(b => (
                            <div key={b.id} className="card-saas p-8 flex flex-col lg:flex-row items-center gap-8 border-none shadow-saas hover:shadow-saas-lg">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className={`badge-saas ${b.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : b.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{b.status}</span>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{b.id}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6">{b.property_details?.title}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100/30">
                                            <Calendar className="text-primary-500" />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Viewing Date</p>
                                                <p className="font-bold text-slate-900">{new Date(b.booking_date).toLocaleDateString()} at {new Date(b.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-primary-50/50 p-4 rounded-2xl border border-primary-100/30">
                                            <User className="text-primary-500" />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role === 'landlord' ? 'Potential Tenant' : 'Landlord'}</p>
                                                <p className="font-bold text-slate-900">{user.role === 'landlord' ? b.tenant_username : b.property_details?.landlord_username}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-48">
                                    {user.role === 'landlord' && b.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(b.id, 'approved')} className="btn-primary flex-1 py-3 bg-emerald-600 hover:bg-emerald-700">Approve</button>
                                            <button onClick={() => updateStatus(b.id, 'rejected')} className="btn-secondary flex-1 py-3 text-rose-600 hover:text-rose-700">Reject</button>
                                        </>
                                    )}
                                    <button onClick={() => navigate(`/chat?with=${user.role === 'landlord' ? b.tenant : b.property_details?.landlord}&property=${b.property}`)} className="btn-secondary flex-1 py-3"><MessageSquare size={18} /> Chat</button>
                                </div>
                            </div>
                        )) : <EmptyState icon={Clock} title="No viewings yet" desc="All your property viewing schedules will appear here." />}
                    </div>
                )}
            </main>

            {/* Modals */}
            {deleteModal.open && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8"><Trash2 size={40} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Delete listing?</h3>
                    <p className="text-slate-500 font-medium mb-10">This will permanently remove the property and all associated data.</p>
                    <div className="flex gap-4">
                        <button onClick={() => setDeleteModal({ open: false, propertyId: null })} className="flex-1 btn-secondary py-3.5">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 btn-primary bg-rose-600 hover:bg-rose-700 py-3.5">Delete</button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

const EmptyState = ({ icon: Icon, title, desc, btn, link }) => (
    <div className="col-span-full py-32 text-center bg-primary-50/30 rounded-[3rem] border-2 border-dashed border-primary-200/50">
        <Icon size={64} className="mx-auto mb-8 text-primary-200" />
        <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">{desc}</p>
        {btn && link && <Link to={link} className="btn-warm inline-flex">{btn}</Link>}
    </div>
);

export default Dashboard;
