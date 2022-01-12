import { readdirSync, statSync } from "fs-extra";
import { join, extname } from "path";

export function getMdFiles(dir: string): string[] {
  let filepathList: string[] = [];
  readdirSync(dir).forEach((name) => {
    // console.log(name);
    const filepath = join(dir, name);
    // console.log(filepath);
    if (!statSync(filepath).isFile() && name[0] != "." && name[0] != "_") {
      filepathList = filepathList.concat(getMdFiles(filepath));
    } else if (extname(filepath) == ".md" && name[0] != "." && name[0] != "_") {
      filepathList.push(filepath);
    }
  });
  return filepathList;
}
