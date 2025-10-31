import React from 'react';

export const BroomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M19.4 11.6a1 1 0 1 0-1.8-1.2l-4.2 6.4 2.4-1.6.8-5.6-3.8 2.2a1 1 0 1 0 1 1.8l6.6-3.8Z" />
    <path d="M12.4 3.4a1 1 0 1 0-1.8 1.2l4.2 6.4 1.8-1.2-4.2-6.4Z" />
    <path d="M11.6 20.4a1 1 0 1 0 1.8 1.2l4.2-6.4-1.8-1.2-4.2 6.4Z" />
    <path d="M17 11.8V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4.2" />
  </svg>
);