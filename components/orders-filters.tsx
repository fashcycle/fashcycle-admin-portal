"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar } from "lucide-react"

export function OrdersFilters() {
  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search orders..." className="pl-10" />
      </div>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Delivery Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Deliveries</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="in_transit">In Transit</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="returned">Returned</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline">
        <Calendar className="h-4 w-4 mr-2" />
        Date Range
      </Button>

      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        More Filters
      </Button>
    </div>
  )
}
