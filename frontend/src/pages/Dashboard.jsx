import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Calendar, MapPin, CheckCircle, XCircle, Clock, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);
    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/');
            // Fix: Handle paginated response
            setBookings(response.data.results || response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/bookings/${id}/`, { status: newStatus });
            // Refresh the list
            fetchBookings();
        } catch (error) {
            alert("Failed to update status.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back, <span className="text-primary-600">{user?.username}</span>
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    {user?.role === 'LANDLORD' 
                        ? 'Manage viewing requests for your properties.' 
                        : 'Track your upcoming property viewings.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                            {/* Property Info */}
                            <div className="p-8 flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                    <span className="text-slate-400 text-xs">Requested on {new Date(booking.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    {booking.property_details?.title}
                                </h3>
                                
                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Calendar className="w-5 h-5 text-primary-500" />
                                        <span className="font-semibold">{new Date(booking.preferred_date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <MapPin className="w-5 h-5 text-primary-500" />
                                        <span>{booking.property_details?.address}, {booking.property_details?.city}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <User className="w-5 h-5 text-primary-500" />
                                        <span>{user.role === 'LANDLORD' ? `Requested by ${booking.tenant_username}` : `Listed by ${booking.property_details?.landlord_username}`}</span>
                                    </div>
                                </div>

                                {booking.message && (
                                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl italic text-slate-500 text-sm">
                                        "{booking.message}"
                                    </div>
                                )}
                            </div>

                            {/* Actions (Only for Landlords & Only if Pending) */}
                            {user.role === 'LANDLORD' && booking.status === 'PENDING' && (
                                <div className="bg-slate-50 p-8 flex flex-col justify-center gap-3 md:w-64 border-l border-slate-100">
                                    <button 
                                        onClick={() => updateStatus(booking.id, 'APPROVED')}
                                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(booking.id, 'REJECTED')}
                                        className="w-full bg-white text-red-600 border border-red-200 py-3 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" /> Reject
                                    </button>
                                </div>
                            )}

                            {/* Link back to property */}
                            <div className="p-8 flex items-center border-t md:border-t-0 md:border-l border-slate-100">
                                <Link to={`/property/${booking.property}`} className="text-primary-600 font-bold hover:underline whitespace-nowrap">
                                    View Property Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <Clock className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900">No booking requests found</h3>
                        <p className="text-slate-500 mt-2">Any viewing requests will appear here.</p>
                        <Link to="/" className="btn-primary inline-block mt-8">Explore Properties</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
