import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => (
    <div className="min-h-[85vh] flex items-center justify-center bg-primary-50/20 px-4">
        <div className="text-center max-w-lg animate-in">
            <div className="text-[10rem] font-black text-primary-100 leading-none select-none mb-2">404</div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight -mt-8">Page Not Found</h1>
            <p className="text-lg text-slate-500 font-medium mb-10 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn-primary px-8 py-4">
                    <Home size={18} /> Return Home
                </Link>
                <Link to="/dashboard" className="btn-secondary px-8 py-4">
                    <ArrowLeft size={18} /> Go to Dashboard
                </Link>
            </div>
        </div>
    </div>
);

export default NotFound;
