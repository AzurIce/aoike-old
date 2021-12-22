import { Post } from "./Post";
import { join } from "path";
import { resolve } from "./utils/url";
import {
  IndexRendererData,
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
  copyFile,
} from "fs-extra";

import less from "less";

import { Theme } from "./config";

import importFrom from "import-from";
import { readFileSync } from "original-fs";

import markdown from "./markdown";

declare const __static: string;

const domain = "https://aoike.azurice.com";
const siteName = "Aoike青池";

export async function generateSite(
  postsDir: string,
  outputDir: string,
  posts: Post[],
  theme: Theme
): Promise<any> {
  const cssDir = join(outputDir, "styles");

  const postsData = posts.map((post) => {
    const res: PostData = {
      link: resolve(domain, "posts/" + post.fileName),
      content: "",
      filepath: post.filepath,
      fileName: post.fileName,
      title: post.title,
      createdTime: post.createdTime,
      modifiedTime: post.modifiedTime,
      category: post.category,
    };
    return res;
  });

  const rendererData: RendererData = {
    posts: postsData,
    domain: domain,
  };

  await clearOutputFolder(outputDir);

  copyFile(join(__static, "favicon.ico"), join(outputDir, "favicon.ico"));
  ensureDirSync(join(outputDir, "images"));
  copyFile(
    join(__static, "images", "avatar.jpg"),
    join(outputDir, "images", "avatar.jpg")
  );

  writeFileSync(join(outputDir, "CNAME"), "aoike.azurice.com");
  generateCss(cssDir, theme);

  return Promise.all([
    generateIndex(postsDir, outputDir, rendererData, theme),
    generatePosts(postsDir, outputDir, rendererData, theme),
  ]);

  // TODO: Posts -> /build/posts/xxx.html (will add folder support in the future)
}

function generateCss(cssDir: string, theme: Theme) {
  const lessDir = join(theme.dir, "assets", "styles");
  ensureDirSync(cssDir);
  const lessStr = readFileSync(join(lessDir, "main.less"), "utf-8");
  let css: string;
  // gulp
  //   .src(join(lessDir, "main.less"))
  //   .pipe(less())
  //   .pipe(dest(join(cssDir, "main.css")));

  less.render(lessStr, { paths: [lessDir] }, (err, res) => {
    if (!err && res != null) {
      css = res.css;
      const cssOverride: any = importFrom(theme.dir, "./style-override");
      // TODO: cssOverride
      css += cssOverride({ skin: "white" });
      writeFileSync(join(cssDir, "main.css"), css);
      return true;
    } else {
      console.log(err);
      return false;
    }
  });
}

async function generatePosts(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData,
  theme: Theme
) {
  const templatePath = join(theme.dir, "templates", "post.ejs");
  ensureDirSync(join(outputDir, "posts"));
  for (const post of rendererData.posts) {
    const outputPath = join(outputDir, "posts", post.fileName + ".html");
    post.content = readFileSync(post.filepath, "utf-8");

    // console.log(post.content.match(/<div class="mermaid">([\s\S]*?)<\/div>/g));

    post.content = markdown.render(post.content);

    post.content = post.content.replace(
      /<pre><code class="hljs language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
      '<div class="mermaid">$1</div>'
    );

    post.content = post.content.replace(/&gt;/g, ">");

    const postRendererData: PostRendererData = {
      post: post,
      siteName: siteName,
      ...rendererData,
    };

    let html = "";
    ejs.renderFile(templatePath, postRendererData, (err: any, str) => {
      if (err) {
        return err;
      } else {
        html = str;
        writeFileSync(outputPath, html);
      }
    });
  }
  return true;
}

async function generateIndex(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData,
  theme: Theme
) {
  const outputPath = join(outputDir, "index.html");
  const templatePath = join(theme.dir, "templates", "index.ejs");

  // const tags: Set<string> = new Set<string>();
  // rendererData.posts.forEach((post) => {
  //   post.tags.forEach((tag) => {
  //     tags.add(tag);
  //   });
  // });

  const indexRendererData: IndexRendererData = {
    siteName,
    ...rendererData,
  };

  let html = "";
  await ejs.renderFile(
    templatePath,
    indexRendererData,
    async (err: any, str) => {
      if (err) {
        console.log(err);
      } else {
        html = str;
      }
    }
  );
  return await writeFile(outputPath, html);
}

async function clearOutputFolder(outputDir: string): Promise<void> {
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
