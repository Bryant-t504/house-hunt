import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { Upload, DollarSign, MapPin, Type, FileText, LoaderCircle, Building2, BedDouble, Bath, ChevronLeft } from 'lucide-react';

const AddProperty = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', location: '', price: '', bedrooms: 1, bathrooms: 1, property_type: 'apartment', image: null
    });

    useEffect(() => {
        if (editId) {
            const fetchProp = async () => {
                try {
                    const res = await api.get(`/properties/${editId}/`);
                    const p = res.data;
                    setFormData({ ...p, image: null }); // Don't try to prepopulate file
                } catch (e) { console.error(e); }
            };
            fetchProp();
        }
    }, [editId]);

    if (user?.role !== 'landlord') { navigate('/'); return null; }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(k => {
            if (k === 'image' && formData[k]) data.append('image', formData[k]);
            else if (formData[k] !== null && formData[k] !== '') data.append(k, formData[k]);
        });

        try {
            if (editId) await api.patch(`/properties/${editId}/`, data);
            else await api.post('/properties/', data);
            navigate('/dashboard');
        } catch (error) { alert("Failed to save property. Please check all fields."); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-primary-50/20 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors mb-8 uppercase text-[10px] tracking-widest">
                    <ChevronLeft size={16} /> Back to Dashboard
                </button>

                <div className="bg-white rounded-[3rem] shadow-saas-xl border border-primary-100/50 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="bg-primary-900 p-12 text-white">
                        <h1 className="text-4xl font-black tracking-tight mb-2">{editId ? 'Edit Listing' : 'List Your Property'}</h1>
                        <p className="text-primary-200/60 font-medium">Reach verified tenants and manage your portfolio with ease.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-12 space-y-12">
                        {/* Section 1: Identity */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest border-b border-primary-100/50 pb-4">General Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="text" required className="input-saas pl-12" placeholder="Modern 2BR near Uni" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Rent (KSh / mo)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="number" required className="input-saas pl-12" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Specs */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest border-b border-primary-100/50 pb-4">Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                    <select className="input-saas py-3.5 appearance-none" value={formData.property_type} onChange={(e) => setFormData({...formData, property_type: e.target.value})}>
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="studio">Studio</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bedrooms</label>
                                    <div className="relative">
                                        <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="number" required className="input-saas pl-12" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bathrooms</label>
                                    <div className="relative">
                                        <Bath className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input type="number" required className="input-saas pl-12" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Media */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-primary-600 uppercase tracking-widest border-b border-primary-100/50 pb-4">Media & Location</h3>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Address / Neighborhood</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input type="text" required className="input-saas pl-12" placeholder="Juja, Central Avenue" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea required rows="4" className="input-saas h-32 py-4" placeholder="Describe the property, vicinity to campus, security..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            <div className="relative group cursor-pointer h-40 bg-primary-50/30 border-2 border-dashed border-primary-100 rounded-[2rem] flex flex-col items-center justify-center hover:bg-white hover:border-primary-500 transition-all">
                                <Upload className="text-primary-300 group-hover:text-primary-500 mb-2" />
                                <p className="text-xs font-black text-primary-400 uppercase tracking-widest">{formData.image ? formData.image.name : 'Click to upload property photo'}</p>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <button type="submit" disabled={isLoading} className="btn-primary px-12 py-4 text-xl shadow-2xl shadow-primary-200 flex items-center justify-center gap-2">
                                {isLoading ? <LoaderCircle className="animate-spin" /> : (editId ? 'Update Listing' : 'Publish Property')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProperty;
