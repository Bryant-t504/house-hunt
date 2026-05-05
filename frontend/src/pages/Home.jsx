import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { LoaderCircle, Search, Filter, X, MapPin, Building2, Home as HomeIcon, LayoutGrid, ChevronDown } from 'lucide-react';
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
    
    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                let params = new URLSearchParams();
                if (search) params.append('search', search);
                if (typeFilter) params.append('property_type', typeFilter);
                if (cityFilter) params.append('city', cityFilter);
                if (minPrice) params.append('min_price', minPrice);
                if (maxPrice) params.append('max_price', maxPrice);
                if (bedrooms) params.append('min_bedrooms', bedrooms);
                params.append('page', page);

                const response = await api.get(`/properties/?${params.toString()}`);
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

        const timer = setTimeout(fetchProperties, 400);
        return () => clearTimeout(timer);
    }, [search, typeFilter, cityFilter, minPrice, maxPrice, bedrooms, page]);

    const hasActiveFilters = search || typeFilter || cityFilter || minPrice || maxPrice || bedrooms;

    return (
        <div className="min-h-screen bg-primary-50/30">
            {/* Welcoming Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none"></div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            Find a place that <br/>
                            <span className="text-primary-500 underline decoration-primary-200 underline-offset-8">feels like home</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
                            Explore a curated collection of verified student homes. Warm, welcoming, and designed for your peace of mind.
                        </p>

                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-2xl md:rounded-full shadow-saas-xl border border-slate-200 focus-within:ring-8 focus-within:ring-primary-500/5 transition-all mb-8">
                            <div className="flex-1 flex items-center pl-6 border-b md:border-b-0 md:border-r border-slate-100">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-none py-4 px-4 text-lg outline-none placeholder:text-slate-400 text-slate-900 font-medium"
                                    placeholder="City, university, or keyword..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div className="flex items-center px-4 gap-2">
                                <button 
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${showFilters ? 'bg-primary-900 text-white shadow-lg' : 'text-slate-600 hover:bg-primary-50'}`}
                                >
                                    <Filter size={18} />
                                    <span>Filters</span>
                                    <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>
                                <button className="bg-primary-600 text-white px-10 py-4 rounded-full font-black shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters Drawer */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-saas-lg">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                                        <LayoutGrid className="text-primary-600" size={20} /> Fine-tune your search
                                    </h3>
                                    {hasActiveFilters && (
                                        <button onClick={() => { setSearch(''); setTypeFilter(''); setCityFilter(''); setMinPrice(''); setMaxPrice(''); setBedrooms(''); }} className="text-xs font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest flex items-center gap-2">
                                            <X size={14} /> Reset Filters
                                        </button>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                            <select className="input-saas pl-11 py-2.5 bg-slate-50 border-transparent text-sm" value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}>
                                                <option value="">Any City</option>
                                                {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                                            <select className="input-saas pl-11 py-2.5 bg-slate-50 border-transparent text-sm" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                                                <option value="">Any Type</option>
                                                <option value="apartment">Apartments</option>
                                                <option value="house">Houses</option>
                                                <option value="studio">Studios</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range (KSh)</label>
                                        <div className="flex gap-3 items-center">
                                            <input type="number" placeholder="Min" className="input-saas py-2.5 bg-slate-50 border-transparent text-sm" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
                                            <div className="w-4 h-0.5 bg-slate-200"></div>
                                            <input type="number" placeholder="Max" className="input-saas py-2.5 bg-slate-50 border-transparent text-sm" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="container-custom py-20">
                {/* Grid Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Discovery Queue</h2>
                        <p className="text-slate-500 font-medium">Found {totalCount} properties waiting for you</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="p-3 bg-primary-50 text-primary-600 rounded-xl font-black text-sm">Sort: Newest First</span>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Mapping the neighborhood...</p>
                    </div>
                ) : properties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
                        </div>
                        
                        {/* Pagination */}
                        {(page > 1 || hasMore) && (
                            <div className="flex items-center justify-center gap-6 mt-24">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-8 disabled:opacity-30">Previous</button>
                                <span className="font-black text-slate-900">Page {page}</span>
                                <button onClick={() => setPage(p => p + 1)} disabled={!hasMore} className="btn-secondary px-8 disabled:opacity-30">Next</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-40 border-4 border-dashed border-slate-100 rounded-[3rem]">
                        <Search className="w-16 h-16 mx-auto mb-8 text-slate-200" />
                        <h3 className="text-3xl font-black text-slate-900 mb-2">No properties matched</h3>
                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Try adjusting your filters or search keywords to find more options.</p>
                        {hasActiveFilters && <button onClick={() => { setSearch(''); setTypeFilter(''); setCityFilter(''); setMinPrice(''); setMaxPrice(''); setBedrooms(''); }} className="btn-primary">Clear all filters</button>}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
