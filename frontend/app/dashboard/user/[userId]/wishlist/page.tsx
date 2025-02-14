"use client";

import WishList from '@/components/WishList/WishList'
import { useParams } from 'next/navigation'
import React from 'react'

const WishListPage = () => {
  const { userId } = useParams() as { userId: string }
  return (
    <div><WishList userId={userId} /></div>
  )
}

export default WishListPage