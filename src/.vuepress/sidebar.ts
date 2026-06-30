import { readFileSync, readdirSync } from "node:fs";
import type { Dirent } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { sidebar } from "vuepress-theme-hope";

type SidebarNode =
  | string
  | {
      text: string;
      icon?: string;
      link?: string;
      collapsible?: boolean;
      children?: SidebarNode[];
    };

type FrontmatterData = {
  title?: string;
  icon?: string;
};

type DirMeta = {
  title: string;
  icon?: string;
  link?: string;
  children: SidebarNode[];
};

const docsRoot = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirNames = new Set([".vuepress", "node_modules", "_temp"]);

function sortEntries(a: Dirent, b: Dirent): number {
  if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
  return a.name.localeCompare(b.name, "zh-Hans-CN");
}

function toRoute(fullPath: string): string {
  const relativePath = relative(docsRoot, fullPath).replace(/\\/g, "/");

  if (relativePath === "README.md") return "/";
  if (relativePath.endsWith("/README.md")) return "/" + relativePath.slice(0, -"README.md".length);

  return "/" + relativePath.replace(/\.md$/, ".html");
}

function readFrontmatter(mdFile: string): FrontmatterData {
  const raw = readFileSync(mdFile, "utf8");
  const parsed = matter(raw).data as FrontmatterData;
  return parsed ?? {};
}

function buildDirectoryMeta(dirPath: string): DirMeta {
  const entries = readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .filter((entry) => !(entry.isDirectory() && ignoredDirNames.has(entry.name)))
    .sort(sortEntries);

  const readmePath = entries.find((entry) => entry.isFile() && entry.name === "README.md")
    ? join(dirPath, "README.md")
    : null;
  const readmeFrontmatter = readmePath ? readFrontmatter(readmePath) : null;
  const readmeLink = readmePath ? toRoute(readmePath) : undefined;

  const children: SidebarNode[] = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const child = buildDirectoryMeta(fullPath);
      children.push({
        text: child.title,
        icon: child.icon,
        link: child.link,
        collapsible: true,
        children: child.children,
      });
      continue;
    }

    if (!entry.isFile() || extname(entry.name) !== ".md" || entry.name === "README.md") continue;

    const frontmatter = readFrontmatter(fullPath);
    children.push({
      text: frontmatter.title ?? basename(entry.name, ".md"),
      link: toRoute(fullPath),
    });
  }

  return {
    title: readmeFrontmatter?.title ?? basename(dirPath),
    icon: readmeFrontmatter?.icon,
    link: readmeLink,
    children,
  };
}

export default sidebar({
  "/": buildDirectoryMeta(docsRoot).children,
});
