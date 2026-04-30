import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { Upload, DollarSign, MapPin, Type, FileText, Loader2 } from 'lucide-react';

const AddProperty = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        city: 'Nairobi',
        price: '',
        property_type: 'APARTMENT',
        image: null
    });

    // If not a landlord, they shouldn't be here
    if (user?.role !== 'LANDLORD') {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // We use FormData for image uploads
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
                data.append('image', formData[key]);
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await api.post('/properties/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Listing submitted successfully! It will go live after admin verification.");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error creating property:", error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Failed to list property. Please check your inputs.";
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-primary-600 p-8 text-white">
                    <h1 className="text-3xl font-bold">List Your Property</h1>
                    <p className="opacity-90 mt-2">Fill in the details below to attract the best tenants.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Property Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Type className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="e.g. Modern 2 Bedroom Near Campus"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Rent</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="number" required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <FileText className="h-5 w-5 text-slate-400" />
                            </div>
                            <textarea
                                rows="4" required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="Tell tenants about the amenities, distance to school, etc."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    {/* Location & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" required
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Street, Building Name"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Property Type</label>
                            <select
                                className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                                value={formData.property_type}
                                onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                            >
                                <option value="APARTMENT">Apartment</option>
                                <option value="HOUSE">House</option>
                                <option value="STUDIO">Studio</option>
                                <option value="ROOM">Single Room</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Property Photo</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-primary-400 transition-colors cursor-pointer relative">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="flex text-sm text-slate-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                                        <span>{formData.image ? formData.image.name : "Upload a file"}</span>
                                        <input 
                                            type="file" 
                                            className="sr-only" 
                                            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary px-10 py-4 text-lg font-bold flex items-center gap-2 shadow-lg shadow-primary-200"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
