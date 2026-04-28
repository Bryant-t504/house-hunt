import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Briefcase, Loader2 } from 'lucide-react';

const Register = () => {
    const { registerUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        role: 'TENANT',
        phone_number: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        const result = await registerUser(formData);
        
        if (!result.success) {
            // If result.message is an object (DRF error), set it to errors
            if (typeof result.message === 'object') {
                setErrors(result.message);
            } else {
                setErrors({ general: result.message });
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-slate-500 mt-2">Join GridNest to start your property journey</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {errors.general && (
                        <div className="col-span-full bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            {errors.general}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                        {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                required
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Briefcase className="h-5 w-5 text-slate-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="TENANT">Tenant (Looking for a home)</option>
                                <option value="LANDLORD">Landlord (Listing properties)</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                value={formData.password_confirm}
                                onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="col-span-full mt-4 btn-primary py-3.5 flex items-center justify-center gap-2 text-lg font-semibold"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Create My Account'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
