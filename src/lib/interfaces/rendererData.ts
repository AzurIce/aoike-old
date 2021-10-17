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
  domain: string;
}

export interface RendererData {
  posts: PostData[];
  domain: string;
}
