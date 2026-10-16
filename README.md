# PANSPACE UI

个人复用的 React UI 组件库：只放「骨架 + 样式 + 动效」，不放业务内容。所有文案、图标、数据都由使用方以 children 传入。

| 组件 | 说明 |
| --- | --- |
| Sheet | 居中弹窗：遮罩毛玻璃、面板弹性入场、内容逐行交错入场 |
| Button | 按钮：primary / secondary / ghost 三种变体，sm / md / lg 三种尺寸 |

## 目录结构

```
src/
  index.ts               # 库入口
  components/ui/
    Sheet.tsx            # 弹窗骨架（结构 + 交互 + 时序）
    sheet.css            # 弹窗样式与动画变量
    Button.tsx           # 按钮
examples/
  SheetExample.tsx       # 示例：内容全部是占位符
docs/
  sheet-animation.md     # 动画系统与参数说明
  provenance.md          # Sheet 骨架的来源与反解记录
```

## 依赖

```bash
npm i motion @phosphor-icons/react
```

- motion：动画库（也可以换成 framer-motion，改一下导入路径即可）
- @phosphor-icons/react：Sheet 的关闭按钮用了 XIcon

## 快速开始

```tsx
"use client";

import { useState } from "react";
import { Sheet, Button } from "./src";

export function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" size="lg" onClick={() => setIsOpen(true)}>
        按钮
      </Button>

      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="示例弹窗">
        <div className="sheet-detail-row flex justify-center">
          <h2 className="text-xl font-bold mb-3">此处是标题</h2>
        </div>
        <div className="sheet-detail-row flex justify-center">
          <p className="text-sm mb-6">此处是文本</p>
        </div>
      </Sheet>
    </>
  );
}
```

完整写法见 `examples/SheetExample.tsx`。

## 使用要点

1. 内容全部由调用方传入：Sheet 只负责遮罩、面板、动效容器，标题 / 文本 / 按钮都是 children，组件内部没有任何业务文案。
2. 交错入场靠 sheet-detail-row：需要逐行淡入上移的块要同时满足两点 —— 加上 sheet-detail-row 类，并且是弹窗内容层的直接子元素。进场延迟由 :nth-child(1..8) 计算（首行 160ms，之后每行 +70ms），中间多包一层 div 就会退化成同时出现。
3. 按钮文案是占位符：示例里写「按钮」「按下」，实际使用时替换成自己的文案。
4. 关闭动画与卸载时机要同步：面板淡出 280ms，Sheet 内部等 400ms 再卸载（CLOSE_ANIMATION_MS）。改动画时长时记得一起改。
5. Tailwind dark 必须是 class 策略：sheet.css 里有 .dark .sheet-panel。Tailwind v4 用 @custom-variant dark；v3 把 darkMode 配成 class。
6. 容易被全局样式覆盖时：把 sheet.css 换成模板字符串注入 style 标签，样式就跟组件同生共死，不参与全局加载顺序竞争。
7. 主色是 #0071E3（Apple 蓝），散落在 Button 的变体类和示例的图标底色里，换品牌色时全局替换这个色值即可。

## 动画怎么调

所有时长、延迟、缓动都是 sheet.css 顶部的 CSS 变量：--dur-* 时长、--delay-* 延迟、--ease-* 缓动、--sheet-* 外观。改一处即可整体改速，明细见 `docs/sheet-animation.md`。

## 交互与无障碍

- 点击遮罩关闭，面板内点击不会冒泡
- Esc 关闭
- role 为 dialog、aria-modal、aria-label 由使用方传入
- 打开时锁定页面滚动，关闭后恢复
- 系统开启 prefers-reduced-motion: reduce 时所有过渡时长归零

## 后续计划

这个仓库会陆续加入我自己的原创 UI 组件，同样是「骨架 + 样式 + 动效」，不含业务内容。新组件放 src/components/ui/，示例放 examples/，文档放 docs/。

## 来源与版权

首个组件 Sheet 的样式与动效骨架，抽取自我个人站点 panspace.odn.cc 的线上打包产物（一段注入式 CSS，未做任何数值改动），页面内容部分没有收录。反解过程见 `docs/provenance.md`。代码与样式版权归仓库作者所有。
