import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogIn, User, Lock, LoaderCircle, Home } from 'lucide-react';

const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await loginUser(formData);
        if (!result.success) setError(result.message);
        setIsLoading(false);
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-primary-50/20 px-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-saas-xl border border-primary-100/50 p-12 animate-in fade-in zoom-in-95">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-[1.5rem] mb-6">
                        <Home className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 font-medium mt-2">Manage your listings and stays</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100">{error}</div>}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="text" required className="input-saas pl-12" placeholder="your_username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input type="password" required className="input-saas pl-12" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary-200 mt-4 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <LoaderCircle className="w-6 h-6 animate-spin" /> : 'Log In'}
                    </button>
                </form>

                <p className="mt-10 text-center text-slate-500 font-medium">
                    New to GridNest? <Link to="/register" className="text-primary-600 font-black hover:underline">Join Now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
