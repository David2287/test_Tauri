import React from 'react';

interface PasswordStrengthMeterProps {
  password?: string;
}

const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return -1;

  // Award points for different criteria
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  return score;
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password = '' }) => {
  const score = checkPasswordStrength(password);

  const getStrengthProps = () => {
    switch (score) {
      case -1:
        return { width: '0%', color: 'bg-gray-400', label: '' };
      case 0:
      case 1:
      case 2:
        return { width: '33%', color: 'bg-red-500', label: 'Weak' };
      case 3:
      case 4:
        return { width: '66%', color: 'bg-yellow-500', label: 'Medium' };
      case 5:
        return { width: '100%', color: 'bg-green-500', label: 'Strong' };
      default:
        return { width: '0%', color: 'bg-gray-400', label: '' };
    }
  };
  
  const { width, color, label } = getStrengthProps();

  if (!password) return null;

  return (
    <div>
      <div className="w-full bg-brand-light rounded-full h-2">
        <div 
            className={`h-2 rounded-full transition-all duration-300 ${color}`} 
            style={{ width: width }}
        ></div>
      </div>
      <p className={`text-xs mt-1 text-right ${
          score <= 2 ? 'text-red-400' : score <= 4 ? 'text-yellow-400' : 'text-green-400'
      }`}>
        {label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
