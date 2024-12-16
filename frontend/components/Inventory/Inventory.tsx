"use client";

import React, { useState } from 'react'
import { AllInventoryHeader } from './all-inventory-header';
import { AllInventorySummary } from './all-inventory-summary';
import { AllInventoryTable } from './AllInventory-table';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-black">
        Inventory Management
      </h1>
      <div className="space-y-8">
        <AllInventoryHeader onSearch={setSearchTerm} />
        <AllInventorySummary />
        <AllInventoryTable searchTerm={searchTerm} />
      </div>
    </main>
  )
}

export default Inventory