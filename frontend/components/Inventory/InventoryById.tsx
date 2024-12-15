"use client";

import React, { useState } from "react";
import { InventoryHeader } from "./inventory-header";
import { InventorySummary } from "./inventory-summary";
import { InventoryTable } from "./inventory-table";

const InventoryById = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Inventory Management
      </h1>
      <div className="space-y-8">
        <InventoryHeader onSearch={setSearchTerm} />
        <InventorySummary />
        <InventoryTable searchTerm={searchTerm} />
      </div>
    </main>
  );
};

export default InventoryById;
