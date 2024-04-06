interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
  thumb: string;
}

interface PostComment {
  id?: number;
  postid: number;
  commentby: number;
  comment: string;
  date: Date;
}

interface Post {
  id: number;
  title: string;
  postby: number;
  description: string;
  author: string;
  type: string;
  category: string;
  thumbimage: string;
  content: string;
  date: Date;
  reference: string;
  reactcount: number;
  commentcount: number;
  contentfilelink: string;
}

interface PostReact {
  id: number;
  postid: number;
  reactby: number;
}

interface Saved {
  id: number;
  postid: number;
  savedby: number;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  username: string;
  password: string;
  provider: string;
  newsletter: boolean;
  thumb: string;
}
