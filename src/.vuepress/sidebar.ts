import { sidebar } from "vuepress-theme-hope";

// 图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// https://fontawesome.com/search?m=free&o=r
export default sidebar({
  "/": [
    // 读书笔记架构更换到 docsify，不能使用相对链接
    // { text: "读书笔记", icon: "fa6-brands:readme", link: "https://newzone.top/reading/" },
    {
      text: "📖 读书笔记",
      icon: "",
      prefix: "reading/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "🧰 应用手册",
      icon: "",
      prefix: "apps/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "🏗️ 网站部署",
      icon: "",
      prefix: "deploy/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "🔡 代码编程",
      icon: "",
      prefix: "code/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "加密目录",
      icon: "",
      prefix: "encrypt/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "博客文章",
      icon: "",
      prefix: "_posts/",
      collapsible: true,
      children: "structure",
    },
  ],
});
