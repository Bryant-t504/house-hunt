import { Link } from 'react-router-dom';
import { Home, Users, ShieldCheck, Heart, Target, Sparkles, ArrowRight } from 'lucide-react';

const About = () => {
    const values = [
        { icon: ShieldCheck, title: 'Trust & Safety', description: 'Every listing is verified. Every landlord is vetted. We believe finding a home should never feel like a gamble.' },
        { icon: Heart, title: 'Community First', description: 'GridNest is more than a platform — it\'s a community of students, tenants, and landlords who care about each other.' },
        { icon: Target, title: 'Transparency', description: 'No hidden fees. No bait-and-switch listings. What you see is exactly what you get, every single time.' },
        { icon: Sparkles, title: 'Innovation', description: 'We use smart technology — real-time chat, instant booking, and intelligent matching — to make renting effortless.' },
    ];

    const team = [
        { name: 'Brian Kimathi', role: 'Founder & CEO', initials: 'BK' },
        { name: 'Amina Osei', role: 'Head of Product', initials: 'AO' },
        { name: 'James Mwangi', role: 'Lead Engineer', initials: 'JM' },
        { name: 'Grace Wanjiku', role: 'Community Manager', initials: 'GW' },
    ];

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-transparent pointer-events-none"></div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <Home size={14} /> About GridNest
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            We're building a <br/>
                            <span className="text-primary-500">better way</span> to find home
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            GridNest was born from a simple frustration: finding safe, affordable student housing shouldn't be stressful. We're here to change that — one verified listing at a time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Our Story</h2>
                            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                <p>
                                    It all started when our founder, a university student in Nairobi, spent weeks searching for a safe, affordable place to live. The process was exhausting — misleading photos, unresponsive landlords, and zero transparency.
                                </p>
                                <p>
                                    That experience sparked an idea: what if there was a platform that treated renters with respect? A place where every listing was verified, every landlord was accountable, and every student could find a home that actually felt like home?
                                </p>
                                <p>
                                    GridNest is the result. We've built a PropTech platform specifically designed for students and young professionals in Kenya, connecting them with verified landlords who care about their tenants' well-being.
                                </p>
                            </div>
                        </div>
                        <div className="bg-primary-100/50 rounded-[3rem] p-12 border border-primary-200/30">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center">
                                    <p className="text-5xl font-black text-primary-600 mb-2">500+</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verified Listings</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-5xl font-black text-primary-600 mb-2">2K+</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Happy Tenants</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-5xl font-black text-primary-600 mb-2">5</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Kenyan Cities</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-5xl font-black text-primary-600 mb-2">98%</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Satisfaction Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-white border-y border-primary-100/50">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">What We Stand For</h2>
                        <p className="text-lg text-slate-500 font-medium">Our values aren't just words on a page. They guide every feature we build and every decision we make.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="card-saas p-10 border-none shadow-saas hover:shadow-saas-lg">
                                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-8">
                                    <v.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{v.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Meet Our Team</h2>
                        <p className="text-lg text-slate-500 font-medium">A passionate group of builders, designers, and problem-solvers united by a single mission: making housing accessible for everyone.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div key={i} className="card-saas p-8 text-center border-none shadow-saas hover:shadow-saas-lg group">
                                <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-[2rem] flex items-center justify-center text-3xl font-black mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                                    {member.initials}
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-1">{member.name}</h4>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to find your next home?</h2>
                    <p className="text-xl text-primary-200 font-medium mb-12 max-w-xl mx-auto">Join thousands of students and tenants who trust GridNest to find safe, verified housing.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn-primary bg-white text-primary-900 hover:bg-primary-50 px-10 py-4 text-lg shadow-xl">
                            Get Started <ArrowRight size={20} />
                        </Link>
                        <Link to="/how-it-works" className="btn-secondary border-primary-700 text-primary-200 hover:bg-primary-800 px-10 py-4 text-lg">
                            Learn How It Works
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
