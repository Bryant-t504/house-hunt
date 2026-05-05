import { useEffect } from 'react';
import { X, MapPin, BedDouble, Bath, CheckCircle, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ImageModal = ({ property, isOpen, onClose, user }) => {
    const navigate = useNavigate();

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !property) return null;

    // Handle outside click to close
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleChat = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/chat?with=${property.landlord}`);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300 relative">
                
                {/* Close Button - Absolute */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-lg backdrop-blur-md transition-all hover:scale-105"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left side: High-Res Image */}
                <div className="w-full md:w-3/5 h-[40vh] md:h-auto bg-slate-100 relative">
                    {property.image ? (
                        <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No image available
                        </div>
                    )}
                    {/* Floating Price Tag */}
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Rent</p>
                        <p className="text-3xl font-black text-slate-900">${property.price}</p>
                    </div>
                </div>

                {/* Right side: Property Details & Actions */}
                <div className="w-full md:w-2/5 flex flex-col h-full max-h-[50vh] md:max-h-none overflow-y-auto bg-white p-8">
                    
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-primary-600 mb-3">
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">{property.address}, {property.city}</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">
                            {property.title}
                        </h2>
                        
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-xl">
                                <BedDouble className="w-5 h-5 text-slate-400" />
                                <span className="font-bold">{property.bedrooms} <span className="font-normal text-slate-500">Beds</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-xl">
                                <Bath className="w-5 h-5 text-slate-400" />
                                <span className="font-bold">{property.bathrooms} <span className="font-normal text-slate-500">Baths</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="font-bold text-slate-900 mb-3 text-lg">About this property</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {property.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    {property.amenities && (
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Key Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((amenity, index) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-100">
                                        <CheckCircle className="w-4 h-4" /> {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Landlord Info */}
                    <div className="mt-auto pt-6 border-t border-slate-100 mb-8">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                            <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-black text-lg">
                                {property.landlord_username?.[0]?.toUpperCase() || 'L'}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Listed By Landlord</p>
                                <p className="font-bold text-slate-900">{property.landlord_username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link 
                            to={`/property/${property.id}`}
                            className="btn-primary w-full flex justify-between items-center px-6"
                            onClick={onClose}
                        >
                            <span>View Full Details & Book</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                        
                        {(!user || user.id !== property.landlord) && (
                            <button 
                                onClick={handleChat}
                                className="btn-secondary w-full border-slate-200"
                            >
                                <MessageSquare className="w-5 h-5 text-primary-600" />
                                Message Landlord
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
