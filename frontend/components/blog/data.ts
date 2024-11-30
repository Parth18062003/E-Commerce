import { BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Evolution of Sneaker Culture",
    excerpt: "From basketball courts to high fashion runways, explore the journey of sneaker culture.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    category: "Culture",
    date: "Mar 15, 2024",
    readTime: "5 min read",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  },
  {
    id: "2",
    title: "Sustainable Fashion: The Future of Streetwear",
    excerpt: "How brands are embracing eco-friendly materials and ethical production.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    category: "Sustainability",
    date: "Mar 12, 2024",
    readTime: "4 min read",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
  },
  {
    id: "3",
    title: "Style Guide: Mixing Vintage and Modern",
    excerpt: "Tips for creating unique outfits by combining classic and contemporary pieces.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    category: "Style",
    date: "Mar 10, 2024",
    readTime: "6 min read",
    author: {
      name: "Marcus Wright",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
  },
];