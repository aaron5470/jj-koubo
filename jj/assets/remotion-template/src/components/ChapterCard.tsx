import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {T} from '../theme';

export const ChapterCard: React.FC<{cn: string; en: string}> = ({cn, en}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 14});
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
      <AbsoluteFill style={{background: 'rgba(2,4,12,0.45)'}} />
      <div
        style={{
          position: 'relative',
          background: 'rgba(0,0,0,0.78)',
          border: `1px solid ${T.panelBorder}`,
          borderRadius: 16,
          padding: '34px 80px',
          textAlign: 'center',
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
          boxShadow: T.glow,
          fontFamily: T.fontCN,
        }}
      >
        <div style={{color: T.white, fontSize: 64, fontWeight: 900, letterSpacing: 6}}>{cn}</div>
        <div style={{color: T.cyan, fontSize: 26, letterSpacing: 10, fontFamily: T.fontEN, marginTop: 8}}>
          {en}
        </div>
      </div>
    </AbsoluteFill>
  );
};
