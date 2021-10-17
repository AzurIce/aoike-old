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
import { ensureDirSync, writeFileSync } from "fs-extra";

// import less from "less";

import importFrom from "import-from";
import { readFileSync } from "original-fs";
import { ipcMain, ipcRenderer } from "electron";

import markdown from "./markdown";

declare const __static: string;
const domain = "https://aoike.azurice.com";
const themeDir = join(__static, "defaults", "themes", "aoikeNotes");
const templatesDir = join(themeDir, "templates");
const assetsDir = join(themeDir, "assets");

export async function generateIndex(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData
): Promise<void> {
  const outputPath = join(outputDir, "index.html");
  const templatePath = join(templatesDir, "index.ejs");

  let html = "";
  await ejs.renderFile(templatePath, rendererData, async (err: any, str) => {
    if (err) {
      console.log(err);
    } else {
      html = str;
    }
  });
  await writeFile(outputPath, html);
}

export async function generatePosts(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData
): Promise<void> {
  const templatePath = join(templatesDir, "post.ejs");
  ensureDirSync(join(outputDir, "posts"));
  for (const post of rendererData.posts) {
    const outputPath = join(outputDir, "posts", post.fileName + ".html");
    post.content = readFileSync(join(postsDir, post.fileName + ".md"), "utf-8");

    post.content = markdown.render(post.content);

    const postRendererData: PostRendererData = {
      post: post,
      domain: domain,
    };

    let html = "";
    await ejs.renderFile(
      templatePath,
      postRendererData,
      async (err: any, str) => {
        if (err) {
          console.log(err);
        } else {
          html = str;
        }
      }
    );
    await writeFile(outputPath, html);
  }
  console.log("[generatePosts]");
}

export async function generateCss(outputDir: string): Promise<void> {
  const lessDir = join(assetsDir, "styles");
  const cssDir = join(outputDir, "styles");

  ensureDirSync(cssDir);

  // console.log(lessPath);
  const res = ipcRenderer.sendSync("generateCSS", lessDir, cssDir);
  console.log("generateCSS: ", res);

  // TODO: cssOverride
  // const cssOverride: any = importFrom(themeDir, "./style-override");
  // console.log(cssOverride());
}

export async function generateSite(
  postsDir: string,
  outputDir: string,
  posts: Post[]
): Promise<void> {
  const html = "";
  const renderPath = join(outputDir, "index.html");
  const templatePath = join(templatesDir, "index.ejs");

  let postsData = [];
  postsData = posts.map((post) => {
    const res: PostData = {
      fileName: post.fileName,
      title: post.title,
      link: resolve(domain, post.fileName),
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

  generateCss(outputDir);
  generateIndex(postsDir, outputDir, rendererData);
  generatePosts(postsDir, outputDir, rendererData);

  // TODO: Posts -> /build/posts/xxx.html (will add folder support in the future)
}
