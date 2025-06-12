"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  UserPlus,
  BarChart3,
  Settings,
  MessageSquare,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Referrals", href: "/referrals", icon: UserPlus },
  { name: "Analytics", href: "/analytics", icon: BarChart3, badge: "PRO" },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Mobile sidebar
  // Use this approach that always renders both versions but controls visibility with CSS:
  return (
    <>
      {/* Mobile Sidebar Overlay - Only visible when isOpen is true */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      />

      {/* Mobile Sidebar - Always rendered but positioned off-screen when not open */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Fashcycle</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Label */}
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MENU</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500",
                    )}
                  />
                  <span className="ml-3">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Support Section */}
          <div className="px-3 py-2 border-t border-gray-200">
            <div className="px-3 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SUPPORT</span>
            </div>
            <Link
              href="/chat"
              onClick={onClose}
              className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
            >
              <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              <span className="ml-3">Chat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Fashcycle</span>
          </div>
        </div>

        {/* Menu Label */}
        <div className="px-4 py-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MENU</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500",
                  )}
                />
                <span className="ml-3">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Support Section */}
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="px-3 py-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SUPPORT</span>
          </div>
          <Link
            href="/chat"
            className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900"
          >
            <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            <span className="ml-3">Chat</span>
          </Link>
        </div>
      </div>
    </>
  )
}
