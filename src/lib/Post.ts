import { readFile } from "fs/promises";

export default class Post {
  postsDir: string;
  title: string;
  // category: string[];
  constructor(postsDir: string, title: string) {
    this.postsDir = postsDir;
    this.title = title;
  }

  async getContent(): Promise<any> {
    // readFile()
  }
}
