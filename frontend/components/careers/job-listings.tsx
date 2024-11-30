"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Clock, Briefcase } from "lucide-react";
import { jobs, departments } from "./data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function JobListings() {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <section className="py-20 px-4" id="jobs">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-primary text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find your perfect role and help us shape the future of fashion
          </p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-zinc-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-zinc-500">
            <Button
              variant={selectedDepartment === null ? "default" : "outline"}
              onClick={() => setSelectedDepartment(null)}
            >
              All Departments
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept.id}
                variant={
                  selectedDepartment === dept.name ? "default" : "outline"
                }
                onClick={() => setSelectedDepartment(dept.name)}
              >
                {dept.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Posted {(job.posted)}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge>{job.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{job.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Requirements:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="text-muted-foreground">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="mt-6">Apply Now</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              No positions found matching your criteria
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
