import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      role="status"
      aria-label="loading"
    ></div>
  );
};

export default Spinner;