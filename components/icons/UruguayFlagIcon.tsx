import React from 'react';

export const UruguayFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
        <defs>
            <clipPath id="circle-clip-uy"><circle cx="256" cy="256" r="256"/></clipPath>
        </defs>
        <g clipPath="url(#circle-clip-uy)">
            <rect width="512" height="512" fill="#FFFFFF"/>
            <rect y="56.89" width="512" height="56.89" fill="#005BBB"/>
            <rect y="170.67" width="512" height="56.89" fill="#005BBB"/>
            <rect y="284.44" width="512" height="56.89" fill="#005BBB"/>
            <rect y="398.22" width="512" height="56.89" fill="#005BBB"/>
            <rect width="256" height="227.56" fill="#FFFFFF"/>
            <circle cx="128" cy="113.78" r="45" fill="#FCD116"/>
        </g>
    </svg>
);
