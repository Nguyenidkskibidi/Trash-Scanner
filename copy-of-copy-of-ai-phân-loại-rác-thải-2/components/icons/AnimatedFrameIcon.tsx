import React from 'react';

export const AnimatedFrameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <>
    <style>
      {`
        @keyframes pulse-frame {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .animate-pulse-frame {
          animation: pulse-frame 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}
    </style>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse-frame"
      {...props}
    >
      {/* Top-left corner */}
      <path d="M3 8V4h4" />
      {/* Top-right corner */}
      <path d="M21 8V4h-4" />
      {/* Bottom-left corner */}
      <path d="M3 16v4h4" />
      {/* Bottom-right corner */}
      <path d="M21 16v4h-4" />
    </svg>
  </>
);