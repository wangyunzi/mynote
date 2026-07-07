---
title: 我的 VuePress 博客改造记录
date: 2026-07-01
category:
  - 博客搭建
  - 部署记录
tag:
  - VuePress
  - GitHub Actions
  - Cloudflare
  - Wrangler
  - pnpm
---

这篇文章记录我对 `mynote` 博客的一次完整调整，从笔记同步、侧边栏重构到 Cloudflare 部署。

这次不是单纯改页面样式，而是把整个使用流程重新理顺：内容从 `myob` 仓库同步到 `mynote`，`mynote` 负责 VuePress 展示，再通过 Cloudflare / Wrangler 部署。

最终目标是：

- 在 `myob/wiki/tech` 里维护 Markdown 笔记。
- 自动同步 Markdown 到 `mynote/src`。
- `mynote/src` 的真实目录结构就是博客菜单结构。
- 目录下的 `README.md` 作为目录首页。
- 保密目录继续正确加密。
- Cloudflare 能稳定构建和部署。

## 一、整体思路

我现在把两个仓库分工拆开：

```text
myob
└── wiki/tech/              # 原始笔记维护区

mynote
└── src/                    # VuePress 博客内容区
    ├── reading/
    ├── apps/
    ├── deploy/
    ├── code/
    ├── encrypt/
    └── .vuepress/          # VuePress 配置，不参与 myob 同步覆盖
````

也就是说：

```
myob/wiki/tech/**/*.md  ->  mynote/src/**/*.md
```

但 `mynote/src/.vuepress` 不同步、不覆盖。这个目录是博客自己的配置，应该留在 `mynote` 仓库里单独维护。

## 二、为什么同步流程放在 myob

一开始我想把 `myob/wiki/tech` 的变化同步到 `mynote/src`。这个动作应该由源仓库 `myob` 触发。

原因很简单：谁变化，谁触发。

所以 GitHub Actions workflow 放在：

```
myob/.github/workflows/Sync_Tech_To_Mynote.yml
```

不是放在 `mynote`。

这个 workflow 的职责是：

- 监听 `myob` 的 `wiki/tech/**/*.md` 变化。
- 把 Markdown 文件同步到 `mynote/src`。
- 删除源仓库中已经删除的 Markdown 对应文件。
- 不碰 `.vuepress`、图片、脚本、样式等非 Markdown 文件。

## 三、Trigger_TOKEN 放在哪里

`Trigger_TOKEN` 要放在 `myob` 仓库。

路径是：

```
wangyunzi/myob
Settings
Secrets and variables
Actions
New repository secret
```

secret 名称：

```
Trigger_TOKEN
```

原因是 workflow 在 `myob` 里运行，GitHub Actions 只能读取当前运行仓库的 secrets。

`mynote` 不需要放这个 token。`mynote` 只需要允许这个 token 对应的用户或 App 写入 `main` 分支。

## 四、为什么只同步 Markdown

一开始如果把整个 `wiki/tech` 镜像到 `mynote/src`，会有一个风险：`.vuepress` 也可能被同步过去，覆盖 `mynote` 自己的站点配置。

所以后来规则改成只同步：

```
*.md
```

并且明确排除：

```
myob/wiki/tech/.vuepress
mynote/src/.vuepress
```

这样做之后：

- 笔记内容由 `myob` 管。
- 博客配置由 `mynote` 管。
- 两边职责分开，不互相覆盖。

这是这次同步方案里最重要的一点。

## 五、不要用 GitHub 网页上传大量文件

同步过程中遇到过 GitHub 网页上传限制：

```
Yowza, that’s a lot of files. Try uploading fewer than 100 at a time.
```

这说明网页一次上传文件太多了。

后面统一改用终端 Git：

```
cd /Users/yy/Desktop/ineedit/myob
git add .github/workflows/Sync_Tech_To_Mynote.yml
git commit -m "Only sync tech markdown files to mynote"
git push -u origin master
```

如果要提交大量 Markdown，也用命令行：

```
git add wiki/tech/**/*.md
git commit -m "Add tech markdown notes"
git push -u origin master
```

这里还有一个分支名区别：

```
myob 使用 master
mynote 使用 main
```

不要在 `mynote` 里执行 `git push origin master`，否则会报：

```
src refspec master does not match any
```

## 六、读书笔记同步后，菜单为什么乱了

同步 `reading` 目录后，访问：

```
/reading/
```

页面上直接出现了一堆目录：

```
效率与习惯
思维与成长
沟通与影响
创意与写作
健康与生活
商业与社会
```

这不是文件坏了，而是 VuePress / Theme Hope 在页面里自动展示了目录结构。

一开始尝试在 `sidebar.ts` 里手写：

```
{
  text: "📖 读书笔记",
  prefix: "reading/",
  collapsible: true,
  children: [
    "README.md",
    {
      text: "效率与习惯",
      prefix: "0_效率与习惯/",
      children: "structure",
    },
  ],
}
```

这个方式能用，但维护成本高。以后每加一本书，都要改一次 `sidebar.ts`。

后来思路调整为：不要手动列文件，尽量让目录结构自动生成菜单。

## 七、sidebar 配置的几个坑

早期我把这句写进了 `"/": []` 数组里面：

```
"/reading/": "structure"
```

这是错的。

它应该写在数组外面，和其他路径配置同级：

```
export default sidebar({
  "/": [
    "DailyRoutine",
    "Fitness",
    { text: "读书笔记", icon: "fa6-brands:readme", link: "/reading/" },
  ],

  "/reading/": "structure",

  "/apps/topic/": "structure",
});
```

还有一个问题是：如果只写折叠菜单，没有 `link`，点击目录标题只会展开，不会打开页面。

所以如果希望“读书笔记”本身能点击打开，要写：

```
{
  text: "读书笔记",
  icon: "fa6-brands:readme",
  prefix: "reading/",
  link: "/reading/",
  collapsible: true,
  children: "structure",
}
```

不过这套 `structure` 方案后来仍然不够符合我的需求，因为它对空目录、README 首页、目录名图标的处理不完全可控。

## 八、最终侧边栏方案：目录是什么样，菜单就是什么样

最后我把 `src/.vuepress/sidebar.ts` 改成自定义目录扫描逻辑。

最终规则是：

- `src` 目录是什么结构，菜单就是什么结构。
- 文件夹存在就显示，即使是空文件夹。
- 文件夹名里有 emoji，菜单也保留。
- 目录里有 `README.md` 时，它就是目录首页。
- `README.md` 不再作为子菜单单独显示。
- 目录菜单的名称和图标优先读取 `README.md` 的 frontmatter。

也就是说：

```
src/📚reading/README.md
```

对应：

```
/📚reading/
```

而不是在 `📚reading` 下面再多一个 `README` 菜单。

## 九、目录首页应该怎么写

每个目录建议放一个 `README.md`：

```
src/apps/README.md
src/deploy/README.md
src/code/README.md
src/reading/README.md
src/encrypt/README.md
```

例如：

```
---
title: 应用手册
icon: toolbox
index: false
---

