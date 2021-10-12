export interface PostData {
  fileName: string;
  title: string;
  link: string;
  createdTime: string;
  modifiedTime: string;
}
export interface RendererData {
  posts: PostData[];
}
