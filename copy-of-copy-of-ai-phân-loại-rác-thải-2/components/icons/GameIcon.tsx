import React from 'react';

interface GameIconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export const GameIcon: React.FC<GameIconProps> = ({ isActive, className, ...props }) => {
  const activeClass = isActive ? 'animate-icon-shake' : '';
  return (
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
        className={`${className} ${activeClass}`}
        {...props}
    >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 15v-2a2 2 0 0 1 2-2h14v4H5a2 2 0 0 0 0 4h14v-2" />
        <path d="m5 12-2 2 2 2" className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        <path d="m19 12 2-2-2-2" className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </svg>
  );
};
