import React, { useState, useCallback, useEffect } from 'react';
import { View, ScanType, ScanState, Threat, AuthStatus, LicenseStatus, License } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScanView from './components/ScanView';
import { ShieldCheckIcon, ShieldExclamationIcon, LogoutIcon } from './components/Icons';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ActivationPage from './components/auth/ActivationPage';

// Mock tauri-plugin-store
const store = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [scanState, setScanState] = useState<ScanState>({
    status: 'idle',
    progress: 0,
    filesScanned: 0,
    threatsFound: 0,
    currentFile: '',
    elapsedTime: 0,
    results: [],
  });
  const [isProtected, setIsProtected] = useState(true);
  
  // New state for auth and licensing
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Loading);
  const [license, setLicense] = useState<License | null>(null);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');


  // Check auth status on initial load
  useEffect(() => {
    const token = store.getItem('jwt');
    const storedLicense = store.getItem('license');
    if (token) {
      setAuthStatus(AuthStatus.LoggedIn);
      if (storedLicense) {
        setLicense(JSON.parse(storedLicense));
      }
    } else {
      setAuthStatus(AuthStatus.LoggedOut);
    }
  }, []);

  const handleLoginSuccess = (token: string, remember: boolean) => {
    if (remember) {
        store.setItem('jwt', token);
    }
    const storedLicense = store.getItem('license');
    if (storedLicense) {
      setLicense(JSON.parse(storedLicense));
    }
    setAuthStatus(AuthStatus.LoggedIn);
  };

  const handleRegisterSuccess = (token: string) => {
    // Auto-login and go to activation
    store.setItem('jwt', token);
    setAuthStatus(AuthStatus.LoggedIn);
    setLicense(null); // Ensure activation screen is shown
  };
  
  const handleActivationSuccess = (newLicense: License) => {
    store.setItem('license', JSON.stringify(newLicense));
    setLicense(newLicense);
  };

  const handleLogout = () => {
    store.removeItem('jwt');
    // We could also remove the license, but let's keep it for a better "Remember me" experience
    // store.removeItem('license'); 
    setAuthStatus(AuthStatus.LoggedOut);
    setLicense(null);
    setCurrentView(View.Dashboard);
  };

  const startScan = useCallback((scanType: ScanType) => {
    setCurrentView(View.Scan);
    setScanState({
      status: 'scanning',
      progress: 0,
      filesScanned: 0,
      threatsFound: 0,
      currentFile: 'Initializing scan...',
      elapsedTime: 0,
      results: [],
      scanType: scanType,
    });
    setIsProtected(true); // Assume protection is restored upon starting a scan
  }, []);

  const handleScanComplete = useCallback((results: Threat[]) => {
    if (results.length > 0) {
      setIsProtected(false);
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard startScan={startScan} isProtected={isProtected} />;
      case View.Scan:
        return <ScanView scanState={scanState} setScanState={setScanState} onScanComplete={handleScanComplete} />;
      // Add cases for other views like Updates, History etc.
      default:
        return <Dashboard startScan={startScan} isProtected={isProtected} />;
    }
  };

  if (authStatus === AuthStatus.Loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-brand-dark"><p>Loading...</p></div>
  }

  if (authStatus === AuthStatus.LoggedOut) {
    return authPage === 'login' 
      ? <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setAuthPage('register')} /> 
      : <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setAuthPage('login')} />;
  }
  
  if (!license || license.status === 'missing' || license.status === 'trial_expired') {
    return <ActivationPage onActivationSuccess={handleActivationSuccess} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen w-full bg-brand-dark font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-brand-secondary h-16 flex items-center px-6 shadow-md z-10">
          <h1 className="text-xl font-semibold text-gray-100">AV Shield Pro</h1>
          <div className="ml-auto flex items-center space-x-4">
            {isProtected ? (
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-6 w-6 text-brand-accent" />
                <span className="text-brand-accent font-medium">Protected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ShieldExclamationIcon className="h-6 w-6 text-brand-danger" />
                <span className="text-brand-danger font-medium">At Risk</span>
              </div>
            )}
             <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
