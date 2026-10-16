# Sheet 动画系统

弹窗的入场 / 退场全部由 CSS 变量驱动的过渡完成，JS 只做两件事：挂载节点、增删类名。

## 类名与职责

| 类名 | 职责 |
| --- | --- |
| sheet-root | 变量作用域，所有 --ease-* / --dur-* / --delay-* / --sheet-* 都定义在这里 |
| sheet-overlay | 全屏遮罩：底色 + backdrop-filter 毛玻璃 |
| sheet-panel | 面板本体：固定定位、圆角、阴影、内部滚动 |
| sheet-detail-row | 内容行：逐行淡入上移 |
| active | 打开态（JS 在下一帧加上） |
| closing | 关闭态（JS 加上，动画结束后卸载节点） |

## 打开时序

1. isOpen 变 true，Sheet 通过 createPortal 挂到 body
2. 锁定页面滚动（html 的 overflow-y 设为 scroll、body 的 overflow 设为 hidden）
3. 下一帧（requestAnimationFrame）先读一次 offsetWidth 强制重排，再给遮罩和面板加 active，保证过渡从初始态开始而不是直接跳到终态
4. 遮罩：底色 420ms，毛玻璃 680ms，分别延迟 100ms / 80ms
5. 面板：800ms 弹性上浮并居中，缓动为 cubic-bezier(0.16, 1, 0.3, 1)
6. 内容行：首行延迟 160ms，之后每行递增 70ms，单行 600ms 完成

## 关闭时序

1. 加 closing、去掉 active
2. 面板 280ms 淡出，遮罩 280ms 退掉毛玻璃
3. 内容行反向错开退场，每行间隔 30ms
4. 400ms 后 React 卸载节点并恢复滚动

## 参数表

| 变量 | 值 | 作用 |
| --- | --- | --- |
| --dur-panel-open | 800ms | 面板入场 |
| --dur-panel-close | 550ms | 面板退场 |
| --dur-scrim-open | 420ms | 遮罩底色渐显 |
| --dur-scrim-close | 280ms | 遮罩底色渐隐 |
| --dur-blur-open | 680ms | 遮罩毛玻璃渐显 |
| --dur-blur-close | 360ms | 遮罩毛玻璃渐隐 |
| --dur-row-open | 600ms | 内容行入场 |
| --dur-row-close | 260ms | 内容行退场 |
| --delay-row-first | 160ms | 首行延迟 |
| --delay-row-interval | 70ms | 每行递增延迟 |
| --delay-row-close-interval | 30ms | 退场每行递增间隔 |
| --sheet-blur | 32px | 遮罩模糊半径 |
| --sheet-saturate | 180% | 遮罩饱和度 |
| --sheet-scrim-alpha | 0.35 | 遮罩底色透明度 |
| --sheet-radius | 24px | 面板圆角 |

## 兜底

系统开启 prefers-reduced-motion: reduce 时，遮罩、面板、内容行的过渡时长全部归零，弹窗直接出现与消失。

## 与 JS 的约定

- active 和 closing 是 CSS 与 JS 的唯一接口，改动画时不要改这两个类名
- 关闭后的卸载延迟写在 Sheet.tsx 的 CLOSE_ANIMATION_MS（400ms），跟面板淡出时长（280ms）绑定，改一个要连带改另一个
