import { Link } from 'react-router-dom';
import { Users, Search, CalendarCheck, MessageSquare, ShieldCheck, Star, AlertTriangle, CheckCircle, ArrowRight, Eye, Lightbulb } from 'lucide-react';

const TenantGuide = () => {
    const steps = [
        { num: '01', icon: Search, title: 'Search Smart', desc: 'Use filters to narrow down your search by city, price range, property type, and bedrooms. The more specific you are, the faster you\'ll find the right fit.' },
        { num: '02', icon: Eye, title: 'Review Listings Carefully', desc: 'Check photos, amenities, location, and landlord details. Look for the "Verified" badge — it means our team has personally reviewed the listing.' },
        { num: '03', icon: CalendarCheck, title: 'Book a Viewing', desc: 'Click "Request to Book" on any property page. Choose a convenient date and time. You can add a message to introduce yourself to the landlord.' },
        { num: '04', icon: MessageSquare, title: 'Chat with the Landlord', desc: 'Use the built-in chat to ask questions about utilities, lease terms, neighborhood safety, or anything else before committing.' },
    ];

    const tips = [
        { icon: ShieldCheck, title: 'Always Visit in Person', description: 'Never commit to a property without physically seeing it first. GridNest facilitates viewings to make this easy.' },
        { icon: Star, title: 'Read the Full Description', description: 'Pay attention to details about utilities, deposit requirements, and lease duration before booking a viewing.' },
        { icon: AlertTriangle, title: 'Never Pay Before Viewing', description: 'Legitimate landlords will never ask for payment before you\'ve seen the property. Report anyone who does.' },
        { icon: MessageSquare, title: 'Communicate on the Platform', description: 'Keep all conversations within GridNest\'s built-in chat. This protects both you and the landlord and creates a record of agreements.' },
        { icon: Lightbulb, title: 'Check the Neighborhood', description: 'Research the area around the property. Look into public transport, proximity to your university or workplace, and local amenities.' },
        { icon: CheckCircle, title: 'Trust Your Instincts', description: 'If something feels off about a listing or a landlord\'s behavior, trust your gut. Report suspicious activity immediately.' },
    ];

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <Users size={14} /> Tenant Resources
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            Tenant <span className="text-primary-500">Guide</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Your complete guide to finding safe, affordable housing on GridNest. We've got your back every step of the way.
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="max-w-4xl">
                        <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">How to Find Your Home</h2>
                        <div className="space-y-8">
                            {steps.map((step, i) => (
                                <div key={i} className="card-saas p-10 border-none shadow-saas flex items-start gap-8">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <step.icon size={28} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Step {step.num}</span>
                                        <h3 className="text-2xl font-black text-slate-900 mb-3 mt-1">{step.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed text-lg">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety Tips */}
            <section className="py-24 bg-white border-y border-primary-100/50">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Safety Tips for Tenants</h2>
                        <p className="text-lg text-slate-500 font-medium">Your safety is our priority. Follow these tips to protect yourself during your housing search.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tips.map((tip, i) => (
                            <div key={i} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg">
                                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                                    <tip.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">{tip.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to find your perfect home?</h2>
                    <p className="text-xl text-primary-200 font-medium mb-12 max-w-xl mx-auto">Join thousands of students who've already found safe, verified housing on GridNest.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl">
                            Browse Properties <ArrowRight size={20} />
                        </Link>
                        <Link to="/register" className="btn-secondary border-primary-700 text-primary-200 hover:bg-primary-800 px-10 py-4 text-lg">
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TenantGuide;
