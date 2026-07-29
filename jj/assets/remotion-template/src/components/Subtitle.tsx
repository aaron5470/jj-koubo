import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {T} from '../theme';
import {SUBS} from '../data';

const renderHighlight = (text: string) => {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{color: T.yellow}}>
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
};

export const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const sub = SUBS.find((s) => t >= s.start && t < s.end);
  if (!sub) return null;

  const local = frame - Math.round(sub.start * fps);
  const fadeIn = interpolate(local, [0, 5], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(local, [0, 5], [10, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: fadeIn,
        transform: `translateY(${rise}px)`,
        fontFamily: T.fontCN,
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.55)',
          padding: '10px 28px',
          borderRadius: 8,
          color: T.white,
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: 2,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}
      >
        {renderHighlight(sub.cn)}
      </div>
      {sub.en ? (
        <div
          style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '4px 18px',
            borderRadius: 6,
            color: 'rgba(255,255,255,0.85)',
            fontSize: 24,
            fontWeight: 500,
            fontFamily: T.fontEN,
            letterSpacing: 1,
          }}
        >
          {sub.en}
        </div>
      ) : null}
    </div>
  );
};
