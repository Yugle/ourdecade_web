---
title: 2021篇
order: 1
toc: menu
nav:
    title: 2021篇
    order: 2
---

## Info

源于丁太昇老师的十年纪录片计划的 Our Decade 视频征集计划来到了第二年。第二个年头，有的朋友来、有的朋友走，我想念他们但并不遗憾，因为我相信、我们都相信，在不久的将来我们定会再会！

视频中包含了十三位朋友：朱光宇、韩建桥、马瑞迪/孙志伟、朱文博、闫子健、杨陈仪敏、张振宇、原操、盛璐、李岳洲、王润聪、刘佳（视频顺序）

剪辑为内容紧凑，删减了部分朋友想说的话，也未能全部保留朋友们的说话语气和情绪，万望海涵。

期待小朱和他的朋友们明年再会。

## Video

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player'

export default () => (
    <VideoPlayer
        src="//player.bilibili.com/player.html?aid=893093779&bvid=BV1GP4y1J7pP&cid=280149630&page=1&high_quality=1&danmaku=1"
        shareUrl="https://www.bilibili.com/video/BV1GP4y1J7pP"
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
        src="https://www.youtube.com/embed/P_xhbtOwsPI"
        shareUrl="https://youtu.be/P_xhbtOwsPI"
        platform={Platform.YouTube}
    />
)
```
