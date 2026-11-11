import React from 'react';
import './Skeleton.css';

/**
 * Base Skeleton block. Use for shimmer placeholders.
 * @param {string} [width] - e.g. '100%', '60px', '3rem'
 * @param {string} [height] - e.g. '1rem', '48px'
 * @param {string} [className] - extra classes
 * @param {boolean} [circle] - round shape (avatar)
 */
const Skeleton = ({ width, height, className = '', circle = false }) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  return (
    <span
      className={`skeleton ${circle ? 'skeleton--circle' : ''} ${className}`.trim()}
      style={Object.keys(style).length ? style : undefined}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export default Skeleton;
