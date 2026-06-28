import { sidebar } from "vuepress-theme-hope";

// 图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// https://fontawesome.com/search?m=free&o=r
export default sidebar({
  "/": [
    "DailyRoutine",
    "Fitness",
    // 读书笔记架构更换到 docsify，不能使用相对链接
    // { text: "读书笔记", icon: "fa6-brands:readme", link: "https://newzone.top/reading/" },
    // 指定显示页面
    {
  text: "📖 读书笔记",
  icon: "",
  prefix: "reading/",
  collapsible: true,
  children: [
    "README.md",
    {
      text: "效率与习惯",
      icon: "fa6-solid:bolt",
      prefix: "0_效率与习惯/",
      collapsible: true,
    },
    {
      text: "思维与成长",
      icon: "fa6-solid:seedling",
      prefix: "1_思维与成长/",
      collapsible: true,
    },
    {
      text: "沟通与影响",
      icon: "fa6-solid:comments",
      prefix: "2_沟通与影响/",
      collapsible: true,
    },
    {
      text: "创意与写作",
      icon: "fa6-solid:pen-nib",
      prefix: "3_创意与写作/",
      collapsible: true,
    },
    {
      text: "健康与生活",
      icon: "fa6-solid:heart-pulse",
      prefix: "4_健康与生活/",
      collapsible: true,
    },
    {
      text: "商业与社会",
      icon: "fa6-solid:briefcase",
      prefix: "5_商业与社会/",
      collapsible: true,
    },
  ],
},

    {
      text: "🧰 应用手册",
      icon: "",
      prefix: "apps/",
      collapsible: true,
      children: [
        "Applist.md",
        "toolbox.md",
        "encrypt03.md",
        {
          text: "其他",
          icon: "fa6-solid:code-compare",
          collapsible: true,
          children: ["design.md"],
        },
      ],
    },
    // {
    //   text: "🌐 页面开发",
    //   icon: "",
    //   prefix: "web/",
    //   collapsible: true,
    //   children: "structure",
    // },
    {
      text: "🏗️ 网站部署",
      icon: "",
      prefix: "deploy/",
      collapsible: true,
      children: [
        "Static.md",
        "CloudServices.md",
        "VPS.md",
        {
          text: "部署工具",
          icon: "fa6-brands:windows",
          collapsible: true,
          children: ["GitHub.md", "Cloudflare.md", "MySQL.md", "DNS.md"],
        },
      ],
    },
    {
      text: "🔡 代码编程",
      icon: "",
      prefix: "code/",
      collapsible: true,
      children: [
        "README.md",
        {
          text: "Basic",
          icon: "fa6-solid:cube",
          collapsible: true,
          children: ["Markdown.md", "Electron.md", "AutoHotkey.md", "Regex.md"],
        },
        {
          text: "FrondEnd",
          icon: "fa6-solid:object-group",
          collapsible: true,
          children: ["Vue.md", "HTML.md", "Javascript.md", "Python.md"],
        },
      ],
    },
    // {
    //   text: "🛖 生活记录",
    //   icon: "",
    //   prefix: "family/",
    //   collapsible: true,
    //   children: "structure",
    // },
    {
      text: "加密目录",
      icon: "material-symbols:encrypted",
      prefix: "encrypt/",
      collapsible: true,
      children: "structure",
    },
    // {
    //   text: "博客文章",
    //   icon: "fa6-solid:feather-pointed",
    //   prefix: "_posts/",
    //   link: "/blog",
    //   collapsible: true,
    //   children: "structure",
    // },
  ],
  // 专题区（独立侧边栏）
  "/apps/topic/": "structure",
  // 如果你不想使用默认侧边栏，可以按照路径自行设置。但需要去掉下方配置中的注释，以避免博客和时间轴出现异常。_posts 目录可以不存在。
  /*"/_posts/": [
    {
      text: "博客文章",
      icon: "fa6-solid:feather-pointed",
      prefix: "",
      link: "/blog",
      collapsible: true,
      children: "structure",
    },
  ], */
});
