"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Mail, Phone, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const mockUsers = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    status: "active",
    type: "seller",
    registrationDate: "2024-01-15",
    totalProducts: 12,
    totalOrders: 8,
    isReferrer: true,
  },
  {
    id: "2",
    name: "Meera Patel",
    email: "meera@example.com",
    phone: "+91 87654 32109",
    status: "active",
    type: "buyer",
    registrationDate: "2024-01-20",
    totalProducts: 0,
    totalOrders: 15,
    isReferrer: false,
  },
  {
    id: "3",
    name: "Anita Singh",
    email: "anita@example.com",
    phone: "+91 76543 21098",
    status: "inactive",
    type: "seller",
    registrationDate: "2024-01-10",
    totalProducts: 5,
    totalOrders: 3,
    isReferrer: true,
  },
]

export function UsersTable() {
  const [users] = useState(mockUsers)

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>All Users</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search users..." className="pl-10 w-full sm:w-64" />
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-medium text-gray-900">User</TableHead>
                <TableHead className="font-medium text-gray-900 hidden sm:table-cell">Contact</TableHead>
                <TableHead className="font-medium text-gray-900 hidden md:table-cell">Status</TableHead>
                <TableHead className="font-medium text-gray-900 hidden md:table-cell">Type</TableHead>
                <TableHead className="font-medium text-gray-900 hidden lg:table-cell">Products</TableHead>
                <TableHead className="font-medium text-gray-900 hidden lg:table-cell">Orders</TableHead>
                <TableHead className="font-medium text-gray-900 hidden lg:table-cell">Referrer</TableHead>
                <TableHead className="font-medium text-gray-900 hidden md:table-cell">Registration</TableHead>
                <TableHead className="font-medium text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 sm:hidden">{user.email}</div>
                      <div className="text-xs text-gray-500 md:hidden sm:block">
                        {user.status === "active" ? "Active" : "Inactive"} • {user.type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Mail className="h-4 w-4" />
                      <Phone className="h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="secondary"
                      className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={
                        user.type === "seller" ? "border-blue-200 text-blue-700" : "border-purple-200 text-purple-700"
                      }
                    >
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium hidden lg:table-cell">{user.totalProducts}</TableCell>
                  <TableCell className="font-medium hidden lg:table-cell">{user.totalOrders}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant="secondary"
                      className={user.isReferrer ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}
                    >
                      {user.isReferrer ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 hidden md:table-cell">{user.registrationDate}</TableCell>
                  <TableCell>
                    <Link href={`/users/${user.id}`}>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
