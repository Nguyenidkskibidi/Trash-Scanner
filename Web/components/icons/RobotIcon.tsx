import React from 'react';

export const RobotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="5" y="2" width="14" height="12" rx="2" />
    <path d="M12 14v4" />
    <path d="M9 18h6" />
    <path d="M12 6h.01" />
    <path d="M10 10s.5-1 2-1 2 1 2 1" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
  </svg>
);