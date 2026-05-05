import { MapPin, BedDouble, Bath, ShieldCheck } from 'lucide-react';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import PropertyModal from './PropertyModal';

const PropertyCard = ({ property }) => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const firstImage = property.images?.[0]?.image_url || property.image;
    const imageUrl = firstImage 
        ? (firstImage.startsWith('http') ? firstImage : `http://127.0.0.1:8000${firstImage}`)
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

    return (
        <>
            <div 
                className="card-saas group flex flex-col h-full cursor-pointer border-none bg-white hover:shadow-saas-xl"
                onClick={() => setIsModalOpen(true)}
            >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden rounded-t-[2rem]">
                    <img 
                        src={imageUrl} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-5 left-5 flex gap-2">
                        <span className="badge-saas bg-white/95 backdrop-blur-md text-slate-900 shadow-sm border border-primary-100/50">
                            {property.property_type}
                        </span>
                        {property.is_verified && (
                            <span className="badge-saas bg-emerald-500 text-white shadow-lg">
                                <ShieldCheck size={10} className="inline mr-1" /> Verified
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                            {property.title}
                        </h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-slate-400 mb-6 font-medium text-sm">
                        <MapPin size={14} className="text-primary-500" />
                        <span className="truncate">{property.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8 bg-primary-50/30 p-4 rounded-2xl border border-primary-100/30">
                        <div className="flex items-center gap-2 text-slate-600">
                            <BedDouble size={18} className="text-primary-200" />
                            <span className="text-sm font-bold">{property.bedrooms} <span className="font-medium text-slate-400">Beds</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Bath size={18} className="text-primary-200" />
                            <span className="text-sm font-bold">{property.bathrooms} <span className="font-medium text-slate-400">Baths</span></span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rent</p>
                            <p className="text-2xl font-black text-slate-900">${parseFloat(property.price).toLocaleString()}</p>
                        </div>
                        <div className="w-11 h-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-black group-hover:bg-primary-900 group-hover:text-white transition-all shadow-sm">
                            →
                        </div>
                    </div>
                </div>
            </div>

            <PropertyModal 
                property={property} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                user={user}
            />
        </>
    );
};

export default PropertyCard;
