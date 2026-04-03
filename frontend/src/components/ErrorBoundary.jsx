import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL APP ERROR:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center font-sans">
          <div className="max-w-xl w-full glass p-8 rounded-md border border-red-500/30 text-center">
            <h1 className="text-3xl font-black mb-4 text-red-500">Oh no! Algo salió mal</h1>
            <p className="text-gray-400 mb-6">Estamos teniendo problemas para cargar esta sección. Por favor, intenta refrescar la página.</p>
            <div className="bg-red-500/10 p-4 rounded-md mb-6 text-left border border-red-500/20 overflow-auto max-h-40">
              <code className="text-red-400 text-sm whitespace-pre-wrap">
                {this.state.error?.toString()}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-all"
            >
              Recargar Sitio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
