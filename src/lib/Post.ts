// import { readFile } from "fs/promises";
// import { join } from "path";

export interface Post {
  fileDir: string;
  title: string;
  // category: string[];
}

// export default class Post {
//   fileDir: string;
//   fileName: string;
//   // category: string[];
//   constructor(fileDir: string, fileName: string) {
//     this.fileDir = fileDir;
//     this.fileName = fileName;
//   }

//   async getContent(): Promise<any> {
//     const res = await readFile(join(this.fileDir, this.fileName));
//     console.log(res);
//     return res;
//   }
// }
