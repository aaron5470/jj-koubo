import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont as loadCN} from '@remotion/google-fonts/NotoSansSC';
import {loadFont as loadEN} from '@remotion/google-fonts/Rajdhani';
import {CARD_CUES, CHAPTERS, SFX_CUES, VIDEO} from './data';
import {ChapterCard} from './components/ChapterCard';
import {Grade} from './components/Grade';
import {InfoCard} from './components/Cards';
import {Subtitle} from './components/Subtitle';
import {TopTitle} from './components/TopTitle';

loadCN();
loadEN();

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [VIDEO.zoomStart, VIDEO.zoomEnd]);

  return (
    <AbsoluteFill style={{background: '#05070f'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo
          src={staticFile('source.mp4')}
          delayRenderTimeoutInMilliseconds={120000}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: VIDEO.applyGrade ? 'brightness(1.05) contrast(1.05) saturate(1.0)' : 'none',
          }}
        />
      </AbsoluteFill>
      {VIDEO.applyGrade ? <Grade /> : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: 1920,
          height: 1080,
          transform: 'scale(2)',
          transformOrigin: 'top left',
        }}
      >
        {CARD_CUES.map((cue, index) => (
          <Sequence
            key={`${cue.start}-${index}`}
            from={Math.round(cue.start * fps)}
            durationInFrames={Math.max(1, Math.round((cue.end - cue.start) * fps))}
          >
            <InfoCard cue={cue} />
          </Sequence>
        ))}

        {CHAPTERS.slice(1).map((chapter) => (
          <Sequence
            key={chapter.no}
            from={Math.round(chapter.start * fps)}
            durationInFrames={Math.round(1.2 * fps)}
          >
            <ChapterCard cn={chapter.label} en={chapter.en} />
          </Sequence>
        ))}

        <TopTitle />
        <Subtitle />
      </div>

      {SFX_CUES.map((cue, index) => (
        <Sequence key={`${cue.file}-${index}`} from={Math.round(cue.at * fps)}>
          <Audio src={staticFile(`sfx/${cue.file}`)} volume={cue.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

