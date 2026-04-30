import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { MapPin, Home, DollarSign, User, Calendar, ArrowLeft, Loader2, CheckCircle, Send } from 'lucide-react';

const PropertyDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [preferredDate, setPreferredDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/${id}/`);
                setProperty(response.data);
            } catch (error) {
                console.error("Error fetching property details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            await api.post('/bookings/', {
                property: id,
                preferred_date: preferredDate,
                message: message
            });
            setBookingSuccess(true);
        } catch (error) {
            console.error("Booking error:", error);
            alert(error.response?.data?.non_field_errors || "Failed to book viewing.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    if (!property) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Property not found</h2>
            <Link to="/" className="text-primary-600 mt-4 inline-block hover:underline">Return Home</Link>
        </div>
    );

    const imageUrl = property.image 
        ? (property.image.startsWith('http') ? property.image : `http://127.0.0.1:8000${property.image}`)
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to listings
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                        <img src={imageUrl} alt={property.title} className="w-full h-[500px] object-cover" />
                        <div className="p-8">
                            <div className="flex flex-wrap gap-4 mb-6">
                                <span className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                    {property.property_type}
                                </span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{property.title}</h1>
                            <div className="flex items-center gap-2 text-slate-500 mb-8 text-lg">
                                <MapPin className="w-6 h-6 text-primary-500" />
                                <span>{property.city}, {property.address}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
                                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{property.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-32">
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-black text-slate-900">KSh {parseFloat(property.price).toLocaleString()}</span>
                            <span className="text-slate-500 font-medium">/month</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                <p className="text-2xl font-black text-slate-900">{property.bedrooms}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Bedrooms</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                <p className="text-2xl font-black text-slate-900">{property.bathrooms}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Bathrooms</p>
                            </div>
                        </div>

                        {bookingSuccess ? (
                            <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h4 className="text-green-800 font-bold text-lg">Request Sent!</h4>
                                <p className="text-green-600 text-sm mt-1">The landlord will review your request shortly.</p>
                                <Link to="/dashboard" className="block mt-6 text-primary-600 font-bold hover:underline">View My Bookings</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-4">
                                {user?.role === 'LANDLORD' ? (
                                    <div className="p-4 bg-slate-50 rounded-xl text-slate-500 text-sm text-center italic">
                                        Landlords cannot book viewing requests.
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Date</label>
                                            <input 
                                                type="datetime-local" required
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                                value={preferredDate}
                                                onChange={(e) => setPreferredDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Message (Optional)</label>
                                            <textarea 
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Tell the landlord a bit about yourself..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={bookingLoading}
                                            className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                                        >
                                            {bookingLoading ? <Loader2 className="animate-spin" /> : <><Send className="w-5 h-5" /> Book Viewing</>}
                                        </button>
                                        
                                        {user && user.id !== property.landlord && (
                                            <Link 
                                                to={`/chat?with=${property.landlord}&property=${property.id}`}
                                                className="w-full block text-center bg-white text-slate-700 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                            >
                                                Message Landlord
                                            </Link>
                                        )}
                                    </>
                                )}
                            </form>
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl uppercase">
                                    {property.landlord_username[0]}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 font-medium uppercase">Listed by</p>
                                    <p className="text-xl font-bold text-slate-900">{property.landlord_username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
