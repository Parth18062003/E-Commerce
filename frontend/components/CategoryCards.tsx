// components/CategoryCards.tsx
"use client"

import Image from 'next/image';
import { TransitionLink } from './utils/TransitionLink';
import React, { useState } from 'react';

interface Category {
  title: string;
  filter: string;
  imageUrl: string;
}

interface CategoryCardsProps {
  categories: Category[];
}

const CategoryCard: React.FC<{ category: Category; isHovered: boolean; isCurrent: boolean; onHover: () => void; onLeave: () => void; }> = ({ category, isHovered, isCurrent, onHover, onLeave }) => {
  const link = `/products/filter/${category.filter}?${category.filter}=${category.title.toLowerCase()}`;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative transition-transform duration-300 ${isCurrent ? 'scale-110 z-10' : ''} ${isHovered ? 'filter blur-sm' : ''}`}
    >
      <TransitionLink href={link}>
        <div className="flex flex-col items-center justify-center overflow-hidden bg-white shadow-md rounded-lg w-full">
          <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full">
            {category.title}
          </div>
          <Image
            src={category.imageUrl}
            alt={category.title}
            width={512}
            height={512}
            className="object-cover w-full h-[35rem] rounded-lg"
            loading='lazy'
          />
        </div>
      </TransitionLink>
    </div>
  );
};

const CategoryCards: React.FC<CategoryCardsProps> = ({ categories }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-4">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.title}
          category={category}
          isHovered={hoveredIndex !== null && hoveredIndex !== index}
          isCurrent={hoveredIndex === index}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}
    </div>
  );
};

export default CategoryCards;
