# PANSPACE UI

React 组件库，目前 2 个组件（Sheet、Button）。只提供 UI 骨架：结构、样式、动效；组件内没有任何业务内容，文案、图标、数据全部由使用方通过 children 传入。

标签：React · 无业务内容 · 动效可调

## 名字由来

仓库名里的 contact 来自组件的抽取来源（来源站点上的那个「联系」弹窗），不是这个仓库的用途。它是组件库，不是页面模板，也不是联系页；组件内部没有表单、没有邮箱字段、没有任何与联系相关的内容。

## 效果预览

暂无截图。这里不放无法验证的图片，只做客观描述：

- Sheet：页面中央出现一块面板，背后是全屏遮罩并带毛玻璃模糊；面板从下方上浮到居中并淡入；面板内的内容行依次淡入上移（首行延迟 160ms，之后每行递增 70ms）；点击遮罩或按 Esc 关闭，关闭时内容行反向错开退场。
- Button：三种变体（实心蓝、半透明、无边框）乘三种尺寸。

想看实际效果，本地跑起来最快，见下面的「快速开始」。

## 组件一览

| 组件 | 说明 | 源码 | 文档 |
| --- | --- | --- | --- |
| Sheet | 居中弹窗：遮罩毛玻璃、面板弹性入场、内容逐行交错入场 | `src/components/ui/Sheet.tsx` | `docs/sheet-animation.md` |
| Button | 按钮：primary / secondary / ghost 三种变体，sm / md / lg 三种尺寸 | `src/components/ui/Button.tsx` | 源文件里的 VARIANT / SIZE 两张表 |

## 这是什么 / 不是什么

- 是：无业务内容的骨架组件。结构、类名、动效参数都可复用，内容由你提供。
- 是：动效参数化的组件。所有时长、延迟、缓动都是 CSS 变量，改一处即可整体改速。
- 不是：UI 框架全家桶。目前只有 2 个组件，没有表单、表格、布局系统、主题系统。
- 不是：页面模板或设计系统。没有页面级布局，也没有设计规范文档。
- 不是：开箱即用的工程。本仓库没有 package.json，跑不了 npm run dev，需要放进你自己的 React 工程，见下一节。

## 快速开始

最小可运行清单：一个 React + TypeScript 工程、Tailwind CSS、两个依赖包。本仓库不提供工程脚手架，下面以 Vite 为例，Next 同理。

1. 建一个空白工程
   npm create vite@latest sheet-preview -- --template react-ts
   cd sheet-preview

2. 装依赖
   npm i motion @phosphor-icons/react
   npm i -D tailwindcss @tailwindcss/vite

3. 接上 Tailwind：vite.config.ts 里加上 tailwindcss() 插件，入口 CSS 里写 @import "tailwindcss";

4. dark 变体用 class 策略：Tailwind v4 在入口 CSS 里加 @custom-variant dark (&:where(.dark, .dark *));，v3 把 darkMode 配成 class。细节见「使用要点」第 5 条。

5. 把本仓库的 src/components/ui/ 整个目录复制到工程的 src/components/ui/

6. 把 examples/SheetExample.tsx 复制到工程的 src/SheetExample.tsx，并把它的导入从 "../src" 改成 "./components/ui/Sheet" 与 "./components/ui/Button"（示例用的是本仓库的库入口路径，在工程里直接从组件文件导入更直接）

7. 在 src/App.tsx 里渲染 SheetExample，然后 npm run dev

想看暗色效果，在 index.html 的 html 标签上加 class="dark"。

最小用法（不起示例文件，直接写）：

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

关于示例文件的定位：examples/SheetExample.tsx 只演示两件事 —— API 怎么调（isOpen / onClose / ariaLabel / children），以及逐行交错入场怎么写（每行套一个 sheet-detail-row）。里面的文案是占位符，它不是内容结构模板，不建议照抄它的行数、层级和排版；弹窗里放什么、放几行，由你的场景决定。

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

## 目录结构

```
src/
  index.ts               # 库入口
  components/ui/
    Sheet.tsx            # 弹窗骨架（结构 + 交互 + 时序）
    sheet.css            # 弹窗样式与动画变量
    Button.tsx           # 按钮
examples/
  SheetExample.tsx       # 示例：内容全部是占位符，只演示 API 与交错入场写法
docs/
  sheet-animation.md     # 动画系统与参数说明
  provenance.md          # Sheet 骨架的来源与反解记录
  demo-guideline.md      # 写 demo 的规范：展示组件本身，不要编造业务内容
```

## 后续计划

这个仓库会陆续加入我自己的原创 UI 组件，同样是「骨架 + 样式 + 动效」，不含业务内容。新组件放 src/components/ui/，示例放 examples/，文档放 docs/。每次加组件时同步更新上面的组件一览表。

## 来源与版权

首个组件 Sheet 的样式与动效骨架，抽取自我个人站点 panspace.odn.cc 的线上打包产物（一段注入式 CSS，未做任何数值改动），页面内容部分没有收录。反解过程见 `docs/provenance.md`。代码与样式版权归仓库作者所有。
