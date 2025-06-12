import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fashcycle Admin Portal",
  description: "Admin portal for Fashcycle clothing rental and resale platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
