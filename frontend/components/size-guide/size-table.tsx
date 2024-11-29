"use client";

import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SizeTableProps {
  data: SizeMapping[];
  type: "shoes" | "apparel";
}

export interface SizeMapping {
  id: string;
  uk: string;
  us: string;
  eu: string;
  cm: string;
}

export interface SizeGuideData {
  shoes: {
    men: SizeMapping[];
    women: SizeMapping[];
  };
  apparel: {
    men: SizeMapping[];
    women: SizeMapping[];
  };
}

export function SizeTable({ data, type }: SizeTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border bg-card text-zinc-700"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UK</TableHead>
            <TableHead>US</TableHead>
            <TableHead>EU</TableHead>
            <TableHead>
              {type === "shoes" ? "Foot Length (cm)" : "Chest (cm)"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((size, index) => (
            <TableRow key={`${type} + ${size.id}`}>
              <TableCell >{size.uk}</TableCell>
              <TableCell>{size.us}</TableCell>
              <TableCell>{size.eu}</TableCell>
              <TableCell>{size.cm}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
