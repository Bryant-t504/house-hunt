import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { MapPin, ArrowLeft, LoaderCircle, CheckCircle, Send, BedDouble, Bath, ShieldCheck, Zap, Info, MessageSquare } from 'lucide-react';

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
                booking_date: preferredDate,
                message: message
            });
            setBookingSuccess(true);
        } catch (error) {
            console.error("Booking error:", error);
            const errData = error.response?.data;
            let errMsg = "Failed to book viewing. Please check your inputs.";
            
            if (errData) {
                if (errData.non_field_errors) {
                    errMsg = errData.non_field_errors[0];
                } else if (errData.booking_date) {
                    errMsg = "Date Error: " + errData.booking_date[0];
                } else if (typeof errData === 'string') {
                    errMsg = errData;
                } else {
                    // Try to extract the first error message from the object
                    const firstKey = Object.keys(errData)[0];
                    if (firstKey && Array.isArray(errData[firstKey])) {
                        errMsg = `${firstKey}: ${errData[firstKey][0]}`;
                    }
                }
            }
            alert(errMsg);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50/20">
            <LoaderCircle className="w-12 h-12 text-primary-600 animate-spin" />
        </div>
    );

    if (!property) return (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Property not found</h2>
            <p className="text-slate-500 mt-2 mb-8">The property you're looking for doesn't exist or is unavailable.</p>
            <Link to="/" className="btn-primary inline-flex">Return Home</Link>
        </div>
    );

    const imageUrl = property.image 
        ? (property.image.startsWith('http') ? property.image : `http://127.0.0.1:8000${property.image}`)
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';

    return (
    return (
        <div className="bg-primary-50/20 min-h-screen pb-20">
            {/* Hero Image Section */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-slate-900">
                <img src={imageUrl} alt={property.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute top-8 left-4 sm:left-8 z-10">
                    <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-semibold transition-all">
                        <ArrowLeft className="w-5 h-5" /> Back to Search
                    </Link>
                </div>

                <div className="absolute bottom-12 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase shadow-lg">
                                {property.property_type}
                            </span>
                            {property.is_verified && (
                                <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase shadow-lg flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" /> Verified
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 text-shadow-xl">{property.title}</h1>
                        <div className="flex items-center gap-3 text-slate-200 text-lg md:text-xl font-medium">
                            <MapPin className="w-6 h-6 text-primary-400" />
                            <span>{property.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quick Stats */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-saas border border-primary-100/50 flex flex-wrap gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary-50 text-primary-900 rounded-2xl flex items-center justify-center">
                                <BedDouble className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{property.bedrooms}</p>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Bedrooms</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <Bath className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{property.bathrooms}</p>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Bathrooms</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-saas border border-primary-100/50">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">About this home</h3>
                        <div className="prose prose-lg text-slate-600 max-w-none">
                            <p className="whitespace-pre-line leading-relaxed">{property.description}</p>
                        </div>
                    </div>

                    {/* Amenities */}
                    {property.amenities && property.amenities.length > 0 && (
                        <div className="bg-white rounded-[2rem] p-8 shadow-saas border border-primary-100/50">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">What this place offers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-700 font-medium bg-primary-50/50 p-4 rounded-2xl border border-primary-100/30">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Booking CTA) */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-saas-lg border border-primary-100/50 sticky top-24">
                        
                        {/* Price */}
                        <div className="mb-8 pb-8 border-b border-slate-100">
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-black text-slate-900">${parseFloat(property.price).toLocaleString()}</span>
                                <span className="text-slate-500 font-bold mb-1">/ month</span>
                            </div>
                        </div>

                        {bookingSuccess ? (
                            <div className="bg-emerald-50 p-8 rounded-3xl text-center border border-emerald-100 animate-in fade-in zoom-in">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h4 className="text-emerald-900 font-black text-2xl mb-2">Request Sent!</h4>
                                <p className="text-emerald-700 font-medium">The landlord will review your request shortly.</p>
                                <Link to="/dashboard" className="btn-primary w-full mt-8 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">
                                    View My Bookings
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-5">
                                {user?.role === 'landlord' ? (
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                                        <Info className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-600 font-medium">Landlords cannot request viewings.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Preferred Viewing Date</label>
                                            <input 
                                                type="datetime-local" required
                                                className="input-saas font-medium"
                                                value={preferredDate}
                                                onChange={(e) => setPreferredDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Message to Landlord (Optional)</label>
                                            <textarea 
                                                className="input-saas font-medium resize-none h-32"
                                                placeholder="Hi! I'm interested in viewing this property..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                        </div>
                                        
                                        <button 
                                            type="submit"
                                            disabled={bookingLoading}
                                            className="w-full btn-primary py-4 text-lg mt-4 flex items-center justify-center gap-2"
                                        >
                                            {bookingLoading ? <LoaderCircle className="animate-spin w-6 h-6" /> : <><Zap className="w-5 h-5" /> Request to Book</>}
                                        </button>
                                        
                                        {user && user.id !== property.landlord && (
                                            <button 
                                                type="button"
                                                onClick={() => navigate(`/chat?with=${property.landlord}&property=${id}`)}
                                                className="w-full btn-secondary py-4 text-lg"
                                            >
                                                <MessageSquare className="w-5 h-5 text-primary-600" />
                                                Ask a Question
                                            </button>
                                        )}
                                        {!user && (
                                            <p className="text-center text-sm text-slate-500 font-medium mt-4">
                                                You must <Link to="/login" className="text-primary-600 hover:underline">sign in</Link> to book.
                                            </p>
                                        )}
                                    </>
                                )}
                            </form>
                        )}

                        {/* Landlord Profile Snippet */}
                        <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-black text-xl shadow-inner">
                                    {property.landlord_username?.[0]?.toUpperCase() || 'L'}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Listed by Landlord</p>
                                    <p className="text-lg font-bold text-slate-900">{property.landlord_username}</p>
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
