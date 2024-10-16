import React from 'react';

export const Spinner: React.FC = () => {
  return <div style={spinnerStyle}></div>;
};

const spinnerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: '4px solid rgba(0, 0, 0, 0.1)',
  borderTop: '4px solid #3498db', // Adjust the color as needed
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Add keyframes for the spin animation directly in the component
const styleSheet = document.styleSheets[0];

const keyframes = `@keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }`;

styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Spinner;
