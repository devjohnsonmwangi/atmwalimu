// src/components/PasswordStrengthIndicator.tsx

import React, { useMemo } from 'react';

type PasswordStrengthProps = {
  password?: string;
};

// This component uses a checkmark SVG for visual feedback
const CheckmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline-block mr-2 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const requirements = useMemo(() => ([
    { regex: /.{8,}/, text: "At least 8 characters long" },
    { regex: /[a-z]/, text: "At least one lowercase letter" },
    { regex: /[A-Z]/, text: "At least one uppercase letter" },
    { regex: /[0-9]/, text: "At least one number" },
  ]), []);

  const metRequirements = useMemo(() => {
    return requirements.map(req => req.regex.test(password));
  }, [password, requirements]);

  const strength = metRequirements.filter(Boolean).length;

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-gray-300';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };
  
  const strengthWidth = `${(strength / requirements.length) * 100}%`;

  // Don't render anything if the password field is empty
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: strengthWidth }}
        ></div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs">
        {requirements.map((req, index) => (
          <li
            key={req.text}
            className={`transition-colors duration-300 ${metRequirements[index] ? 'text-green-600' : 'text-gray-500'}`}
          >
            <CheckmarkIcon />
            {req.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;