import { Post } from "./Post";
import { join } from "path";
import { resolve } from "./utils/url";
import {
  PostData,
  PostRendererData,
  RendererData,
} from "./interfaces/rendererData";
import ejs from "ejs";
import { writeFile } from "fs/promises";
import {
  ensureDirSync,
  writeFileSync,
  readdirSync,
  removeSync,
} from "fs-extra";

// import less from "less";

import importFrom from "import-from";
import { readFileSync } from "original-fs";
import { ipcMain, ipcRenderer } from "electron";

import markdown from "./markdown";

declare const __static: string;

const domain = "https://aoike.azurice.com";

export async function generateIndex(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData
): Promise<void> {
  const res = await ipcRenderer.invoke(
    "generateIndex",
    outputDir,
    rendererData
  );
  console.log("[generateIndex]: ", res);
}

export async function generatePosts(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData
): Promise<void> {
  const res = ipcRenderer.sendSync(
    "generatePosts",
    postsDir,
    outputDir,
    rendererData
  );
  console.log("[generatePosts]: ", res);
}

export async function generateCss(outputDir: string): Promise<void> {
  const cssDir = join(outputDir, "styles");

  // console.log(lessPath);
  const res = ipcRenderer.sendSync("generateCSS", cssDir);
  console.log("[generateCSS]: ", res);

  // TODO: cssOverride
  // const cssOverride: any = importFrom(themeDir, "./style-override");
  // console.log(cssOverride());
}

export async function generateSite(
  postsDir: string,
  outputDir: string,
  posts: Post[]
): Promise<void> {
  let postsData = [];
  postsData = posts.map((post) => {
    const res: PostData = {
      fileName: post.fileName,
      title: post.title,
      link: resolve(domain, "posts/"+post.fileName),
      createdTime: post.createdTime,
      modifiedTime: post.modifiedTime,
      content: "",
    };
    return res;
  });

  const rendererData: RendererData = {
    posts: postsData,
    domain: domain,
  };

  await clearOutputFolder(outputDir);

  generateCss(outputDir);
  generateIndex(postsDir, outputDir, rendererData);
  generatePosts(postsDir, outputDir, rendererData);

  // TODO: Posts -> /build/posts/xxx.html (will add folder support in the future)
}

export async function clearOutputFolder(outputDir: string): Promise<void> {
  const files = readdirSync(outputDir, { withFileTypes: true });
  const needClearPath = files
    .map((item) => item.name)
    .filter((name: string) => name !== ".git");

  try {
    needClearPath.forEach(async (name: string) => {
      removeSync(join(outputDir, name));
    });
  } catch (e) {
    console.log("Delete file error", e);
  }
}
