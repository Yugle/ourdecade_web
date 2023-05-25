---
title: 2020篇
order: 1
toc: 'menu'
nav:
  title: 2020篇
  order: 1
---

## Info

源于丁太昇老师的十年纪录片计划的 Our Decade 视频征集计划的想法终于在 2020 年实施了。

视频中包含了十位朋友：朱光宇、韩建桥、朱文博、闫子健、李淑敏、王润聪、李淑玉、原操、张振宇、刘佳（视频顺序）

剪辑为内容紧凑，删减了部分朋友想说的话，也未能全部保留朋友们的说话语气和情绪，万望海涵。

期待小朱和他的朋友们明年再会。

## Video

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player';

export default () => (
  <VideoPlayer
    src="//player.bilibili.com/player.html?aid=331110496&bvid=BV1MA411H7tN&cid=280149630&page=1&high_quality=1&danmaku=1"
    shareUrl="https://b23.tv/MNA2cT8"
    platform={Platform.Bilibili}
  />
);
```

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player';

export default () => (
  <VideoPlayer
    src="https://www.youtube.com/embed/_ElZriYAqQU"
    shareUrl="https://youtu.be/_ElZriYAqQU"
    platform={Platform.YouTube}
  />
);
```
