import React from 'react';
import './Skeleton.css';

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
