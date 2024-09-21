import { SignInForm } from '@/components/SignInForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata ={
  title: 'HH Sign In',
  description: 'Sign in to Hype House'
}

const SignInPage = () => {
  return (
    <><SignInForm /></>
  )
}

export default SignInPage