# 应用手册
```

这样目录本身可以打开，侧边栏也能读取它的 `title` 和 `icon`。

之前只有 `code/README.md`，所以“代码编程”能打开，而 `apps/`、`deploy/` 没有首页，点击就没有内容。后来补了：

```
src/apps/README.md
src/deploy/README.md
```

目录入口就正常了。

## 十、保密目录的加密路径要和真实路由一致

保密文档曾经出现“不需要密码”的问题。

原因不是密码配置丢了，而是目录名和加密配置不一致。

如果真实目录是：

```
src/🔑encrypt/
```

对应路由可能是：

```
/🔑encrypt/
```

那么主题配置里如果还写：

```
"/encrypt/": {
  password: ["1113", "2000"],
  hint: "从 博主 获取密码",
}
```

就匹配不到页面。

最终要保证三者一致：

```
目录名
页面路由
加密配置路径
```

如果使用普通目录：

```
src/encrypt/
```

那配置就写：

```
"/encrypt/": {
  password: ["0000"],
  hint: "从 博主 获取密码",
}
```

## 十一、sidebar.ts 的一个构建错误

自定义侧边栏生成器里踩过一个转义错误。

错误日志：

```
ERROR: Unterminated string literal
src/.vuepress/sidebar.ts
```

问题出在路径替换写坏了。

正确写法应该是：

```
.replace(/\\/g, "/")
```

它的作用是把 Windows 路径里的反斜杠转换成 URL 使用的 `/`。

这类构建期脚本改完后，一定要跑构建检查。

## 十二、pnpm-workspace.yaml 的问题

Cloudflare 安装依赖时报过：

```
ERROR  packages field missing or empty
```

原因是仓库里有 `pnpm-workspace.yaml`，但没有 `packages` 字段。

原来只有：

```
allowBuilds:
  "@parcel/watcher": true
  esbuild: true
```

应该改成：

```
packages:
  - "."

allowBuilds:
  "@parcel/watcher": true
  esbuild: true
