import { SizeGuide } from '@/components/size-guide/size-guide'
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata ={
  title: 'HH Size Guide',
  description: 'Find your perfect fit with our comprehensive size guide',
}

const SizeGuidePage = () => {
  return (
    <main className="min-h-screen py-16 px-4 text-zinc-800">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
        <p className="text-muted-foreground">
          Find your perfect fit with our comprehensive size guide
        </p>
      </div>
      <SizeGuide />
    </div>
  </main>
  )
}

export default SizeGuidePage