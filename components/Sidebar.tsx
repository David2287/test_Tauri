import React from 'react';
import { View } from '../types';
import { HomeIcon, SearchIcon, ClockIcon, CogIcon, CloudDownloadIcon, ShieldCheckIcon, LogoutIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: View;
  currentView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, currentView, onClick }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-brand-accent text-white'
          : 'text-gray-400 hover:bg-brand-light hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const navItems = [
    { icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard', view: View.Dashboard },
    { icon: <SearchIcon className="h-5 w-5" />, label: 'Scan', view: View.Scan },
    { icon: <CloudDownloadIcon className="h-5 w-5" />, label: 'Updates', view: View.Updates },
    { icon: <ClockIcon className="h-5 w-5" />, label: 'History', view: View.History },
    { icon: <CogIcon className="h-5 w-5" />, label: 'Settings', view: View.Settings },
  ];

  return (
    <nav className="w-64 bg-brand-secondary p-4 flex flex-col">
        <div className="flex items-center space-x-3 p-2 mb-6">
            <ShieldCheckIcon className="h-10 w-10 text-brand-accent"/>
            <span className="text-2xl font-bold text-white">AV Shield</span>
        </div>
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            view={item.view}
            currentView={currentView}
            onClick={setCurrentView}
          />
        ))}
      </div>
      <div className="mt-auto">
         <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-brand-light hover:text-white transition-colors duration-200"
          >
            <LogoutIcon className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
      </div>
    </nav>
  );
};

export default Sidebar;
