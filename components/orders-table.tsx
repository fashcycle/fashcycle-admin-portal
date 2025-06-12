"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import Link from "next/link"

const mockOrders = [
  {
    id: "ORD001",
    productName: "Blue Lehenga Set",
    buyer: "Meera Patel",
    seller: "Priya Sharma",
    date: "2024-01-20",
    amount: 15000,
    paymentStatus: "completed",
    deliveryStatus: "delivered",
    type: "sell",
  },
  {
    id: "ORD002",
    productName: "Red Anarkali Suit",
    buyer: "Anita Singh",
    seller: "Meera Patel",
    date: "2024-01-18",
    amount: 2500,
    paymentStatus: "completed",
    deliveryStatus: "in_transit",
    type: "rent",
  },
  {
    id: "ORD003",
    productName: "Green Sharara Set",
    buyer: "Priya Sharma",
    seller: "Anita Singh",
    date: "2024-01-16",
    amount: 3000,
    paymentStatus: "pending",
    deliveryStatus: "processing",
    type: "rent",
  },
]

export function OrdersTable() {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="hidden sm:table-cell">Buyer</TableHead>
              <TableHead className="hidden md:table-cell">Seller</TableHead>
              <TableHead className="hidden lg:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Payment</TableHead>
              <TableHead className="hidden sm:table-cell">Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div>{order.productName}</div>
                    <div className="sm:hidden text-xs text-gray-500">
                      {order.buyer} • {order.date}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{order.buyer}</TableCell>
                <TableCell className="hidden md:table-cell">{order.seller}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant={order.type === "rent" ? "default" : "secondary"}>{order.type}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"}>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={order.deliveryStatus === "delivered" ? "default" : "secondary"}>
                    {order.deliveryStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="hover:bg-blue-100 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
