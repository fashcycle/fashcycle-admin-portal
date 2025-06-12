"use client"

import { Bell, Search, Menu, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"

export function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Menu toggle and Search */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search or type command..."
                className="pl-10 w-64 md:w-96 bg-gray-50 border-gray-200 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden md:block">
                <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded">⌘K</kbd>
              </div>
            </div>

            {/* Mobile Search Button */}
            <Button variant="ghost" size="sm" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Right side - Actions and Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Dark mode toggle - Hidden on mobile */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Moon className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@fashcycle.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="md:hidden">Dark Mode</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
