import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { Loader2, Plus, Search, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    // Filter & Search State
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [amenities, setAmenities] = useState('');
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Build query params
                let params = new URLSearchParams();
                if (search) params.append('search', search);
                if (typeFilter) params.append('property_type', typeFilter);
                if (cityFilter) params.append('city', cityFilter);
                if (minPrice) params.append('min_price', minPrice);
                if (maxPrice) params.append('max_price', maxPrice);
                if (bedrooms) params.append('min_bedrooms', bedrooms);
                if (amenities) params.append('amenity', amenities);
                params.append('page', page);

                const response = await api.get(`/properties/?${params.toString()}`);
                
                // Fix: Robustly handle paginated or flat response
                const data = response.data;
                const results = data.results || (Array.isArray(data) ? data : []);
                setProperties(results);
                setHasMore(!!data.next);
                setTotalCount(data.count || results.length);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchProperties();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, typeFilter, cityFilter, minPrice, maxPrice, bedrooms, amenities, page]);

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('');
        setCityFilter('');
        setMinPrice('');
        setMaxPrice('');
        setBedrooms('');
        setAmenities('');
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Hero & Search Section */}
            <div className="mb-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Featured <span className="text-primary-600">Nests</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Discover the best student-friendly homes in Kenya.</p>
                    </div>
                    
                    {user?.role === 'LANDLORD' && (
                        <Link to="/add-property" className="btn-primary flex items-center gap-2 px-6 py-3">
                            <Plus className="w-5 h-5" />
                            List a Property
                        </Link>
                    )}
                </div>

                {/* Search Bar & Filters */}
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="Search by title, city or address..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-medium ${showFilters ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                            </button>
                            
                            {(search || typeFilter || cityFilter || minPrice || maxPrice || bedrooms) && (
                                <button 
                                    onClick={clearFilters}
                                    className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    title="Clear filters"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Advanced Filters Drawer */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Location</label>
                                <select
                                    className="block w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={cityFilter}
                                    onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Cities</option>
                                    <option value="Nairobi">Nairobi</option>
                                    <option value="Mombasa">Mombasa</option>
                                    <option value="Kisumu">Kisumu</option>
                                    <option value="Nakuru">Nakuru</option>
                                    <option value="Eldoret">Eldoret</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Property Type</label>
                                <select
                                    className="block w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={typeFilter}
                                    onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Types</option>
                                    <option value="APARTMENT">Apartments</option>
                                    <option value="HOUSE">Houses</option>
                                    <option value="STUDIO">Studios</option>
                                    <option value="ROOM">Single Rooms</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Price Range (KSh)</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="number" 
                                        placeholder="Min"
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={minPrice}
                                        onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                    />
                                    <span className="text-slate-300">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max"
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={maxPrice}
                                        onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Minimum Bedrooms</label>
                                <select
                                    className="block w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={bedrooms}
                                    onChange={(e) => { setBedrooms(e.target.value); setPage(1); }}
                                >
                                    <option value="">Any</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Amenities</label>
                                <input
                                    type="text"
                                    placeholder="e.g. WiFi, Parking"
                                    className="block w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    value={amenities}
                                    onChange={(e) => { setAmenities(e.target.value); setPage(1); }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
                <p className="text-slate-500 font-medium">
                    Showing <span className="text-slate-900">{properties.length}</span> of <span className="text-slate-900">{totalCount}</span> properties
                </p>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Hunting for properties...</p>
                </div>
            ) : properties.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {properties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    {(page > 1 || hasMore) && (
                        <div className="flex items-center justify-center gap-4 py-8">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                            >
                                Previous
                            </button>
                            <span className="text-slate-500 font-bold">Page {page}</span>
                            <button 
                                onClick={() => setPage(p => p + 1)}
                                disabled={!hasMore}
                                className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6">
                        <Plus className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">No results found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
