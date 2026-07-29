import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {SUBS} from './data';

export const FPS = 30;
const TOTAL = SUBS.length > 0 ? SUBS[SUBS.length - 1].end : 30;
export const DUR = Math.ceil(TOTAL * FPS);

export const Root: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={DUR}
      fps={FPS}
      width={3840}
      height={2160}
    />
  );
};
