import React from 'react';

interface CameraIconProps extends React.SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export const CameraIcon: React.FC<CameraIconProps> = ({ isActive, className, ...props }) => {
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
      className={className}
      {...props}
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" className="transition-transform duration-300 group-hover:scale-125" />
      {isActive && (
        <path
          d="M18 4l-1.5 1.5M18 4l1.5 1.5"
          stroke="#FBBF24"
          strokeWidth="2.5"
          className="animate-flash"
        />
      )}
    </svg>
  );
};
