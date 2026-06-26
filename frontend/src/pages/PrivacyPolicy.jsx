import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    const lastUpdated = 'June 19, 2026';

    return (
        <div className="min-h-screen bg-primary-50/20">
            <section className="pt-24 pb-16 bg-primary-50 border-b border-primary-100/50">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-primary-600 font-black mb-6 uppercase text-[10px] tracking-widest">
                            <FileText size={14} /> Legal
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-4 tracking-tight">Privacy Policy</h1>
                        <p className="text-slate-500 font-medium">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto prose prose-lg prose-slate">
                        <div className="card-saas p-10 md:p-16 border-none shadow-saas-lg space-y-10 text-slate-600 leading-relaxed [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6">
                            <p className="text-lg">
                                At GridNest ("we", "us", or "our"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at gridnest.com (the "Service").
                            </p>

                            <h2>1. Information We Collect</h2>
                            <h3>Personal Information</h3>
                            <p>When you register or use our Service, we may collect:</p>
                            <ul>
                                <li>Full name, email address, phone number</li>
                                <li>Username and password (encrypted)</li>
                                <li>User role (tenant, landlord, or admin)</li>
                                <li>Property listing details (for landlords)</li>
                                <li>Booking and viewing history</li>
                                <li>Chat messages between users</li>
                            </ul>

                            <h3>Automatically Collected Information</h3>
                            <p>When you access our Service, we automatically collect:</p>
                            <ul>
                                <li>Device type, browser type, and operating system</li>
                                <li>IP address and approximate location</li>
                                <li>Pages visited and time spent on each page</li>
                                <li>Referring URL and exit pages</li>
                            </ul>

                            <h2>2. How We Use Your Information</h2>
                            <p>We use the collected information to:</p>
                            <ul>
                                <li>Provide, maintain, and improve our Service</li>
                                <li>Facilitate property listings, bookings, and messaging</li>
                                <li>Verify landlord and property authenticity</li>
                                <li>Send you notifications about bookings and messages</li>
                                <li>Respond to your inquiries and support requests</li>
                                <li>Prevent fraud and ensure platform safety</li>
                                <li>Analyze usage patterns to improve user experience</li>
                            </ul>

                            <h2>3. Information Sharing</h2>
                            <p>We do not sell, trade, or rent your personal information. We may share information only in these circumstances:</p>
                            <ul>
                                <li><strong>Between Users:</strong> Your username and public profile are visible to other users when you list properties or initiate conversations.</li>
                                <li><strong>Service Providers:</strong> We may share information with trusted third-party services that help us operate our platform (e.g., cloud hosting, analytics).</li>
                                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                            </ul>

                            <h2>4. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your data, including:</p>
                            <ul>
                                <li>Encrypted passwords using bcrypt hashing</li>
                                <li>JWT-based authentication with token rotation</li>
                                <li>HTTPS encryption for all data in transit</li>
                                <li>Regular security audits and vulnerability assessments</li>
                            </ul>

                            <h2>5. Data Retention</h2>
                            <p>We retain your personal information for as long as your account is active or as needed to provide you with our Service. You may request deletion of your account and associated data at any time by contacting us.</p>

                            <h2>6. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Withdraw consent at any time</li>
                                <li>Object to data processing</li>
                            </ul>

                            <h2>7. Cookies</h2>
                            <p>We use essential cookies to maintain your session and authentication. We do not use advertising or tracking cookies. By using our Service, you consent to our use of essential cookies.</p>

                            <h2>8. Changes to This Policy</h2>
                            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.</p>

                            <h2>9. Contact Us</h2>
                            <p>If you have questions about this Privacy Policy, please contact us at:</p>
                            <ul>
                                <li>Email: <a href="mailto:privacy@gridnest.com" className="text-primary-600 hover:underline font-bold">privacy@gridnest.com</a></li>
                                <li>Address: Westlands Business District, Nairobi, Kenya</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
