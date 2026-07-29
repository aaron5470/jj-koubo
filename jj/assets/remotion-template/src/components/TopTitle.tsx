import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CHAPTERS, VIDEO} from '../data';
import {T} from '../theme';

export const TopTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 25});
  const chapter = CHAPTERS.find((item) => time >= item.start && time < item.end) ?? CHAPTERS.at(-1);

  if (!chapter) return null;

  const chapterIndex = CHAPTERS.indexOf(chapter);
  const chapterFrame = frame - Math.round(chapter.start * fps);
  const chapterEnter = spring({frame: chapterFrame, fps, config: {damping: 200}, durationInFrames: 18});

  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: 80,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-80, 0])}px)`,
        fontFamily: T.fontCN,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 6, height: 34, background: T.blue, boxShadow: T.glow}} />
        <span style={{color: T.cyan, fontSize: 28, fontFamily: T.fontEN, letterSpacing: 8, fontWeight: 600}}>
          {VIDEO.eyebrow}
        </span>
      </div>
      <div style={{color: T.white, fontSize: 108, fontWeight: 900, lineHeight: 1.08, textShadow: '0 2px 30px rgba(45,125,255,0.45)'}}>
        {VIDEO.title}
      </div>
      <div style={{color: T.dim, fontSize: 24, letterSpacing: 6, marginTop: 4}}>{VIDEO.subtitle}</div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          marginTop: 26,
          opacity: chapterEnter,
          transform: `translateY(${interpolate(chapterEnter, [0, 1], [12, 0])}px)`,
        }}
      >
        <span style={{color: T.blue, fontSize: 44, fontWeight: 900, fontFamily: T.fontEN}}>{chapter.no}</span>
        <span style={{color: T.dim, fontSize: 20, fontFamily: T.fontEN}}>/ {String(CHAPTERS.length).padStart(2, '0')}</span>
        <span style={{color: T.white, fontSize: 26, fontWeight: 700, marginLeft: 6}}>{chapter.label}</span>
        <span style={{color: T.dim, fontSize: 16, letterSpacing: 4, fontFamily: T.fontEN}}>{chapter.en}</span>
      </div>
      <div style={{display: 'flex', gap: 6, marginTop: 12}}>
        {CHAPTERS.map((item, index) => (
          <div
            key={item.no}
            style={{
              width: 56,
              height: 4,
              borderRadius: 2,
              background: index <= chapterIndex ? T.blue : 'rgba(255,255,255,0.18)',
              boxShadow: index <= chapterIndex ? '0 0 10px rgba(45,125,255,0.8)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

