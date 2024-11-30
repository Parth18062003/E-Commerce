export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "full-time" | "part-time" | "contract";
    experience: string;
    description: string;
    requirements: string[];
    posted: string;
  }
  
  export interface Department {
    id: string;
    name: string;
    description: string;
    icon: string;
  }