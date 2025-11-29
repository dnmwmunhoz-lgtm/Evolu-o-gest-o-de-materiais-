import React from 'react';

export const ChileFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
        <defs>
            <clipPath id="circle-clip-cl"><circle cx="256" cy="256" r="256"/></clipPath>
        </defs>
        <g clipPath="url(#circle-clip-cl)">
            <rect width="512" height="512" fill="#d81e34"/>
            <rect width="512" height="256" fill="#fff"/>
            <rect width="256" height="256" fill="#0033a0"/>
            <polygon fill="#fff" points="128,170.5 101.5,190.1 109.3,160.4 82.8,140.8 113.4,140.8 128,111.1 142.6,140.8 173.2,140.8 146.7,160.4 154.5,190.1"/>
        </g>
    </svg>
);
