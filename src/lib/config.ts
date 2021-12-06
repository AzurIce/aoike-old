export interface AoikeConfig {
  theme: Theme;
}

export interface SiteConfig {
  domain: string;
}

export class Theme {
  dir: string;
  // templatesDir: string;
  // assetsDir: string;
  constructor(themeDir: string) {
    this.dir = themeDir;
    // this.templatesDir = join(this.dir, "templates");
    // this.assetsDir = join(this.dir, "assets");
  }
}
