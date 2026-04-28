import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, ShieldAlert, Check, X, Loader2, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [landlords, setLandlords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only Superusers should be here
        // Note: is_staff is the standard Django field for admins
        // In our serializer, we can check for superuser or staff status
        fetchLandlords();
    }, []);

    const fetchLandlords = async () => {
        try {
            const response = await api.get('/auth/admin/landlords/');
            setLandlords(response.data);
        } catch (error) {
            console.error("Admin access denied", error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const toggleVerify = async (id) => {
        try {
            await api.patch(`/auth/admin/landlords/${id}/verify/`);
            fetchLandlords(); // Refresh the list
        } catch (error) {
            alert("Verification failed. Make sure you have admin rights.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
                        <ShieldCheck className="w-10 h-10 text-primary-600" />
                        Verification <span className="text-primary-600">Center</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage landlord trust and platform security.</p>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 text-primary-700 font-bold">
                    Admin Mode
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Landlord</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {landlords.map((landlord) => (
                            <tr key={landlord.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">
                                            {landlord.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{landlord.username}</p>
                                            <p className="text-xs text-slate-500">Member since {new Date().toLocaleDateString()}</p>
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
                                            {landlord.phone_number || 'No phone provided'}
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
                                <td className="px-8 py-6">
                                    <button 
                                        onClick={() => toggleVerify(landlord.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                            landlord.is_verified 
                                            ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50' 
                                            : 'bg-primary-600 text-white hover:bg-primary-700'
                                        }`}
                                    >
                                        {landlord.is_verified ? 'Revoke Status' : 'Verify Landlord'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {landlords.length === 0 && (
                    <div className="p-20 text-center text-slate-400 font-medium">
                        No landlords registered on the platform yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
