"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <Badge className="absolute top-4 left-4">{post.category}</Badge>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-zinc-600">{post.author.name}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-zinc-800">
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4">{post.excerpt}</p>

        <Button variant="outline" className="group/btn text-zinc-600">
          Read More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.article>
  );
}