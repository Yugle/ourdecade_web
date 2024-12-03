---
title: 2023篇
order: 1
toc: menu
nav:
    title: 2023篇
    order: 3
---

## 序言

Our Decade 视频征集计划来到了第四年。

第四个年头，很多人又踏上了新的旅程：或找到了一份新的工作，或得到了一份好的爱情，或失去了一些重要的人；第四个年头，又有朋友来、又有朋友走。来的朋友我欢迎，我们一起携手通行；走的朋友我想念，但并不遗憾。

视频中包含了十六位朋友：张妍、闫子健、王嘉炜、张振宇、盛璐、原操、王雨琪、李岳洲、王润聪、徐春源、张宝生、解立强、杨陈仪敏、马瑞迪、孙志伟、刘佳（视频顺序）。

剪辑为内容紧凑，删减了部分朋友想说的话，也未能全部保留朋友们的说话语气和情绪，万望海涵。

我们所传达的价值观是：回顾虽是在总结过去，但不必过分怀念，请务必珍惜眼前的生活。

我想，在不远的六年后，可能我们欢聚一堂，共同回顾这令人感慨的十年。我相信、我们都相信，在不久的将来我们定会再会！

## 视频

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player'

export default () => (
    <VideoPlayer
        src="//player.bilibili.com/player.html?aid=453701735&bvid=BV1z5411i74r&cid=1402839849&page=1&high_quality=1&danmaku=1"
        shareUrl="https://www.bilibili.com/video/BV1z5411i74r"
        platform={Platform.Bilibili}
    />
)
```

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player'

export default () => (
    <VideoPlayer
        src="https://www.youtube.com/embed/9EifbwVGNaY"
        shareUrl="https://youtu.be/9EifbwVGNaY"
        platform={Platform.YouTube}
    />
)
```
