import React from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Navbar />
        <main className="container mx-auto px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
