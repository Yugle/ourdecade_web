---
title: 2024篇
order: 1
toc: menu
nav:
    title: 2024篇
    order: 3
---

## 序言

《Our Decade 视频征集计划》来到了第五年，

第五个年头，意味着这趟旅程已经走了一半了。

我们一直传达的价值观是：回顾虽是在总结过去，但不必过分怀念，请务必珍惜眼前的生活。

我相信、我们都相信，在不久的将来我们定会再会！

## 视频

```tsx
/**
 * inline: true
 */
import VideoPlayer, { Platform } from '@/components/video_player'

export default () => (
    <VideoPlayer
        src="//player.bilibili.com/player.html?aid=113827773419549&bvid=BV1qJcaeVEbK&cid=28525921123&page=1&high_quality=1&danmaku=1"
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
        src="https://www.youtube.com/embed/OkaTN1Laeuw"
        shareUrl="https://youtu.be/OkaTN1Laeuw"
        platform={Platform.YouTube}
    />
)
```
