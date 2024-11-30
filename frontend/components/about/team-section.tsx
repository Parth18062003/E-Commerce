"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Twitter, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const team = [
  {
    name: "Sarah Chen",
    title: "Founder & CEO",
    bio: "Former pro athlete turned entrepreneur with a passion for streetwear culture and community building.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    social: {
      twitter: "#",
      linkedin: "#",
      website: "#"
    }
  },
  {
    name: "Marcus Rodriguez",
    title: "Creative Director",
    bio: "Award-winning designer with 15+ years of experience in fashion and brand development.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Aisha Patel",
    title: "Head of Community",
    bio: "Community builder and cultural curator focused on creating authentic connections through style.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    social: {
      twitter: "#",
      linkedin: "#",
      website: "#"
    }
  }
];

export function TeamSection() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals driving innovation and creativity at HypeHouse
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden"
            >
              <div className="relative h-[300px]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-zinc-600 text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.title}</p>
                <p className="text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex gap-2 text-zinc-500">
                  {member.social.twitter && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {member.social.linkedin && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {member.social.website && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}