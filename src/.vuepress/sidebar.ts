import { sidebar } from "vuepress-theme-hope";

// 图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// https://fontawesome.com/search?m=free&o=r
export default sidebar({
  "/": [
    // 读书笔记架构更换到 docsify，不能使用相对链接
    // { text: "读书笔记", icon: "fa6-brands:readme", link: "https://newzone.top/reading/" },
    {
      text: "📖 读书笔记",
      icon: "fa6-brands:readme",
      prefix: "reading/",
      collapsible: true,
      children: [
        "README.md",
        {
          text: "效率与习惯",
          icon: "fa6-solid:bolt",
          prefix: "0_效率与习惯/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "思维与成长",
          icon: "fa6-solid:seedling",
          prefix: "1_思维与成长/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "沟通与影响",
          icon: "fa6-solid:comments",
          prefix: "2_沟通与影响/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "创意与写作",
          icon: "fa6-solid:pen-nib",
          prefix: "3_创意与写作/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "健康与生活",
          icon: "fa6-solid:heart-pulse",
          prefix: "4_健康与生活/",
          collapsible: true,
          children: "structure",
        },
        {
          text: "商业与社会",
          icon: "fa6-solid:briefcase",
          prefix: "5_商业与社会/",
          collapsible: true,
          children: "structure",
        },
      ],
    },
    {
      text: "🧰 应用手册",
      icon: "fa6-solid:toolbox",
      prefix: "apps/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "🏗️ 网站部署",
      icon: "fa6-solid:cloud-arrow-up",
      prefix: "deploy/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "🔡 代码编程",
      icon: "fa6-solid:code",
      prefix: "code/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "加密目录",
      icon: "material-symbols:encrypted",
      prefix: "encrypt/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "博客文章",
      icon: "fa6-solid:feather-pointed",
      prefix: "_posts/",
      collapsible: true,
      children: "structure",
    },
  ],
});
