---
title: 2020篇
order: 1
toc: 'menu'
nav:
  title: 2020篇
  order: 1
---

## Info
源于丁太昇老师的十年纪录片计划的Our Decade视频征集计划的想法终于在2020年实施了。

视频中包含了十位朋友：朱光宇、韩建桥、朱文博、闫子健、李淑敏、王润聪、李淑玉、原操、张振宇、刘佳（视频顺序）

剪辑为内容紧凑，删减了部分朋友想说的话，也未能全部保留朋友们的说话语气和情绪，万望海涵。

期待小朱和他的朋友们明年再会。

## Video

### BiliBili

```tsx
/**
 * inline: true
 */
import React from 'react';
import './index.less'

export default () => (
  <div className='wrapper'>
    <iframe
      className='videoPlayer'
      src="//player.bilibili.com/player.html?aid=331110496&bvid=BV1MA411H7tN&cid=280149630&page=1&high_quality=1&danmaku=1"
      allowfullscreen="allowfullscreen"
      scrolling="no"
      frameborder="0"
      sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts">
    </iframe>
  </div>)
```

### YouTube

```tsx
/**
 * inline: true
 */
import React from 'react';
import './index.less'

export default () => (
  <div className='wrapper'>
    <iframe
      className="styles.videoPlayer"
      src="https://www.youtube.com/embed/_ElZriYAqQU"
      title="YouTube"
      frameborder="0"
      allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  </div>)
```