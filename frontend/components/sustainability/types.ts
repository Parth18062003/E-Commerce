export interface Initiative {
    id: string;
    title: string;
    description: string;
    icon: any;
    progress: number;
    target: string;
  }
  
  export interface Material {
    id: string;
    name: string;
    description: string;
    impact: string;
    image: string;
    percentage: number;
  }
  
  export interface Certification {
    id: string;
    name: string;
    description: string;
    image: string;
    year: number;
  }