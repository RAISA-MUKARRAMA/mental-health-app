import React from 'react';
// import { useNavigate } from '../utils/navigation';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (you can also log to an error reporting service)
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use a functional component to access the navigate hook
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

// Separate functional component to use the navigate hook
const ErrorFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Something broke 😬
        </h1>

        <p className="text-gray-600 mb-4">
          Check the console for the real error.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Reload
        </button>

        <button
          onClick={() => window.location.href = '/'}
          className="ml-3 bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;