import React from 'react';

export function CardSkeleton() {
  return (
    <div className="skeleton skeleton--card" aria-hidden="true">
      <div className="skeleton__block skeleton__block--title" />
      <div className="skeleton__block skeleton__block--line" />
      <div className="skeleton__block skeleton__block--line" />
    </div>
  );
}

export default CardSkeleton;
