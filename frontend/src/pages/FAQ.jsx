import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Search, MessageSquare, Home, Users, ShieldCheck, CreditCard, Settings, ArrowRight } from 'lucide-react';

const faqData = [
    {
        category: 'Getting Started',
        icon: Home,
        questions: [
            { q: 'What is GridNest?', a: 'GridNest is a PropTech platform designed specifically for students, tenants, and landlords in Kenya. We connect verified landlords with tenants looking for safe, affordable housing near universities and workplaces.' },
            { q: 'How do I create an account?', a: 'Click "Join Now" on the top right of the page. You\'ll need to provide your name, email, phone number, and choose whether you\'re a tenant or landlord. Registration is completely free.' },
            { q: 'Is GridNest free to use?', a: 'Yes! GridNest is completely free for tenants. Landlords can list properties at no charge. We believe everyone deserves access to safe housing without barriers.' },
            { q: 'Which cities does GridNest operate in?', a: 'We currently operate in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret. We\'re expanding to more cities across Kenya soon.' },
        ]
    },
    {
        category: 'For Tenants',
        icon: Users,
        questions: [
            { q: 'How do I book a viewing?', a: 'Find a property you like, click on it, and use the "Request to Book" button on the property detail page. Choose your preferred date and time, add an optional message, and submit. The landlord will review your request.' },
            { q: 'How do I know a listing is genuine?', a: 'Verified listings display a green "Verified" badge. Our team personally reviews each listing to ensure photos, descriptions, and pricing are accurate before approval.' },
            { q: 'Can I message a landlord before booking?', a: 'Absolutely! Every property page has an "Ask a Question" button that opens a direct chat with the landlord. You can ask about anything before committing to a viewing.' },
            { q: 'What if I have a problem with a property?', a: 'You can report any issues directly through the platform. Go to the property detail page and use the report option. Our team investigates all reports within 48 hours.' },
        ]
    },
    {
        category: 'For Landlords',
        icon: Settings,
        questions: [
            { q: 'How do I list my property?', a: 'After signing up as a landlord, click "List Property" in the navigation bar. Fill in your property details, upload high-quality photos, set your price, and submit. Our team will review and verify your listing.' },
            { q: 'How long does verification take?', a: 'Most properties are verified within 24-48 hours. We review photos, descriptions, and pricing for accuracy. You\'ll receive a notification once your listing is approved.' },
            { q: 'Can I manage multiple properties?', a: 'Yes! Your landlord dashboard lets you manage all your listings in one place. You can add, edit, hide, or remove properties at any time.' },
            { q: 'How do booking requests work?', a: 'When a tenant requests a viewing, you\'ll receive a notification. You can approve or decline the request from your dashboard. If approved, you can coordinate details via the built-in chat.' },
        ]
    },
    {
        category: 'Safety & Trust',
        icon: ShieldCheck,
        questions: [
            { q: 'How does GridNest ensure safety?', a: 'We verify every listing before it goes live, require landlord identification, and provide a reporting system for any issues. We also encourage tenants to always view properties in person before committing.' },
            { q: 'What should I do if I encounter fraud?', a: 'Report it immediately through our platform. Use the report function on the property or contact page, or email us at safety@gridnest.com. We take fraud extremely seriously and act swiftly.' },
            { q: 'Is my personal information safe?', a: 'Yes. We use industry-standard encryption and never share your personal information with third parties. Read our Privacy Policy for full details on how we protect your data.' },
        ]
    },
];

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState(0);
    const [openQuestion, setOpenQuestion] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredQuestions = searchQuery
        ? faqData.flatMap(cat => cat.questions.filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())).map(q => ({ ...q, category: cat.category })))
        : faqData[activeCategory].questions;

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest justify-center">
                            <HelpCircle size={14} /> Help Center
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            Frequently Asked <span className="text-primary-500">Questions</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                            Everything you need to know about GridNest. Can't find what you're looking for? Reach out to our support team.
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                className="input-saas pl-14 py-5 text-lg shadow-saas-lg bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container-custom">
                    {!searchQuery && (
                        <div className="flex flex-wrap gap-3 justify-center mb-16">
                            {faqData.map((cat, i) => (
                                <button key={i} onClick={() => { setActiveCategory(i); setOpenQuestion(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeCategory === i ? 'bg-primary-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-primary-100 hover:bg-primary-50'}`}>
                                    <cat.icon size={16} /> {cat.category}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto space-y-4">
                        {filteredQuestions.length > 0 ? filteredQuestions.map((item, i) => (
                            <div key={i} className="card-saas border-none shadow-saas overflow-hidden">
                                <button onClick={() => setOpenQuestion(openQuestion === i ? null : i)} className="w-full p-8 text-left flex items-center justify-between gap-4 hover:bg-primary-50/30 transition-all">
                                    <div>
                                        {searchQuery && item.category && (
                                            <span className="badge-saas bg-primary-50 text-primary-600 mb-3 inline-block">{item.category}</span>
                                        )}
                                        <h3 className="text-lg font-black text-slate-900">{item.q}</h3>
                                    </div>
                                    <ChevronDown size={20} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openQuestion === i ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openQuestion === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-8 pb-8 text-slate-600 font-medium leading-relaxed border-t border-primary-100/30 pt-6">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20">
                                <HelpCircle size={48} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
                                <p className="text-slate-500 font-medium">Try a different search term or browse by category.</p>
                            </div>
                        )}
                    </div>

                    {/* Still Need Help */}
                    <div className="max-w-3xl mx-auto mt-20 card-saas p-12 border-none shadow-saas-lg text-center bg-primary-50">
                        <MessageSquare size={40} className="mx-auto text-primary-600 mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-4">Still have questions?</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                            Can't find what you're looking for? Our support team is always happy to help.
                        </p>
                        <Link to="/contact" className="btn-primary inline-flex px-10 py-4">
                            Contact Support <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
