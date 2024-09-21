import { SignUpForm } from '@/components/SignUpForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata ={
  title: 'HH Sign Up',
  description: 'Sign up to Hype House'
}

const SignUpPage = () => {
  return (
    <><SignUpForm /></>
  )
}

export default SignUpPage