import React from 'react';

export const VietnamFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
    <defs>
      <clipPath id="vn-round-corners">
        <rect width="900" height="600" rx="40"/>
      </clipPath>
    </defs>
    <g clipPath="url(#vn-round-corners)">
      <rect fill="#da251d" width="900" height="600"/>
      <polygon fill="#ff0" points="450,90 502,250 670,250 540,350 592,510 450,410 308,510 360,350 230,250 398,250" />
    </g>
  </svg>
);