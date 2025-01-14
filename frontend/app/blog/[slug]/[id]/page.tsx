import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, FacebookIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { blogPosts } from "@/components/blog/data";
import Image from "next/image";
import { BlogPost } from "@/components/blog/types";
import Link from "next/link";
import { LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface BlogPageProps {
  params: {
    id: string;
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { id } = await params;
    const post = blogPosts.find((post) => post.id === id);
  
    if (!post) {
      notFound();
    }
  
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 bg-zinc-100">
        {/* Blog Details */}
        <article className="space-y-8">
          {/* Blog Title */}
          <h1 className="text-4xl lg:text-8xl font-bold text-zinc-900 leading-tight">
            {post.title}
          </h1>
  
          <div className="flex items-center space-x-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              className="w-14 h-14 rounded-full object-cover"
              width={256}
              height={256}
              priority
            />
            <p className="text-2xl font-medium text-zinc-700">
              {post.author.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Category Badge */}
            <Badge variant="outline" className="text-sm font-medium text-black">
              {post.category}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <time dateTime={post.date}>{post.date}</time>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
          </div>
  
          {/* Blog Image */}
          <div className="relative h-[44rem] mb-8">
            <Image
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
  
          {/* Blog Excerpt */}
          <p className="text-lg text-zinc-600 leading-relaxed">{post.excerpt}</p>
        </article>
  
        {/* Blog Content */}
        {post.content && (
          <div className="prose prose-lg text-zinc-700 mt-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
  
        {/* Social Sharing */}
        <SocialSharing title={post.title} url={`https://yourwebsite.com/blog/${post.id}`} />
  
        {/* Author Bio */}
        <AuthorBio author={post.author} />
  
        {/* Comments Section */}
        <CommentsSection postId={post.id} />
  
        {/* Related Posts */}
        <RelatedPosts currentPost={post} />
      </div>
    );
  }


function RelatedPosts({ currentPost }: { currentPost: BlogPost
 }) {
    const relatedPosts = blogPosts.filter(
      (post) => post.category === currentPost.category && post.id !== currentPost.id
    );
  
    if (relatedPosts.length === 0) return null;
  
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  fill
                />
              </div>
              <h3 className="text-xl font-semibold mt-4 text-zinc-900 group-hover:underline">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-500 mt-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  function SocialSharing({ title, url }: { title: string; url: string }) {
    const shareText = `Check out this blog post: ${title}`;
  
    return (
      <div className="mt-8 flex items-center gap-4">
        <p className="text-sm text-zinc-600">Share this post:</p>
        <Button variant="outline" size="sm" className="text-black">
          <Link
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <TwitterIcon className="w-4 h-4" />
            Twitter
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-black">
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FacebookIcon className="w-4 h-4" />
            Facebook
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-black">
          <Link
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <LinkedinIcon className="w-4 h-4" />
            LinkedIn
          </Link>
        </Button>
      </div>
    );
  }

  function AuthorBio({ author }: { author: BlogPost["author"] }) {
    return (
      <div className="mt-16 border-t border-zinc-200 pt-8">
        <div className="flex items-center gap-4">
          <Image
            src={author.avatar}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
            width={128}
            height={128}
          />
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">{author.name}</h3>
            <p className="text-sm text-zinc-600">
              {author.name} is a passionate writer and fashion enthusiast with a
              keen eye for trends and sustainability.
            </p>
          </div>
        </div>
      </div>
    );
  }


  function CommentsSection({ postId }: { postId: string }) {
    // Fetch comments from an API or use a static list
    const comments = [
      { id: "1", author: "John Doe", text: "Great article! Loved the insights." },
      { id: "2", author: "Jane Smith", text: "Very informative. Thanks for sharing!" },
    ];
  
    return (
      <div className="mt-16 border-t border-zinc-200 pt-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Comments</h2>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-zinc-200 pb-4">
              <p className="text-sm font-semibold text-zinc-900">{comment.author}</p>
              <p className="text-sm text-zinc-600 mt-1">{comment.text}</p>
            </div>
          ))}
        </div>
        <form className="mt-6">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 text-black"
            rows={4}
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }