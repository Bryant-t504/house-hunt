import { useState, useEffect } from 'react';
import { X, MapPin, BedDouble, Bath, CheckCircle, MessageSquare, Calendar, ShieldCheck, Zap, LoaderCircle, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PropertyModal = ({ property, isOpen, onClose, user }) => {
    const navigate = useNavigate();
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [preferredDate, setPreferredDate] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !property) return null;

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }

        setBookingLoading(true);
        try {
            await api.post('/bookings/', {
                property: property.id,
                booking_date: preferredDate,
                message: message
            });
            setBookingSuccess(true);
        } catch (error) {
            const errData = error.response?.data;
            alert(errData?.non_field_errors?.[0] || "Failed to book viewing. Please check your inputs.");
        } finally {
            setBookingLoading(false);
        }
    };

    const imageUrl = property.images?.[0]?.image_url || property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';
    const finalImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://127.0.0.1:8000${imageUrl}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative animate-in zoom-in-95">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-white/80 hover:bg-white text-slate-900 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95">
                    <X size={24} />
                </button>

                {/* Left Side: Visuals */}
                <div className="w-full md:w-3/5 h-64 md:h-full relative group">
                    <img src={finalImageUrl} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-8 left-8 flex gap-2">
                        <span className="badge-saas bg-primary-600 text-white shadow-lg">{property.property_type}</span>
                        {property.is_verified && (
                            <span className="badge-saas bg-emerald-500 text-white shadow-lg flex items-center gap-1">
                                <ShieldCheck size={12} /> Verified
                            </span>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h2 className="text-4xl font-black mb-2 tracking-tight drop-shadow-md">{property.title}</h2>
                        <div className="flex items-center gap-2 font-medium opacity-90">
                            <MapPin size={18} className="text-primary-400" />
                            {property.location}
                        </div>
                    </div>
                </div>

                {/* Right Side: Details & Actions */}
                <div className="w-full md:w-2/5 flex flex-col bg-white overflow-y-auto p-8 lg:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tight">${parseFloat(property.price).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-1 mx-auto">
                                    <BedDouble size={20} />
                                </div>
                                <p className="text-xs font-bold text-slate-500">{property.bedrooms} Beds</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-1 mx-auto">
                                    <Bath size={20} />
                                </div>
                                <p className="text-xs font-bold text-slate-500">{property.bathrooms} Baths</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 mb-12">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Zap size={18} className="text-primary-500" /> Key Amenities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities?.map((a, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">{a}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-3">Description</h4>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">{property.description}</p>
                        </div>
                    </div>

                    {/* Booking Flow */}
                    <div className="mt-auto bg-slate-50 rounded-3xl p-6 border border-slate-100">
                        {bookingSuccess ? (
                            <div className="text-center py-4 animate-in fade-in zoom-in">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h4 className="font-black text-slate-900 text-lg mb-1">Request Received!</h4>
                                <p className="text-slate-500 text-sm mb-6 font-medium">The landlord will get back to you shortly.</p>
                                <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">Manage My Bookings</button>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-4">
                                <h4 className="font-bold text-slate-900 text-lg mb-4">Book a Viewing</h4>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                                    <input type="datetime-local" required className="input-saas py-2.5 text-sm" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intro Message</label>
                                    <textarea className="input-saas py-2.5 text-sm h-20 resize-none" placeholder="I'd love to see this place..." value={message} onChange={(e) => setMessage(e.target.value)} />
                                </div>
                                <button type="submit" disabled={bookingLoading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                                    {bookingLoading ? <LoaderCircle className="animate-spin w-5 h-5" /> : 'Schedule Request'}
                                </button>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => navigate(`/chat?with=${property.landlord}&property=${property.id}`)} className="btn-secondary flex-1 py-2.5 text-xs">
                                        <MessageSquare size={16} /> Chat
                                    </button>
                                    <Link to={`/property/${property.id}`} className="btn-secondary py-2.5 px-3 text-slate-400">
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyModal;
