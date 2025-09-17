import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { EyeIcon, EyeOffIcon } from '../Icons';

interface RegisterPageProps {
  onRegisterSuccess: (token: string) => void;
  onNavigateToLogin: () => void;
}

// Mock Tauri command for registration
const mockRegister = (email: string, password: string): Promise<{ token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Basic validation simulation
            const hasDigit = /\d/.test(password);
            const hasSpecial = /[^A-Za-z0-9]/.test(password);
            if (password.length < 8 || !hasDigit || !hasSpecial) {
                reject('Password does not meet requirements.');
            } else if (email === 'exists@example.com') {
                reject('An account with this email already exists.');
            } else {
                resolve({ token: 'new-fake-jwt-token' });
            }
        }, 1000);
    });
};

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptEula, setAcceptEula] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            const { token } = await mockRegister(email, password);
            onRegisterSuccess(token);
        } catch (err) {
            setError(err as string);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-sm">
                <div className="w-full bg-brand-secondary border border-brand-light rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center text-white mb-6">Create Account</h1>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-2 bg-brand-dark border border-brand-light rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-password"className="block text-sm font-medium text-gray-300">Password</label>
                             <div className="relative mt-1">
                                <input
                                    id="reg-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-brand-dark border border-brand-light rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                                >
                                    {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                            <PasswordStrengthMeter password={password} />
                            <p className="text-xs text-gray-400 mt-2">At least 8 characters, 1 digit, 1 special character.</p>
                        </div>

                         <div>
                            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-300">Confirm Password</label>
                             <div className="relative mt-1">
                                <input
                                    id="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-brand-dark border border-brand-light rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="eula"
                                type="checkbox"
                                checked={acceptEula}
                                onChange={(e) => setAcceptEula(e.target.checked)}
                                className="h-4 w-4 mt-1 bg-brand-dark border-brand-light text-brand-accent rounded focus:ring-brand-accent"
                                required
                                disabled={isLoading}
                            />
                            <label htmlFor="eula" className="ml-2 block text-sm text-gray-300">
                                I accept the <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock EULA content here."); }} className="text-brand-accent hover:underline">EULA</a>
                            </label>
                        </div>
                        
                        {error && <p className="text-sm text-brand-danger text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || !acceptEula}
                            className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-brand-light disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-brand-accent hover:underline">
                        Sign In
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
