import { Link } from 'react-router-dom';
import { Building2, Camera, DollarSign, ShieldCheck, MessageSquare, BarChart3, CheckCircle, ArrowRight, AlertTriangle, Lightbulb } from 'lucide-react';

const LandlordGuide = () => {
    const tips = [
        { icon: Camera, title: 'Take Great Photos', description: 'Use natural lighting, capture every room, and show the surrounding area. Listings with quality photos get 3x more views.' },
        { icon: DollarSign, title: 'Price Competitively', description: 'Research similar listings in your area. Competitive pricing attracts more tenants and reduces vacancy time.' },
        { icon: MessageSquare, title: 'Respond Quickly', description: 'Reply to booking requests within 24 hours. Fast response times build trust and improve your visibility on the platform.' },
        { icon: ShieldCheck, title: 'Complete Verification', description: 'Get your property verified as soon as possible. Verified listings receive significantly more engagement from tenants.' },
        { icon: BarChart3, title: 'Track Performance', description: 'Use your dashboard to monitor views, booking requests, and messages. Optimize your listing based on data.' },
        { icon: Lightbulb, title: 'Write Detailed Descriptions', description: 'Mention nearby universities, transport, amenities, and what makes your property unique. Tenants love details.' },
    ];

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <Building2 size={14} /> Landlord Resources
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            Landlord <span className="text-primary-500">Guide</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Everything you need to know to successfully list, manage, and grow your rental business on GridNest.
                        </p>
                    </div>
                </div>
            </section>

            {/* Getting Started */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="max-w-4xl">
                        <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Getting Started</h2>
                        <div className="space-y-8">
                            {[
                                { num: '01', title: 'Create Your Landlord Account', desc: 'Sign up for free and select "Landlord" as your role. This gives you access to the property management dashboard.' },
                                { num: '02', title: 'Add Your First Property', desc: 'Navigate to "List Property" from the navigation bar. Fill in all details including title, description, location, price, bedrooms, bathrooms, and amenities. Upload clear, well-lit photos.' },
                                { num: '03', title: 'Submit for Verification', desc: 'Once submitted, our team will review your listing within 24-48 hours. You\'ll receive a notification when it\'s approved.' },
                                { num: '04', title: 'Start Receiving Requests', desc: 'Tenants can now find and request viewings for your property. Manage everything from your dashboard.' },
                            ].map((step, i) => (
                                <div key={i} className="card-saas p-10 border-none shadow-saas flex items-start gap-8">
                                    <div className="text-5xl font-black text-primary-100 shrink-0">{step.num}</div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-3">{step.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed text-lg">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-24 bg-white border-y border-primary-100/50">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Tips for Success</h2>
                        <p className="text-lg text-slate-500 font-medium">Follow these best practices to maximize your property's visibility and attract quality tenants.</p>
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

            {/* Important Notes */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto card-saas p-12 border-none shadow-saas-lg bg-amber-50/50">
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">Important Guidelines</h3>
                                <ul className="space-y-3 text-slate-600 font-medium">
                                    <li className="flex items-start gap-3"><CheckCircle size={18} className="text-amber-500 mt-1 shrink-0" /> All listings must include accurate and truthful information</li>
                                    <li className="flex items-start gap-3"><CheckCircle size={18} className="text-amber-500 mt-1 shrink-0" /> Photos must be of the actual property — stock photos are not allowed</li>
                                    <li className="flex items-start gap-3"><CheckCircle size={18} className="text-amber-500 mt-1 shrink-0" /> Prices must reflect the actual rental cost without hidden fees</li>
                                    <li className="flex items-start gap-3"><CheckCircle size={18} className="text-amber-500 mt-1 shrink-0" /> Respond to booking requests within 48 hours to maintain good standing</li>
                                    <li className="flex items-start gap-3"><CheckCircle size={18} className="text-amber-500 mt-1 shrink-0" /> Violations may result in listing removal or account suspension</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to list your property?</h2>
                    <p className="text-xl text-primary-200 font-medium mb-12 max-w-xl mx-auto">Start reaching thousands of verified tenants today. It's free to get started.</p>
                    <Link to="/register" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl inline-flex">
                        Create Landlord Account <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandlordGuide;
