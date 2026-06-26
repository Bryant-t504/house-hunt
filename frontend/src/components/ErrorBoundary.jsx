import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('GridNest ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-primary-50/20 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <AlertTriangle className="w-12 h-12 text-rose-400" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-3">Something went wrong</h2>
                        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                            An unexpected error occurred. Please refresh the page or try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary px-8 py-3.5 inline-flex"
                        >
                            <RefreshCw size={18} /> Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
