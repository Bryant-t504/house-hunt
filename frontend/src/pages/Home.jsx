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

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // We build the query string based on our filters
                let url = '/properties/?';
                if (search) url += `search=${search}&`;
                if (typeFilter) url += `property_type=${typeFilter}&`;

                const response = await api.get(url);
                setProperties(response.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        // We use a small delay (debounce) so we don't spam the server while typing
        const delayDebounceFn = setTimeout(() => {
            fetchProperties();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, typeFilter]);

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('');
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
                        <p className="text-slate-500 mt-2 text-lg">Discover the best student-friendly homes in your area.</p>
                    </div>
                    
                    {user?.role === 'LANDLORD' && (
                        <Link to="/add-property" className="btn-primary flex items-center gap-2 px-6 py-3">
                            <Plus className="w-5 h-5" />
                            List a Property
                        </Link>
                    )}
                </div>

                {/* Search Bar & Filters */}
                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            placeholder="Search by title, city or address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-slate-400" />
                            </div>
                            <select
                                className="block w-full md:w-48 pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none cursor-pointer"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="APARTMENT">Apartments</option>
                                <option value="HOUSE">Houses</option>
                                <option value="STUDIO">Studios</option>
                                <option value="ROOM">Single Rooms</option>
                            </select>
                        </div>

                        {(search || typeFilter) && (
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
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-slate-500 font-medium">Hunting for properties...</p>
                </div>
            ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
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
