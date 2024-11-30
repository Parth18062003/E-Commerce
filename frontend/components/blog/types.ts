
export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    author: {
      name: string;
      avatar: string;
    };
  }