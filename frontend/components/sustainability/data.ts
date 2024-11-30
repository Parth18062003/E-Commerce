import { Droplet, Leaf, Package, Recycle } from "lucide-react";
import { Initiative, Material, Certification } from "./types";

export const initiatives: Initiative[] = [
  {
    id: "1",
    title: "Carbon Neutral",
    description: "Reducing our carbon footprint through renewable energy and offset programs",
    icon: Leaf,
    progress: 75,
    target: "2025"
  },
  {
    id: "2",
    title: "Zero Waste",
    description: "Eliminating waste across our operations and supply chain",
    icon: Recycle,
    progress: 60,
    target: "2026"
  },
  {
    id: "3",
    title: "Water Conservation",
    description: "Implementing water-saving technologies in production",
    icon: Droplet,
    progress: 45,
    target: "2024"
  },
  {
    id: "4",
    title: "Sustainable Packaging",
    description: "Using 100% recycled and recyclable materials",
    icon: Package,
    progress: 85,
    target: "2023"
  }
];

export const materials: Material[] = [
  {
    id: "1",
    name: "Recycled Polyester",
    description: "Made from post-consumer plastic bottles",
    impact: "Reduces plastic waste and carbon emissions",
    image: "https://images.unsplash.com/photo-1588803103006-2822e4b2619d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGxhc3RpYyUyMGJvdHRsZXN8ZW58MHx8MHx8fDA%3D",
    percentage: 65
  },
  {
    id: "2",
    name: "Organic Cotton",
    description: "Grown without harmful pesticides",
    impact: "Saves water and protects soil health",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bm8lMjBwZXN0aWNpZGV8ZW58MHx8MHx8fDA%3D",
    percentage: 80
  },
  {
    id: "3",
    name: "Hemp Fiber",
    description: "Sustainable and versatile natural fiber",
    impact: "Requires minimal water and no pesticides",
    image: "https://images.unsplash.com/photo-1548790498-9d72d424f40f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5hcnVyYWwlMjBmaWJlcnxlbnwwfHwwfHx8MA%3D%3D",
    percentage: 40
  }
];

export const certifications: Certification[] = [
  {
    id: "1",
    name: "Global Organic Textile Standard",
    description: "Certified organic textile production",
    image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890",
    year: 2020
  },
  {
    id: "2",
    name: "Fair Trade Certified",
    description: "Ensuring fair labor practices",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6",
    year: 2019
  },
  {
    id: "3",
    name: "B Corp Certification",
    description: "Meeting highest standards of social and environmental performance",
    image: "https://images.unsplash.com/photo-1507369512168-9b7de6ec6be6",
    year: 2021
  }
];