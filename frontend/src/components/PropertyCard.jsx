import { MapPin, Home, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    // URL for the image (handles local dev server paths)
    const imageUrl = property.image 
        ? (property.image.startsWith('http') ? property.image : `http://127.0.0.1:8000${property.image}`)
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-primary-700 uppercase tracking-wider shadow-sm">
                        {property.property_type}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="bg-primary-600 px-4 py-2 rounded-xl text-white font-bold flex items-center gap-1 shadow-lg">
                        <span className="text-xl font-bold text-white">KSh {parseFloat(property.price).toLocaleString()}</span>
                        <span className="text-xs font-normal opacity-80">/mo</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">
                    {property.title}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-500 mb-4 text-sm">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>{property.city}, {property.address}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Home className="w-4 h-4" />
                        <span>{property.landlord_username}</span>
                    </div>
                    <Link 
                        to={`/property/${property.id}`}
                        className="text-primary-600 font-semibold hover:text-primary-700 text-sm transition-colors"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
