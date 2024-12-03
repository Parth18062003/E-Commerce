import { Metadata } from "next";
import Blog from "@/components/blog/Blog";

export const metadata: Metadata ={
  title: 'HH Blogs',
  description: 'Discover the latest trends, styling tips, and stories from the world of streetwear and sneaker culture.',
}

export default function BlogPage() {
  return (
    <Blog />
    );
}