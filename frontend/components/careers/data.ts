import { Job, Department } from "./types";

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    department: "Design",
    location: "Los Angeles, CA",
    type: "full-time",
    experience: "5+ years",
    description: "Join our creative team to shape the future of streetwear retail experiences.",
    requirements: [
      "Strong portfolio demonstrating UI/UX expertise",
      "Experience with design systems and component libraries",
      "Knowledge of fashion and streetwear culture",
      "Excellent communication and collaboration skills"
    ],
    posted: "2024-03-15"
  },
  {
    id: "2",
    title: "Retail Store Manager",
    department: "Operations",
    location: "New York, NY",
    type: "full-time",
    experience: "3+ years",
    description: "Lead our flagship store operations and create exceptional customer experiences.",
    requirements: [
      "Previous retail management experience",
      "Strong leadership and team building skills",
      "Passion for streetwear and sneaker culture",
      "Experience with inventory management systems"
    ],
    posted: "2024-03-10"
  },
  {
    id: "3",
    title: "Social Media Manager",
    department: "Marketing",
    location: "Remote",
    type: "full-time",
    experience: "2+ years",
    description: "Drive our social media strategy and engage with our community.",
    requirements: [
      "Proven track record in social media management",
      "Understanding of current trends and platforms",
      "Content creation and editing skills",
      "Analytics and reporting experience"
    ],
    posted: "2024-03-08"
  }
];

export const departments: Department[] = [
  {
    id: "design",
    name: "Design",
    description: "Shape the future of streetwear through innovative design",
    icon: "Palette"
  },
  {
    id: "operations",
    name: "Operations",
    description: "Keep our retail and online presence running smoothly",
    icon: "Settings"
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Tell our story and connect with our community",
    icon: "Megaphone"
  },
  {
    id: "tech",
    name: "Technology",
    description: "Build the digital future of fashion retail",
    icon: "Code"
  }
];