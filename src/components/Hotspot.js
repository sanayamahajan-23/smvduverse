import React from 'react';
import './Hotspot.css';

const Hotspot = ({ x, y, onClick, label, scale, position }) => {
  return (
    <div
      className="hotspot"
      onClick={onClick}
      style={{
        left: `${x * scale + position.x}px`,
        top: `${y * scale + position.y}px`,
        transform: `scale(${scale}) translate(-50%, -100%)`,
        position: 'absolute',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      title={label}
    >
      <img
        src={`${process.env.PUBLIC_URL}/assets/hotspot.png`}
        alt={label}
        style={{
          width: '32px',
          height: '32px',
        }}
      />
    </div>
  );
};

export default Hotspot;

