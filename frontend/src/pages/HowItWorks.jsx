import { Link } from 'react-router-dom';
import { Search, UserPlus, CalendarCheck, MessageSquare, ShieldCheck, Home, ArrowRight, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    const tenantSteps = [
        { step: 1, icon: Search, title: 'Browse & Search', description: 'Explore hundreds of verified listings. Filter by city, price, property type, and number of bedrooms to find your perfect match.' },
        { step: 2, icon: ShieldCheck, title: 'Verified Listings', description: 'Every property on GridNest is verified by our team. Look for the green "Verified" badge for extra peace of mind.' },
        { step: 3, icon: CalendarCheck, title: 'Book a Viewing', description: 'Found a place you love? Request a viewing with one click. Choose your preferred date and time, and the landlord will confirm.' },
        { step: 4, icon: MessageSquare, title: 'Chat & Move In', description: 'Communicate directly with landlords via our built-in chat. Ask questions, negotiate terms, and finalize your move.' },
    ];

    const landlordSteps = [
        { step: 1, icon: UserPlus, title: 'Create Your Account', description: 'Sign up as a landlord for free. It takes less than 2 minutes to get started.' },
        { step: 2, icon: Home, title: 'List Your Property', description: 'Add your property details, upload high-quality photos, set your price, and submit for verification.' },
        { step: 3, icon: ShieldCheck, title: 'Get Verified', description: 'Our team reviews your listing within 24-48 hours. Once approved, your property goes live and is visible to thousands of tenants.' },
        { step: 4, icon: CalendarCheck, title: 'Manage Bookings', description: 'Receive booking requests, approve or decline viewings, and manage all your properties from your dashboard.' },
    ];

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest justify-center">
                            <CheckCircle size={14} /> How It Works
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            Simple, safe, and <span className="text-primary-500">seamless</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            Whether you're looking for a home or listing your property, GridNest makes the process effortless. Here's how it works.
                        </p>
                    </div>
                </div>
            </section>

            {/* For Tenants */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center mb-20">
                        <span className="badge-saas bg-primary-100 text-primary-600 mb-4 inline-block">For Tenants</span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Find your next home in 4 easy steps</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tenantSteps.map((step, i) => (
                            <div key={i} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg text-center relative">
                                <div className="absolute top-6 right-6 text-7xl font-black text-primary-50">{step.step}</div>
                                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10">
                                    <step.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 relative z-10">{step.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed relative z-10">{step.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/register" className="btn-primary inline-flex px-10 py-4 text-lg">
                            Start Searching <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* For Landlords */}
            <section className="py-24 bg-white border-y border-primary-100/50">
                <div className="container-custom">
                    <div className="text-center mb-20">
                        <span className="badge-saas bg-primary-100 text-primary-600 mb-4 inline-block">For Landlords</span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">List your property and start earning</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {landlordSteps.map((step, i) => (
                            <div key={i} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg text-center relative">
                                <div className="absolute top-6 right-6 text-7xl font-black text-primary-50">{step.step}</div>
                                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 relative z-10">
                                    <step.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 relative z-10">{step.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed relative z-10">{step.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/register" className="btn-primary inline-flex px-10 py-4 text-lg">
                            List Your Property <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to get started?</h2>
                    <p className="text-xl text-primary-200 font-medium mb-12 max-w-xl mx-auto">Join GridNest today and experience a smarter, safer way to rent.</p>
                    <Link to="/register" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl inline-flex">
                        Create Your Free Account <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HowItWorks;
