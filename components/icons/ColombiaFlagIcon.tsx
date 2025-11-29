import React from 'react';

export const ColombiaFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <defs>
        <clipPath id="circle-clip-co"><circle cx="256" cy="256" r="256"/></clipPath>
    </defs>
    <g clipPath="url(#circle-clip-co)">
        <rect width="512" height="512" fill="#003893"/>
        <rect width="512" height="256" fill="#fecd00"/>
        <rect y="384" width="512" height="128" fill="#ce1126"/>
    </g>
  </svg>
);
