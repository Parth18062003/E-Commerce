import Inventory from '@/components/Inventory/Inventory'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata ={
  title: "HH Inventory",
  description: 'View and manage inventory',
}

const InventoryPage = () => {
  return (
    <Inventory />
  )
}

export default InventoryPage