import { FileText } from 'lucide-react';

const Terms = () => {
    const lastUpdated = 'June 19, 2026';

    return (
        <div className="min-h-screen bg-primary-50/20">
            <section className="pt-24 pb-16 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <FileText size={14} /> Legal
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-4 tracking-tight">Terms of Service</h1>
                        <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <div className="card-saas p-10 md:p-16 border-none shadow-saas-lg space-y-10 text-slate-600 leading-relaxed [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6">
                            <p className="text-lg">
                                Welcome to GridNest. These Terms of Service ("Terms") govern your access to and use of the GridNest platform ("Service"). By using our Service, you agree to be bound by these Terms.
                            </p>

                            <h2>1. Acceptance of Terms</h2>
                            <p>By creating an account or using GridNest, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our Service.</p>

                            <h2>2. User Accounts</h2>
                            <h3>Registration</h3>
                            <p>To use certain features, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.</p>
                            <h3>Account Security</h3>
                            <p>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.</p>
                            <h3>Account Types</h3>
                            <ul>
                                <li><strong>Tenant:</strong> Can browse listings, book viewings, and communicate with landlords.</li>
                                <li><strong>Landlord:</strong> Can list properties, manage bookings, and communicate with tenants.</li>
                                <li><strong>Admin:</strong> GridNest staff with platform management capabilities.</li>
                            </ul>

                            <h2>3. Property Listings</h2>
                            <p>Landlords who list properties on GridNest agree that:</p>
                            <ul>
                                <li>All listing information, including photos and descriptions, must be accurate and truthful.</li>
                                <li>Prices listed must reflect the actual rental cost without hidden fees.</li>
                                <li>Properties must comply with all applicable local housing regulations.</li>
                                <li>GridNest reserves the right to remove or suspend any listing that violates these Terms.</li>
                            </ul>

                            <h2>4. Booking & Viewings</h2>
                            <p>Booking requests made through GridNest are subject to landlord approval. GridNest facilitates the connection between tenants and landlords but is not a party to any rental agreement. Users are responsible for conducting their own due diligence.</p>

                            <h2>5. User Conduct</h2>
                            <p>You agree not to:</p>
                            <ul>
                                <li>Post false, misleading, or fraudulent content</li>
                                <li>Harass, threaten, or abuse other users</li>
                                <li>Use the platform for any illegal purpose</li>
                                <li>Attempt to gain unauthorized access to the platform or other user accounts</li>
                                <li>Scrape, copy, or extract data from the platform without authorization</li>
                                <li>Circumvent or manipulate our verification processes</li>
                            </ul>

                            <h2>6. Content Ownership</h2>
                            <p>You retain ownership of content you post on GridNest. By posting content, you grant GridNest a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the Service.</p>

                            <h2>7. Verification & Trust</h2>
                            <p>GridNest's verification process is designed to enhance trust but does not constitute a guarantee. We verify listing information to the best of our ability, but users should exercise their own judgment when making housing decisions.</p>

                            <h2>8. Limitation of Liability</h2>
                            <p>GridNest provides a platform for connecting tenants and landlords. We are not responsible for:</p>
                            <ul>
                                <li>The condition or quality of any listed property</li>
                                <li>Actions or omissions of any user</li>
                                <li>Disputes between tenants and landlords</li>
                                <li>Any loss or damage arising from the use of our Service</li>
                            </ul>

                            <h2>9. Termination</h2>
                            <p>We may suspend or terminate your account at our discretion if you violate these Terms. You may also delete your account at any time by contacting our support team.</p>

                            <h2>10. Changes to Terms</h2>
                            <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms. We will notify users of material changes via email or platform notification.</p>

                            <h2>11. Governing Law</h2>
                            <p>These Terms are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya.</p>

                            <h2>12. Contact</h2>
                            <p>For questions about these Terms, please contact us at:</p>
                            <ul>
                                <li>Email: <a href="mailto:legal@gridnest.com" className="text-primary-600 hover:underline font-bold">legal@gridnest.com</a></li>
                                <li>Address: Westlands Business District, Nairobi, Kenya</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Terms;
