import React from 'react';
import { ShieldCheckIcon } from '../Icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-brand-dark text-gray-200 flex flex-col items-center justify-center p-4 font-sans">
        <div className="flex items-center space-x-3 mb-8">
            <ShieldCheckIcon className="h-12 w-12 text-brand-accent"/>
            <span className="text-4xl font-bold text-white">AV Shield Pro</span>
        </div>
        {children}
    </div>
  );
};

export default AuthLayout;