```

这个项目不是多包 monorepo，所以 `packages: ["."]` 就够了。

## 十三、Cloudflare 构建命令

这个项目的构建命令是 VuePress：

```
pnpm run docs:build
```

原来的 GitHub Pages 工作流里还会复制阅读目录到静态资源目录：

```
pnpm cpx "src/reading/**" src/.vuepress/public/reading
```

所以 Cloudflare 构建命令写：

```
pnpm cpx "src/reading/**" src/.vuepress/public/reading && pnpm run docs:build
```

部署命令写：

```
npx wrangler deploy
```

根目录不要填 `src/.vuepress/dist`。根目录应该是仓库根目录，也就是：

```
留空 或 .
```

如果报：

```
No package.json was found in "/opt/buildhome/repo"
```

说明 Cloudflare 当前实际构建目录里没有 `package.json`，要检查绑定的仓库、分支和 Root directory 是否指向了真正的仓库根目录。

## 十四、Wrangler 配置

Cloudflare / Wrangler 自动初始化时曾经生成：

```
"assets": {
  "directory": ".vuepress/dist"
}
```

这是错的。

VuePress 实际输出目录是：

```
src/.vuepress/dist
```

所以仓库根目录应新建：

```
wrangler.jsonc
```

内容：

```
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "mynote",
  "compatibility_date": "2026-06-28",
  "observability": {
    "enabled": true
  },
  "assets": {
    "directory": "src/.vuepress/dist"
  },
  "compatibility_flags": [
    "nodejs_compat"
  ]
}
```

这样 Wrangler 就不会每次自动猜错目录。

## 十五、Cloudflare 最终配置

Cloudflare 页面里最终这样填：

```
Root directory:
留空 或 .

Build command:
pnpm cpx "src/reading/**" src/.vuepress/public/reading && pnpm run docs:build

Deploy command:
npx wrangler deploy
```

`wrangler.jsonc` 里：

```
assets.directory = src/.vuepress/dist
```

不要写：

```
.vuepress/dist
```

也不要把 Root directory 写成：

```
src/.vuepress/dist
```

因为这个目录是构建之后才生成的。

## 十六、取消旧的 GitHub Pages 部署

迁移到 Cloudflare 之后，`mynote` 已经不需要再通过 GitHub Pages 发布页面。

后来在 GitHub 上看到很多类似这样的提交和报错：

```
Deploying to gh-pages from @ ...
```

这不是 Cloudflare 的问题，而是 `mynote` 仓库里还保留着旧的 GitHub Actions workflow：

```
.github/workflows/main.yml
```

这个 workflow 原来的逻辑是：

1. 监听 `main` 分支 push。
2. 安装依赖并执行 VuePress 构建。
3. 使用 `JamesIves/github-pages-deploy-action` 把 `src/.vuepress/dist` 推送到 `gh-pages` 分支。
4. 如果配置了 FTP secret，再额外同步到 FTP 服务器。

其中真正导致 GitHub Pages 反复部署的是这一段：

```
- name: Deploy GitHub Pages
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    branch: gh-pages
    folder: src/.vuepress/dist
```

既然现在页面已经由 Cloudflare 部署，就应该删除这个旧 workflow，避免以后每次推送 `mynote/main` 都再去更新 `gh-pages`。

代码层面的处理：

```
删除 mynote/.github/workflows/main.yml
```

GitHub 网页上还要再检查一次 Pages 设置：

```
wangyunzi/mynote
Settings
Pages
```

如果页面还显示正在通过 `gh-pages` 发布，就把 GitHub Pages 取消发布，或者把 Build and deployment 的 Source 改为 `None`。

这个调整之后，部署职责就更清楚了：

- `myob` 负责写作和同步 Markdown。
- `mynote` 负责保存 VuePress 源码。
- Cloudflare 负责构建和发布页面。
- `gh-pages` 分支不再作为正式部署入口。

## 十七、GitHub Actions 自动审批 PR 的坑

还遇到过一个 GitHub Actions 报错：

```
GitHub Actions is not permitted to approve pull requests.
```

这是 GitHub 权限限制，不是命令写错。

如果要让 Actions 审批 PR，需要仓库设置允许：

```
Allow GitHub Actions to create and approve pull requests
```

workflow 里还需要：

```
permissions:
  contents: read
  pull-requests: write
```

否则 `GITHUB_TOKEN` 不能自动 approve PR。

## 十八、这次改造后的维护方式

以后我的维护流程变成：

1. 在 `myob/wiki/tech` 写 Markdown。
2. 推送 `myob/master`。
3. GitHub Actions 同步 Markdown 到 `mynote/src`。
4. `mynote` 的 VuePress 根据真实目录生成菜单。
5. Cloudflare 从 `mynote/main` 构建并部署。

新增一个栏目时，优先这样组织：

```
src/
  reading/
    README.md
    0_效率与习惯/
      README.md
      The_5_AM_Club.md
  apps/
    README.md
  deploy/
    README.md
  encrypt/
    README.md
```

每个目录首页写好：

```
---
title: 阅读笔记
icon: book
index: false
---
```

这样侧边栏、目录首页、图标和部署流程都能稳定工作。

这次最大的经验是：内容仓库、展示仓库、菜单生成、构建产物目录、部署命令必须分清职责。只要这些边界清楚，后续新增文章、调整栏目、迁移部署平台都会轻松很多。 
