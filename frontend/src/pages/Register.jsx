import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Briefcase, LoaderCircle, Home } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { registerUser, loginUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', password_confirm: '', role: 'tenant', phone_number: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);
        try {
            const result = await registerUser(formData);
            if (result.success) {
                await loginUser({ username: formData.username, password: formData.password });
                navigate('/dashboard');
            } else {
                if (typeof result.message === 'object') setErrors(result.message);
                else setErrors({ general: result.message });
            }
        } catch (err) {
            setErrors({ general: "Registration failed. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-primary-50/20 px-4 py-20">
            <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-saas-xl border border-primary-100/50 p-12 md:p-16 animate-in fade-in zoom-in-95">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-[1.5rem] mb-6">
                        <UserPlus className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 font-medium mt-2">Join the future of property discovery</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {errors.general && <div className="col-span-full bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">{errors.general}</div>}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="text" required className="input-saas pl-12 py-3.5" placeholder="username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>
                        {errors.username && <p className="text-xs text-rose-500 font-bold ml-1">{errors.username}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="email" required className="input-saas pl-12 py-3.5" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        {errors.email && <p className="text-xs text-rose-500 font-bold ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="text" required className="input-saas pl-12 py-3.5" placeholder="+254..." value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">I am a...</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <select className="input-saas pl-12 py-3.5 appearance-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="tenant">Tenant (Looking)</option>
                                <option value="landlord">Landlord (Listing)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="password" required className="input-saas pl-12 py-3.5" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                        {errors.password && <p className="text-xs text-rose-500 font-bold ml-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="password" required className="input-saas pl-12 py-3.5" placeholder="••••••••" value={formData.password_confirm} onChange={(e) => setFormData({...formData, password_confirm: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="col-span-full btn-primary py-4 text-lg shadow-xl shadow-primary-200 mt-6 flex items-center justify-center gap-2">
                        {isLoading ? <LoaderCircle className="w-6 h-6 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-12 text-center text-slate-500 font-medium">
                    Already have an account? <Link to="/login" className="text-primary-600 font-black hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
