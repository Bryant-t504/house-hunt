import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, UserCheck, AlertTriangle, Lock, Flag, CheckCircle, ArrowRight, Shield, FileWarning, HeartHandshake } from 'lucide-react';

const SafetyCenter = () => {
    const pillars = [
        { icon: Eye, title: 'Listing Verification', description: 'Every property listing is manually reviewed by our team before going live. We verify photos, descriptions, pricing, and landlord identity.' },
        { icon: UserCheck, title: 'Identity Checks', description: 'Landlords must provide valid identification during registration. This creates accountability and builds trust across the platform.' },
        { icon: Flag, title: 'Community Reporting', description: 'Users can report suspicious listings, inappropriate behavior, or fraud. Our team investigates all reports within 48 hours.' },
        { icon: Lock, title: 'Secure Communication', description: 'All conversations happen within our encrypted platform. We keep records to protect both tenants and landlords in case of disputes.' },
    ];

    const dosDonts = {
        dos: [
            'Always view a property in person before committing',
            'Keep all communication within the GridNest platform',
            'Verify the landlord\'s identity before sharing personal details',
            'Report any suspicious activity or listings immediately',
            'Read the full property description and terms carefully',
            'Bring someone with you when viewing a property for the first time',
        ],
        donts: [
            'Never pay rent or deposits before physically viewing the property',
            'Don\'t share banking details or passwords with anyone on the platform',
            'Don\'t agree to off-platform transactions',
            'Never send money to unknown accounts based on a listing alone',
            'Don\'t ignore red flags like pressure to pay immediately',
            'Don\'t share your account credentials with anyone',
        ],
    };

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <Shield size={14} /> Safety & Trust
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            Safety & Trust <span className="text-primary-500">Center</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Your safety is our top priority. Learn about the measures we take to protect every user on GridNest and how you can stay safe.
                        </p>
                    </div>
                </div>
            </section>

            {/* Trust Pillars */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How We Keep You Safe</h2>
                        <p className="text-lg text-slate-500 font-medium">GridNest is built on four pillars of trust and safety.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pillars.map((p, i) => (
                            <div key={i} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                                    <p.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{p.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Do's and Don'ts */}
            <section className="py-24 bg-white border-y border-primary-100/50">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Do's & Don'ts</h2>
                        <p className="text-lg text-slate-500 font-medium">Follow these guidelines to protect yourself when using GridNest.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="card-saas p-10 border-none shadow-saas bg-emerald-50/30">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-emerald-700">Do</h3>
                            </div>
                            <ul className="space-y-4">
                                {dosDonts.dos.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                                        <CheckCircle size={18} className="text-emerald-500 mt-1 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-saas p-10 border-none shadow-saas bg-rose-50/30">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-rose-700">Don't</h3>
                            </div>
                            <ul className="space-y-4">
                                {dosDonts.donts.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                                        <AlertTriangle size={18} className="text-rose-500 mt-1 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Report */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto card-saas p-12 border-none shadow-saas-lg flex flex-col md:flex-row items-center gap-10">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center shrink-0">
                            <FileWarning size={40} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Report a Safety Concern</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                If you encounter fraud, harassment, or any safety issue, please report it immediately. You can report directly from any property listing page, or contact our safety team at <a href="mailto:safety@gridnest.com" className="text-primary-600 font-bold hover:underline">safety@gridnest.com</a>.
                            </p>
                        </div>
                        <Link to="/contact" className="btn-primary px-8 py-4 shrink-0">
                            Report Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary-900">
                <div className="container-custom text-center">
                    <HeartHandshake size={48} className="mx-auto text-primary-200 mb-8" />
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Together, we build trust</h2>
                    <p className="text-xl text-primary-200 font-medium mb-12 max-w-xl mx-auto">
                        GridNest is a community. By following our safety guidelines, you help create a safer experience for everyone.
                    </p>
                    <Link to="/" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl inline-flex">
                        Browse Verified Properties <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default SafetyCenter;
