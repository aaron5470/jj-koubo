import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Accent, CardCue} from '../data';
import {T} from '../theme';

const ACCENTS: Record<Accent, string> = {
  cyan: T.cyan,
  blue: T.blue,
  yellow: T.yellow,
  green: T.green,
  orange: T.orange,
  purple: '#B388FF',
};

const Corner: React.FC<{position: 'tl' | 'tr' | 'bl' | 'br'; accent: string}> = ({position, accent}) => {
  const base: React.CSSProperties = {position: 'absolute', width: 22, height: 22, opacity: 0.9};
  const positions: Record<typeof position, React.CSSProperties> = {
    tl: {top: -1, left: -1, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`, borderTopLeftRadius: 8},
    tr: {top: -1, right: -1, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, borderTopRightRadius: 8},
    bl: {bottom: -1, left: -1, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`, borderBottomLeftRadius: 8},
    br: {bottom: -1, right: -1, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, borderBottomRightRadius: 8},
  };
  return <div style={{...base, ...positions[position]}} />;
};

const GlassCard: React.FC<{
  label: string;
  en: string;
  accent: string;
  children: React.ReactNode;
}> = ({label, en, accent, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 15, mass: 0.7}, durationInFrames: 26});
  const x = interpolate(enter, [0, 1], [140, 0]);
  const floatY = Math.sin(frame / 18) * 5;
  const scan = interpolate(frame, [10, 46], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        right: 120,
        top: '50%',
        width: 680,
        padding: '36px 42px',
        overflow: 'hidden',
        opacity: enter,
        transform: `translateY(calc(-50% + ${floatY}px)) translateX(${x}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        background: T.panel,
        border: `1.5px solid ${T.panelBorder}`,
        borderRadius: 22,
        boxShadow: `0 0 54px ${accent}38, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)`,
        backdropFilter: 'blur(16px)',
        fontFamily: T.fontCN,
      }}
    >
      {(['tl', 'tr', 'bl', 'br'] as const).map((position) => (
        <Corner key={position} position={position} accent={accent} />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${interpolate(enter, [0, 1], [0, 100])}%`,
          height: 3,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          boxShadow: `0 0 10px ${accent}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${scan}%`,
          height: 2,
          opacity: scan > 0 && scan < 100 ? 0.5 : 0,
          background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
        }}
      />

      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
        <div style={{width: 12, height: 12, borderRadius: 6, background: accent, boxShadow: `0 0 16px ${accent}`}} />
        <span style={{color: T.dim, fontSize: 21, letterSpacing: 6, fontFamily: T.fontEN, fontWeight: 600}}>{en}</span>
      </div>
      <div style={{color: T.white, fontSize: 46, fontWeight: 900, marginBottom: 22, textShadow: `0 0 30px ${accent}44`}}>
        {label}
      </div>
      {children}
    </div>
  );
};

const AnimatedRow: React.FC<{text: string; index: number; accent: string}> = ({text, index, accent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 6 - index * 5, fps, config: {damping: 200}, durationInFrames: 16});
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 14,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [24, 0])}px)`,
      }}
    >
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: 32,
          height: 32,
          borderRadius: 16,
          color: accent,
          background: `${accent}18`,
          border: `1.5px solid ${accent}`,
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        ✓
      </div>
      <span style={{color: T.white, fontSize: 27, fontWeight: 700}}>{text}</span>
    </div>
  );
};

const CardBody: React.FC<{cue: CardCue; accent: string}> = ({cue, accent}) => {
  const frame = useCurrentFrame();

  if (cue.kind === 'metric') {
    return (
      <>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
          <span style={{color: accent, fontSize: 108, fontWeight: 900, fontFamily: T.fontEN}}>{cue.value}</span>
          {cue.suffix ? <span style={{color: accent, fontSize: 48, fontWeight: 900}}>{cue.suffix}</span> : null}
        </div>
        {cue.note ? <div style={{color: T.dim, fontSize: 21, marginTop: 4}}>{cue.note}</div> : null}
      </>
    );
  }

  if (cue.kind === 'list') {
    return <>{(cue.items ?? []).map((item, index) => <AnimatedRow key={item} text={item} index={index} accent={accent} />)}</>;
  }

  if (cue.kind === 'steps') {
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        {(cue.items ?? []).map((item, index, items) => {
          const progress = interpolate(frame, [5 + index * 6, 18 + index * 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <React.Fragment key={item}>
              <div
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  color: index === items.length - 1 ? accent : T.white,
                  background: index === items.length - 1 ? `${accent}18` : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${index === items.length - 1 ? accent : 'rgba(255,255,255,0.18)'}`,
                  fontSize: 25,
                  fontWeight: 800,
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [16, 0])}px)`,
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </div>
              {index < items.length - 1 ? <span style={{color: T.dim, fontSize: 26}}>→</span> : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (cue.kind === 'comparison') {
    return (
      <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 18}}>
        {[cue.left, cue.right].map((side, index) => (
          <React.Fragment key={index}>
            {index === 1 ? <div style={{color: T.dim, fontSize: 38}}>→</div> : null}
            <div style={{padding: 20, borderRadius: 14, textAlign: 'center', background: `${accent}${index ? '18' : '0C'}`, border: `1.5px solid ${accent}${index ? 'AA' : '55'}`}}>
              <div style={{color: T.dim, fontSize: 19}}>{side?.label}</div>
              <div style={{color: index ? accent : T.white, fontSize: 42, fontWeight: 900, fontFamily: T.fontEN, marginTop: 6}}>{side?.value}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div style={{borderLeft: `5px solid ${accent}`, paddingLeft: 24}}>
      <div style={{color: T.white, fontSize: 31, lineHeight: 1.55, fontWeight: 700}}>{cue.note}</div>
    </div>
  );
};

export const InfoCard: React.FC<{cue: CardCue}> = ({cue}) => {
  const accent = ACCENTS[cue.accent ?? 'blue'];
  return (
    <GlassCard label={cue.label} en={cue.en} accent={accent}>
      <CardBody cue={cue} accent={accent} />
    </GlassCard>
  );
};

