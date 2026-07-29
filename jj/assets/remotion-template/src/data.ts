export const VIDEO = {
  eyebrow: 'JJ TALKING-HEAD EDIT',
  title: '把复杂内容讲清楚',
  subtitle: '真人口播 · 信息可视化',
  applyGrade: false,
  zoomStart: 1.02,
  zoomEnd: 1.06,
};

export type Sub = {start: number; end: number; cn: string; en: string};

// Wrap important Chinese words in **double asterisks** for yellow highlighting.
export const SUBS: Sub[] = [
  {start: 0.0, end: 2.4, cn: '一条好的**口播视频**先把结论讲清楚', en: 'A strong talking-head video starts with the point'},
  {start: 2.4, end: 4.8, cn: '再把复杂内容拆成**三个步骤**', en: 'Then breaks complexity into three steps'},
  {start: 4.8, end: 7.2, cn: '字幕负责跟上节奏', en: 'Subtitles follow the spoken rhythm'},
  {start: 7.2, end: 9.8, cn: '信息卡负责让重点**一眼看懂**', en: 'Information cards make the key idea visible'},
  {start: 9.8, end: 12.6, cn: '最后先看预览 再输出**4K成片**', en: 'Review first, then render the 4K final'},
];

export type Chapter = {start: number; end: number; no: string; label: string; en: string};

export const CHAPTERS: Chapter[] = [
  {start: 0.0, end: 4.8, no: '01', label: '先讲结论', en: 'LEAD WITH THE POINT'},
  {start: 4.8, end: 9.8, no: '02', label: '强化重点', en: 'MAKE IT VISIBLE'},
  {start: 9.8, end: 12.6, no: '03', label: '预览交付', en: 'REVIEW AND DELIVER'},
];

export type Accent = 'cyan' | 'blue' | 'yellow' | 'green' | 'orange' | 'purple';

export type CardCue = {
  start: number;
  end: number;
  kind: 'metric' | 'list' | 'steps' | 'comparison' | 'quote';
  label: string;
  en: string;
  accent?: Accent;
  value?: string;
  suffix?: string;
  note?: string;
  items?: string[];
  left?: {label: string; value: string};
  right?: {label: string; value: string};
};

export const CARD_CUES: CardCue[] = [
  {
    start: 0.4,
    end: 3.2,
    kind: 'quote',
    label: '先把结论讲清楚',
    en: 'LEAD WITH THE POINT',
    accent: 'cyan',
    note: '让观众在前三秒知道这条视频值不值得继续看',
  },
  {
    start: 3.2,
    end: 6.6,
    kind: 'steps',
    label: '复杂内容拆成三步',
    en: 'THREE-STEP FLOW',
    accent: 'blue',
    items: ['结论', '解释', '行动'],
  },
  {
    start: 6.6,
    end: 10.0,
    kind: 'list',
    label: '画面只服务于理解',
    en: 'VISUAL HIERARCHY',
    accent: 'green',
    items: ['字幕跟节奏', '卡片讲重点', '人物是主体'],
  },
  {
    start: 10.0,
    end: 12.6,
    kind: 'comparison',
    label: '两阶段交付',
    en: 'TWO-STAGE DELIVERY',
    accent: 'yellow',
    left: {label: '先确认', value: '1080p'},
    right: {label: '再交付', value: '4K'},
  },
];

export type SfxCue = {at: number; file: string; volume: number};

// Add only licensed files placed under public/sfx/. Keep sound effects below the voice.
export const SFX_CUES: SfxCue[] = [];

