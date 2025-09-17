
import React from 'react';
import { ScanType } from '../types';
import { ShieldCheckIcon, ShieldExclamationIcon, SearchIcon, FastForwardIcon } from './Icons';

interface DashboardProps {
  startScan: (scanType: ScanType) => void;
  isProtected: boolean;
}

const StatusCard: React.FC<{ isProtected: boolean }> = ({ isProtected }) => {
  return (
    <div className={`rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors duration-300 ${isProtected ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        {isProtected ? (
            <ShieldCheckIcon className="h-24 w-24 text-brand-accent" />
        ) : (
            <ShieldExclamationIcon className="h-24 w-24 text-brand-danger" />
        )}
      <h2 className={`mt-4 text-3xl font-bold ${isProtected ? 'text-green-300' : 'text-red-300'}`}>
        {isProtected ? 'You are protected' : 'Your system is at risk'}
      </h2>
      <p className="mt-2 text-gray-400 max-w-md">
        {isProtected
          ? 'All protection layers are active. Your last scan was yesterday and no threats were found.'
          : 'Threats have been detected on your system. Run a scan to remove them.'}
      </p>
    </div>
  );
};

const ScanButton: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-brand-light p-6 rounded-lg text-left w-full hover:bg-gray-600 transition-transform transform hover:-translate-y-1 duration-200 ease-in-out">
        <div className="flex items-center">
            {icon}
            <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ startScan, isProtected }) => {
  return (
    <div className="space-y-8">
      <StatusCard isProtected={isProtected} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScanButton 
            icon={<FastForwardIcon className="h-10 w-10 text-brand-accent"/>}
            title="Quick Scan"
            description="Checks the most common areas for threats quickly."
            onClick={() => startScan(ScanType.Quick)}
        />
        <ScanButton 
            icon={<SearchIcon className="h-10 w-10 text-blue-400"/>}
            title="Full System Scan"
            description="A comprehensive scan of your entire system."
            onClick={() => startScan(ScanType.Full)}
        />
      </div>

      <div className="bg-brand-secondary p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Protection Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
                <p className="text-2xl font-bold text-brand-accent">1,204</p>
                <p className="text-sm text-gray-400">Threats Blocked</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-blue-400">8,451,234</p>
                <p className="text-sm text-gray-400">Files Scanned</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-white">Today</p>
                <p className="text-sm text-gray-400">Last Update</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-white">Active</p>
                <p className="text-sm text-gray-400">Firewall</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
