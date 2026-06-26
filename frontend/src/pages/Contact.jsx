import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, MessageSquare, LoaderCircle } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    const contactInfo = [
        { icon: Mail, label: 'Email Us', value: 'hello@gridnest.com', description: 'We respond within 24 hours' },
        { icon: Phone, label: 'Call Us', value: '+254 700 000 000', description: 'Mon - Fri, 9am - 6pm EAT' },
        { icon: MapPin, label: 'Visit Us', value: 'Nairobi, Kenya', description: 'Westlands Business District' },
        { icon: Clock, label: 'Business Hours', value: 'Mon - Fri', description: '9:00 AM - 6:00 PM EAT' },
    ];

    return (
        <div className="min-h-screen bg-primary-50/20">
            {/* Hero */}
            <section className="pt-24 pb-32 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <MessageSquare size={14} /> Get In Touch
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            We'd love to <br />
                            <span className="text-primary-500">hear from you</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Have a question, concern, or just want to say hello? Our team is here to help you every step of the way.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="card-saas p-10 md:p-12 border-none shadow-saas-lg">
                                {submitted ? (
                                    <div className="text-center py-16 animate-in">
                                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle size={48} />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">Message Sent!</h3>
                                        <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto">
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-black text-slate-900 mb-2">Send us a message</h2>
                                        <p className="text-slate-500 font-medium mb-10">Fill out the form below and we'll get back to you as soon as possible.</p>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input type="text" required className="input-saas" placeholder="Enter name.." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                                    <input type="email" required className="input-saas" placeholder="name@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                                <select className="input-saas" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                                                    <option value="">Select a topic</option>
                                                    <option value="general">General Inquiry</option>
                                                    <option value="support">Support</option>
                                                    <option value="listing">Listing Issue</option>
                                                    <option value="partnership">Partnership</option>
                                                    <option value="feedback">Feedback</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                                <textarea required className="input-saas resize-none h-40" placeholder="Tell us how we can help..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                                            </div>
                                            <button type="submit" disabled={isSubmitting} className="btn-primary py-4 px-10 text-lg w-full sm:w-auto">
                                                {isSubmitting ? <LoaderCircle className="w-6 h-6 animate-spin" /> : <><Send size={20} /> Send Message</>}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {contactInfo.map((info, i) => (
                                <div key={i} className="card-saas p-8 border-none shadow-saas hover:shadow-saas-lg flex items-start gap-6">
                                    <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                                        <info.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                                        <p className="text-lg font-black text-slate-900 mb-1">{info.value}</p>
                                        <p className="text-sm text-slate-500 font-medium">{info.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
