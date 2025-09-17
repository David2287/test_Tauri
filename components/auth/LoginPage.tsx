import React, { useState, useEffect } from 'react';
import AuthLayout from './AuthLayout';
import { EyeIcon, EyeOffIcon } from '../Icons';

interface LoginPageProps {
  onLoginSuccess: (token: string, remember: boolean) => void;
  onNavigateToRegister: () => void;
}

// Mock Tauri command for login
const mockLogin = (email: string, password: string): Promise<{ token: string }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'Password123!') {
                resolve({ token: 'fake-jwt-token' });
            } else {
                reject('Invalid email or password.');
            }
        }, 1000);
    });
};


const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Brute-force protection
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(0);

    // Fix: The type `NodeJS.Timeout` is not available in a browser environment and was causing an error.
    // This was also corrected to prevent a runtime error from calling `clearTimeout` with an
    // uninitialized variable.
    useEffect(() => {
        if (lockoutTime > 0) {
            const timer = setTimeout(() => setLockoutTime(lockoutTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [lockoutTime]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lockoutTime > 0) {
            setError(`Too many failed attempts. Please wait ${lockoutTime} seconds.`);
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const { token } = await mockLogin(email, password);
            setFailedAttempts(0); // Reset on success
            onLoginSuccess(token, remember);
        } catch (err) {
            setError(err as string);
            const newAttemptCount = failedAttempts + 1;
            setFailedAttempts(newAttemptCount);
            if (newAttemptCount >= 5) {
                setLockoutTime(30); // 30 second lockout
                setFailedAttempts(0); // Reset counter after lockout is set
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-sm">
                <div className="w-full bg-brand-secondary border border-brand-light rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-center text-white mb-6">Sign In</h1>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-2 bg-brand-dark border border-brand-light rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                disabled={isLoading || lockoutTime > 0}
                            />
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                             <div className="relative mt-1">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 bg-brand-dark border border-brand-light rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    disabled={isLoading || lockoutTime > 0}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                                >
                                    {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-4 w-4 bg-brand-dark border-brand-light text-brand-accent rounded focus:ring-brand-accent"
                                    disabled={isLoading || lockoutTime > 0}
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-brand-accent hover:underline">Forgot password?</a>
                        </div>

                        {error && <p className="text-sm text-brand-danger text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || lockoutTime > 0}
                            className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:bg-brand-light disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <button onClick={onNavigateToRegister} className="font-medium text-brand-accent hover:underline">
                        Register
                    </button>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;