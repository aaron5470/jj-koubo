import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Grade: React.FC = () => {
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(60,100,180,0.04) 0%, rgba(20,30,80,0.08) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 78% 68% at 50% 45%, transparent 65%, rgba(2,4,12,0.26) 100%)',
        }}
      />
    </>
  );
};
