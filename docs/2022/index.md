---
title: 2022篇
order: 1
toc: menu
nav:
    title: 2022篇
    order: 3
---

## 序言

源于丁太昇老师的十年纪录片计划的 Our Decade 视频征集计划来到了第三年。第三个年头，又有朋友来、又有朋友走。来的朋友我欢迎，我们一起携手通行；走的朋友我想念，但并不遗憾。

视频中包含了十三位朋友：朱光宇、王润聪、张妍、张振宇、张宝生、杨陈仪敏、闫子健、李岳洲、刘佳、原操、朱文博、王嘉炜、盛璐（视频顺序）

剪辑为内容紧凑，删减了部分朋友想说的话，也未能全部保留朋友们的说话语气和情绪，万望海涵。

我想，在不远的七年后，可能我们欢聚一堂，共同回顾这令人感慨的十年。

我相信、我们都相信，在不久的将来我们定会再会！

## 视频

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player'

export default () => (
    <VideoPlayer
        src="//player.bilibili.com/player.html?aid=692487592&bvid=BV1y24y1e74y&cid=954413489&page=1&high_quality=1&danmaku=1"
        shareUrl="https://www.bilibili.com/video/BV1y24y1e74y"
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
        src="https://www.youtube.com/embed/6Z50cRSIOYw"
        shareUrl="https://youtu.be/6Z50cRSIOYw"
        platform={Platform.YouTube}
    />
)
```
