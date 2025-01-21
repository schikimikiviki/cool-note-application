import React from 'react';

export const Bold = ({ size = 16, color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'></path>
    <path d='M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'></path>
  </svg>
);

export const Underline = ({ size = 16, color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3'></path>
    <line x1='4' y1='21' x2='20' y2='21'></line>
  </svg>
);

export const Italic = ({ size = 16, color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M19 4h-9M14 20H5M14.7 4.7L9.2 19.4' />
  </svg>
);

export const Link = ({ size = 16, color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'></path>
    <path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'></path>
  </svg>
);

export const Strikethrough = ({ size = 16, color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.8 3.3 3.6 3.9h.2m8.2 3.7c.3.4.4.8.4 1.3 0 2.9-2.7 3.6-6.2 3.6-2.3 0-4.4-.3-6.2-.9M4 11.5h16' />
  </svg>
);

export const X = ({ size = 16, color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </svg>
);

export const BulletList = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='20'
    height='20'
  >
    <path d='M7 5h14v2H7ZM3 5h2v2H3ZM7 11h14v2H7Zm-4 0h2v2H3Zm4 6h14v2H7ZM3 17h2v2H3Z' />
  </svg>
);

export const OrderedList = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='20'
    height='20'
  >
    <path d='M7 5h14v2H7ZM3 4h2v4H3Zm4 6h14v2H7Zm-4 2h1v1H3v1h1v1H3v1h2v-4Zm4 6h14v2H7Zm-4 2h2v-2H4v-1h1v-1H3v2h1Z' />
  </svg>
);

export const Checkbox = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='20'
    height='20'
  >
    <path d='M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-8 14L6 12l1.4-1.4 3.6 3.58 7.6-7.58L20 8Z' />
  </svg>
);
