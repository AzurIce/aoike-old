export interface PostData {
  fileName: string;
  title: string;
  link: string;
  createdTime: string;
  modifiedTime: string;
  content: string;
}
export interface PostRendererData {
  post: PostData;
  siteName: string;
  domain: string;
}

export interface IndexRendererData extends RendererData {
  siteName: string;
}

export interface RendererData {
  posts: PostData[];
  domain: string;
}
