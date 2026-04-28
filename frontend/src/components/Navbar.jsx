import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Home, LogOut, User, Menu, X, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <Home className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                GridNest
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                            Explore
                        </Link>
                        
                        {user && (
                            <Link to="/chat" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Inbox
                            </Link>
                        )}
                        
                        {user?.is_staff && (
                            <Link to="/admin-center" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">
                                Admin
                            </Link>
                        )}
                        
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100 transition-colors">
                                    <User className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-semibold text-slate-700">{user.username}</span>
                                    <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                        {user.role}
                                    </span>
                                </Link>
                                <button 
                                    onClick={logoutUser}
                                    className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium px-4 py-2">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
                            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
                    <Link to="/" className="block py-2 text-slate-600 font-medium">Explore</Link>
                    {user && (
                        <Link to="/chat" className="block py-2 text-slate-600 font-medium flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Inbox
                        </Link>
                    )}
                    {user ? (
                        <>
                            <div className="py-2 border-t border-slate-50">
                                <p className="text-sm text-slate-500">Logged in as</p>
                                <p className="font-bold text-slate-800">{user.username} ({user.role})</p>
                            </div>
                            <button onClick={logoutUser} className="block w-full text-left py-2 text-red-600 font-medium">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                            <Link to="/login" className="py-3 text-center text-slate-600 font-medium bg-slate-50 rounded-xl">Sign In</Link>
                            <Link to="/register" className="py-3 text-center btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
