import { Link } from 'react-router-dom';
import { Home, Mail, MapPin, Phone, Globe, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <Home size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-black tracking-tight text-slate-900">
                                Grid<span className="text-primary-600">Nest</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Simplifying property management and discovery for the modern world. Find your next home with confidence.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"><Globe size={18} /></a>
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"><MessageCircle size={18} /></a>
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"><Send size={18} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-[10px] tracking-widest">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">Browse Properties</Link></li>
                            <li><Link to="/register" className="text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">Become a Landlord</Link></li>
                            <li><Link to="/dashboard" className="text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">Booking Requests</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-[10px] tracking-widest">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">About Us</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-[10px] tracking-widest">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                <Mail size={16} className="text-slate-400" />
                                hello@gridnest.com
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                <Phone size={16} className="text-slate-400" />
                                +1 (555) 000-0000
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                                <MapPin size={16} className="text-slate-400" />
                                San Francisco, CA
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-semibold">
                    <p>© 2026 GridNest PropTech. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-900 transition-colors">Cookie Settings</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
