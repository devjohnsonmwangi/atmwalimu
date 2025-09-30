import React from 'react';

interface ErrorMessageProps {
  /** The main message to display. */
  message?: string;
  /** An optional, more detailed description of the error. */
  details?: string;
}

/**
 * A standardized component for displaying error messages.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "An unexpected error occurred.",
  details
}) => (
  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-sm" role="alert">
    <p className="font-bold text-lg">{message}</p>
    {details && <p className="mt-1 text-sm">{details}</p>}
  </div>
);

export default ErrorMessage;