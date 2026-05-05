import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Home, MessageSquare, LayoutDashboard, PlusCircle, LogOut, User, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link 
            to={to} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary-900 hover:bg-primary-50/50 rounded-xl transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
        >
            <Icon size={18} strokeWidth={2.5} />
            {children}
        </Link>
    );

    return (
        <nav className="glass-nav border-b border-slate-100 h-20 flex items-center">
            <div className="container-custom flex justify-between items-center w-full">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-900/10 group-hover:scale-105 transition-transform duration-500">
                        <Home size={22} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors duration-300">
                        Grid<span className="text-primary-500">Nest</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2 ml-auto mr-8">
                    <NavLink to="/" icon={Home}>Home</NavLink>
                    {user && (
                        <>
                            <NavLink to="/chat" icon={MessageSquare}>Inbox</NavLink>
                            <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                            {user.role === 'landlord' && (
                                <NavLink to="/add-property" icon={PlusCircle}>List Property</NavLink>
                            )}
                            {user.role === 'admin' && (
                                <NavLink to="/admin-center" icon={ShieldCheck}>Admin</NavLink>
                            )}
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">


                    {user ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <button 
                                onClick={handleLogout}
                                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                            <div className="w-10 h-10 bg-primary-50 text-primary-900 rounded-2xl flex items-center justify-center font-black border border-primary-100/50 shadow-sm">
                                {user.username[0].toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="btn-ghost">Log in</Link>
                            <Link to="/register" className="btn-primary py-2 px-5">Join Now</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button 
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-white border-b border-slate-200 p-4 flex flex-col gap-2 md:hidden shadow-xl animate-in">
                    <NavLink to="/" icon={Home}>Home</NavLink>
                    {user && (
                        <>
                            <NavLink to="/chat" icon={MessageSquare}>Inbox</NavLink>
                            <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                            {user.role === 'landlord' && (
                                <NavLink to="/add-property" icon={PlusCircle}>List Property</NavLink>
                            )}
                            {user.role === 'admin' && (
                                <NavLink to="/admin-center" icon={ShieldCheck}>Admin</NavLink>
                            )}
                        </>
                    )}
                    {!user && (
                        <div className="grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-slate-100">
                            <Link to="/login" className="btn-secondary">Log in</Link>
                            <Link to="/register" className="btn-primary">Sign up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
