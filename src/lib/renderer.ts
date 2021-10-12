import { Post } from "./Post";
import { join } from "path";
import { resolve } from "./utils/url";
import { PostData, RendererData } from "./interfaces/rendererData";
import ejs from "ejs";
import { writeFile } from "fs/promises";

declare const __static: string;
const domain = "https://aoike.azurice.com";
const templateDir = join(
  __static,
  "defaults",
  "themes",
  "aoikeNotes",
  "templates"
);

export async function generateIndex(
  postsDir: string,
  outputDir: string,
  rendererData: RendererData
): Promise<void> {
  const outputPath = join(outputDir, "index.html");
  const templatePath = join(templateDir, "index.ejs");

  let html = "";
  await ejs.renderFile(templatePath, rendererData, async (err: any, str) => {
    console.log(err);
    html = str;
  });
  await writeFile(outputPath, html);
}

export async function generateSite(
  postsDir: string,
  outputDir: string,
  posts: Post[]
): Promise<void> {
  const html = "";
  const renderPath = join(outputDir, "index.html");
  const templatePath = join(templateDir, "index.ejs");

  let postsData = [];
  postsData = posts.map((post) => {
    const res: PostData = {
      fileName: post.fileName,
      title: post.title,
      link: resolve(domain, post.fileName),
      createdTime: post.createdTime,
      modifiedTime: post.modifiedTime,
    };
    return res;
  });

  const rendererData: RendererData = {
    posts: postsData,
  };

  // TODO: Get CSS ready
  generateIndex(postsDir, outputDir, rendererData);

  // TODO: Posts -> /build/posts/xxx.html (will add folder support in the future)
}
