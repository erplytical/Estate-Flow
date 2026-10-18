import React from 'react';

interface RupeeProps {
  className?: string;
}

/**
 * Deterministic SVG Indian Rupee Symbol (U+20B9)
 * Guarantees 100% crisp rendering on all operating systems and headless Linux
 * containers with zero missing-glyph font box errors.
 */
export const Rupee: React.FC<RupeeProps> = ({ className = 'w-3.5 h-3.5 inline -mt-0.5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="INR"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="M6 13l8.5 8" />
      <path d="M6 13h3a4.5 4.5 0 0 0 0-9H6" />
    </svg>
  );
};
