import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { 
    LoaderCircle, Search, Filter, X, MapPin, Building2, 
    Home as HomeIcon, LayoutGrid, ChevronDown, ShieldCheck, 
    Star, Compass, ArrowRight, MessageSquare, Calendar, Lock, User
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const PropertyCardSkeleton = () => (
    <div className="card-saas animate-pulse border-none shadow-saas">
        <div className="h-64 bg-slate-200 rounded-t-[2rem]"></div>
        <div className="p-7 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-12"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="w-11 h-11 bg-slate-200 rounded-xl"></div>
            </div>
        </div>
    </div>
);

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

    const handleCityClick = (city) => {
        setCityFilter(city);
        setPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const testimonials = [
        {
            quote: "GridNest made finding an apartment near JKUAT so easy. I booked a viewing online, and the property was exactly as shown in the photos!",
            author: "Kelvin Kiprop",
            role: "Student, JKUAT",
            rating: 5
        },
        {
            quote: "As a landlord, managing listings and verifying tenants was a huge hassle. GridNest simplified my entire onboarding flow.",
            author: "Mary Atieno",
            role: "Landlord, Juja properties",
            rating: 5
        },
        {
            quote: "I love the secure messaging features. I was able to talk directly to the landlord and ask questions before visiting the premises.",
            author: "Faith Mwende",
            role: "Tenant, Nairobi",
            rating: 5
        }
    ];

    const trustCards = [
        {
            icon: ShieldCheck,
            title: "100% Verified Properties",
            description: "We physically audit and verify listings to eliminate bait-and-switch scams."
        },
        {
            icon: Lock,
            title: "Safe Booking Process",
            description: "Schedule viewings and submit inquiries securely through our vetted systems."
        },
        {
            icon: MessageSquare,
            title: "Direct Landlord Chat",
            description: "Communicate transparently with property owners without intermediaries."
        }
    ];

    const popularLocations = [
        { name: "Nairobi", count: "120+ properties", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" },
        { name: "Mombasa", count: "45+ properties", image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800" },
        { name: "Kisumu", count: "30+ properties", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
        { name: "Nakuru", count: "25+ properties", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" }
    ];

    return (
        <div className="min-h-screen bg-primary-50/30">
            {/* Welcoming Hero */}
            <section className="pt-24 pb-32 border-b border-primary-100/50 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/hero_bg.png')" }}>
                <div className="absolute inset-0 bg-white/20 md:bg-gradient-to-r md:from-white/50 md:to-transparent pointer-events-none"></div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[...Array(6)].map((_, idx) => <PropertyCardSkeleton key={idx} />)}
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

            {/* Static marketing sections (only shown when no active filters to prevent cluttering search results) */}
            {!hasActiveFilters && (
                <>
                    {/* Benefits/Trust Section */}
                    <section className="py-24 bg-white border-y border-primary-100/50">
                        <div className="container-custom">
                            <div className="text-center max-w-2xl mx-auto mb-20">
                                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Why Choose GridNest?</h2>
                                <p className="text-lg text-slate-500 font-medium">We design experiences around trust, security, and transparent landlord-tenant communication.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {trustCards.map((card, idx) => (
                                    <div key={idx} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg">
                                        <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-8">
                                            <card.icon size={26} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-4">{card.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{card.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="py-24 bg-primary-50/20">
                        <div className="container-custom">
                            <div className="text-center max-w-2xl mx-auto mb-20">
                                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How It Works</h2>
                                <p className="text-lg text-slate-500 font-medium">From listing to moving in, we simplify every step of the student rental journey.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary-900 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg">1</div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">Explore Properties</h3>
                                    <p className="text-slate-500 font-medium">Search curated, verified homes near major universities and campuses.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary-900 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg">2</div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">Connect & Book</h3>
                                    <p className="text-slate-500 font-medium">Message landlords directly and book physically vetted viewings online.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary-900 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6 shadow-lg">3</div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">Secure Your Nest</h3>
                                    <p className="text-slate-500 font-medium">Confirm bookings, verify agreements, and move in with confidence.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Popular Locations */}
                    <section className="py-24 bg-white">
                        <div className="container-custom">
                            <div className="text-center max-w-2xl mx-auto mb-20">
                                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Popular Locations</h2>
                                <p className="text-lg text-slate-500 font-medium">Explore properties in major student communities across Kenya.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {popularLocations.map((loc, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleCityClick(loc.name)}
                                        className="relative h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-saas hover:shadow-saas-lg transition-all border border-slate-100"
                                    >
                                        <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <h3 className="text-2xl font-black tracking-tight">{loc.name}</h3>
                                            <p className="text-sm text-primary-200/80 font-semibold mt-1 flex items-center gap-1.5">
                                                {loc.count} <ArrowRight size={14} />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-24 bg-primary-50/20 border-t border-primary-100/50">
                        <div className="container-custom">
                            <div className="text-center max-w-2xl mx-auto mb-20">
                                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">What Our Community Says</h2>
                                <p className="text-lg text-slate-500 font-medium">GridNest helps students find homes and landlords manage listings efficiently.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {testimonials.map((t, idx) => (
                                    <div key={idx} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg bg-white flex flex-col justify-between">
                                        <div>
                                            <div className="flex gap-1 mb-6 text-amber-400">
                                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                            </div>
                                            <p className="text-slate-600 font-medium italic leading-relaxed mb-8">"{t.quote}"</p>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900">{t.author}</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final CTA Banner */}
                    <section className="py-24 bg-primary-900 text-white">
                        <div className="container-custom text-center">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Find Your Next Student Home</h2>
                            <p className="text-xl text-primary-200 font-medium mb-12 max-w-xl mx-auto">Join thousands of Kenyan students who rely on GridNest for vetted, stress-free housing.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!user ? (
                                    <>
                                        <Link to="/register" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl">
                                            Create Free Account <ArrowRight size={20} />
                                        </Link>
                                        <Link to="/how-it-works" className="btn-secondary border-primary-700 text-primary-200 hover:bg-primary-800 px-10 py-4 text-lg">
                                            Learn More
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/dashboard" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl">
                                        Go to Dashboard <ArrowRight size={20} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Home;
