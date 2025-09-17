import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { License, LicenseStatus } from '../../types';
import { LogoutIcon } from '../Icons';

interface ActivationPageProps {
  onActivationSuccess: (license: License) => void;
  onLogout: () => void;
}

// Mock Tauri command for activating a key
const mockActivateKey = (key: string): Promise<License> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (key === 'XXXX-XXXX-XXXX-VALID') {
                resolve({
                    status: LicenseStatus.Active,
                    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    seats: 1,
                });
            } else if (key === 'XXXX-XXXX-XXXX-USED') {
                reject('License key has already been used.');
            } else {
                reject('Invalid license key format.');
            }
        }, 1000);
    });
};

const ActivationPage: React.FC<ActivationPageProps> = ({ onActivationSuccess, onLogout }) => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formatKey = (value: string) => {
        return value
            .replace(/[^A-Z0-9]/g, '')
            .replace(/(.{4})/g, '$1-')
            .trim()
            .slice(0, 19);
    };

    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKey(formatKey(e.target.value.toUpperCase()));
    };

    const handleActivate = async () => {
        setError('');
        setIsLoading(true);
        try {
            const license = await mockActivateKey(key);
            onActivationSuccess(license);
        } catch (err) {
            setError(err as string);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleActivateLater = () => {
        // Mock a 7-day trial
        const trialLicense: License = {
            status: LicenseStatus.Trial,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            seats: 1,
        };
        onActivationSuccess(trialLicense);
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md text-center">
                 <h1 className="text-3xl font-bold text-white mb-2">Activate Your License</h1>
                 <p className="text-gray-400 mb-8">Enter your license key to unlock all features.</p>
                <div className="w-full bg-brand-secondary border border-brand-light rounded-lg shadow-lg p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="key" className="block text-sm font-medium text-gray-300 text-left mb-2">
                                License Key
                            </label>
                            <input
                                id="key"
                                type="text"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                value={key}
                                onChange={handleKeyChange}
                                maxLength={19}
                                className="w-full px-4 py-3 bg-brand-dark border border-brand-light rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent font-mono tracking-widest"
                                disabled={isLoading}
                            />
                        </div>

                        {error && <p className="text-sm text-brand-danger">{error}</p>}
                        
                        <div className="space-y-4">
                            <button
                                onClick={handleActivate}
                                disabled={isLoading || key.length !== 19}
                                className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:bg-brand-light disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Activating...' : 'Activate'}
                            </button>
                             <button
                                onClick={handleActivateLater}
                                disabled={isLoading}
                                className="w-full bg-brand-light hover:bg-gray-600 text-gray-200 font-bold py-3 px-4 rounded-md transition duration-200"
                            >
                                Activate Later (Start 7-day Trial)
                            </button>
                        </div>
                    </div>
                </div>
                 <button onClick={onLogout} className="mt-8 text-gray-400 hover:text-white flex items-center justify-center mx-auto text-sm">
                    <LogoutIcon className="h-4 w-4 mr-2"/>
                    Logout and sign in with a different account
                </button>
            </div>
        </AuthLayout>
    );
};

export default ActivationPage;
