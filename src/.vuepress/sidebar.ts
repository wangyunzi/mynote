import { readdirSync } from "node:fs";
import type { Dirent } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { sidebar } from "vuepress-theme-hope";

type SidebarNode =
  | string
  | {
      text: string;
      link?: string;
      collapsible?: boolean;
      children?: SidebarNode[];
    };

const docsRoot = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirNames = new Set([".vuepress", "node_modules", "_temp"]);

function sortEntries(a: Dirent, b: Dirent): number {
  if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
  return a.name.localeCompare(b.name, "zh-Hans-CN");
}

function createLink(fullPath: string): string {
  const relativePath = relative(docsRoot, fullPath).replace(/\\/g, "/");

  if (relativePath === "README.md") return "/";
  if (relativePath.endsWith("/README.md")) return "/" + relativePath.slice(0, -"README.md".length);

  return "/" + relativePath.replace(/\.md$/, ".html");
}

function buildDirectoryItems(dirPath: string): SidebarNode[] {
  const entries = readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .filter((entry) => !(entry.isDirectory() && ignoredDirNames.has(entry.name)))
    .sort(sortEntries);

  return entries.flatMap((entry) => {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      return {
        text: entry.name,
        collapsible: true,
        children: buildDirectoryItems(fullPath),
      };
    }

    if (!entry.isFile() || extname(entry.name) !== ".md") return [];

    return {
      text: basename(entry.name, ".md"),
      link: createLink(fullPath),
    };
  });
}

export default sidebar({
  "/": buildDirectoryItems(docsRoot),
});
