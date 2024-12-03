import PasswordResetForm from '@/components/PasswordResetForm'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata ={
  title: 'HH - Reset Password',
  description: 'Reset your password',
}

const PasswordResetPage = () => {
  return (
    <PasswordResetForm />
  )
}

export default PasswordResetPage