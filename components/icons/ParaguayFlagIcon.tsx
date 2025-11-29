import React from 'react';

export const ParaguayFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
     <defs>
        <clipPath id="circle-clip-py"><circle cx="256" cy="256" r="256"/></clipPath>
    </defs>
    <g clipPath="url(#circle-clip-py)">
        <rect width="512" height="512" fill="#fff"/>
        <rect width="512" height="170.7" fill="#d52b1e"/>
        <rect y="341.3" width="512" height="170.7" fill="#0038a8"/>
    </g>
  </svg>
);
