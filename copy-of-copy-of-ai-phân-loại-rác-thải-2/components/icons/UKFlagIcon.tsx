import React from 'react';

export const UKFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
    <defs>
      <clipPath id="uk-round-corners">
        <rect width="60" height="30" rx="3"/>
      </clipPath>
    </defs>
    <g clipPath="url(#uk-round-corners)">
      <path d="M0 0h60v30H0z" fill="#00247d"/>
      <path d="m60 30-30-15-30 15v-3l30-15 30 15v3zm0-30L30 15 0 0v3l30 15L60 3V0z" fill="#fff"/>
      <path d="m60 30-30-15-30 15v-2l30-15 30 15v2zm0-30L30 15 0 0v2l30 15L60 2V0z" fill="#cf142b"/>
      <path d="M0 12v6h60v-6H0z" fill="#fff"/>
      <path d="M27 0h6v30h-6V0z" fill="#fff"/>
      <path d="M0 13.5v3h60v-3H0z" fill="#cf142b"/>
      <path d="M28.5 0h3v30h-3V0z" fill="#cf142b"/>
    </g>
  </svg>
);