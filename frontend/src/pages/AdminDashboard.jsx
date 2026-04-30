import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, Check, X, Loader2, Mail, Phone, Home, User as UserIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('landlords'); // 'landlords' or 'properties'
    const [landlords, setLandlords] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple security check: if not staff, go home
        if (user && !user.is_staff) {
            navigate('/');
            return;
        }
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'landlords') {
                const response = await api.get('/auth/admin/landlords/');
                setLandlords(response.data.results || response.data);
            } else {
                const response = await api.get('/properties/admin/list/');
                setProperties(response.data.results || response.data);
            }
        } catch (error) {
            console.error("Admin access denied", error);
            // navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const toggleLandlordVerify = async (id) => {
        try {
            await api.patch(`/auth/admin/landlords/${id}/verify/`);
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.detail || "Verification failed.";
            alert(msg);
        }
    };

    const updatePropertyStatus = async (id, status) => {
        try {
            await api.patch(`/properties/admin/${id}/verify/`, { verification_status: status });
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.detail || "Action failed.";
            alert(msg);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
                        <ShieldCheck className="w-10 h-10 text-primary-600" />
                        Admin <span className="text-primary-600">Center</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Platform moderation and trust management.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button 
                        onClick={() => setActiveTab('landlords')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'landlords' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <UserIcon className="w-4 h-4" />
                        Landlords
                    </button>
                    <button 
                        onClick={() => setActiveTab('properties')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'properties' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Home className="w-4 h-4" />
                        Properties
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                {activeTab === 'landlords' ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Landlord</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Contact</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {landlords.map((landlord) => (
                                <tr key={landlord.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center font-bold text-primary-600">
                                                {landlord.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{landlord.username}</p>
                                                <p className="text-xs text-slate-500">ID: #{landlord.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                {landlord.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone className="w-4 h-4 text-slate-400" />
                                                {landlord.phone_number || 'None'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {landlord.is_verified ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                                                <Check className="w-3.5 h-3.5" /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                                                <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => toggleLandlordVerify(landlord.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                landlord.is_verified 
                                                ? 'text-red-600 hover:bg-red-50' 
                                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200'
                                            }`}
                                        >
                                            {landlord.is_verified ? 'Revoke' : 'Verify'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Property</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Landlord</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Price</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {properties.map((prop) => (
                                <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            {prop.image ? (
                                                <img src={prop.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                            ) : (
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                                    <Home className="w-6 h-6 text-slate-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-900 line-clamp-1">{prop.title}</p>
                                                <p className="text-xs text-slate-500">{prop.city}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                                        {prop.landlord_username}
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-900">
                                        ${prop.price}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                            prop.verification_status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-100' :
                                            prop.verification_status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                            {prop.verification_status === 'VERIFIED' ? <Check className="w-3.5 h-3.5" /> : 
                                             prop.verification_status === 'REJECTED' ? <X className="w-3.5 h-3.5" /> : 
                                             <AlertCircle className="w-3.5 h-3.5" />}
                                            {prop.verification_status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right space-x-2">
                                        {prop.verification_status !== 'VERIFIED' && (
                                            <button 
                                                onClick={() => updatePropertyStatus(prop.id, 'VERIFIED')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                                                title="Approve"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        {prop.verification_status !== 'REJECTED' && (
                                            <button 
                                                onClick={() => updatePropertyStatus(prop.id, 'REJECTED')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Reject"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {((activeTab === 'landlords' && landlords.length === 0) || (activeTab === 'properties' && properties.length === 0)) && (
                    <div className="p-20 text-center text-slate-400 font-medium">
                        No items pending moderation in this category.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
