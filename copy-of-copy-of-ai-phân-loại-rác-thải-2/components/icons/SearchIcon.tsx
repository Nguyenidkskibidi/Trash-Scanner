import React from 'react';

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export const SearchIcon: React.FC<SearchIconProps> = ({ isActive, className, ...props }) => {
  const activeClass = isActive ? 'animate-search-wiggle' : '';
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
        <g className="transition-transform duration-300 group-hover:rotate-[-15deg]">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </g>
    </svg>
  );
};
