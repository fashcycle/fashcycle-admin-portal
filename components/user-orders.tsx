"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserOrdersProps {
  userId: string
}

const mockOrders = [
  {
    id: "ORD001",
    productName: "Blue Lehenga Set",
    type: "placed",
    date: "2024-01-20",
    amount: 15000,
    paymentStatus: "completed",
    deliveryStatus: "delivered",
    otherUser: "Meera Patel",
  },
  {
    id: "ORD002",
    productName: "Red Anarkali Suit",
    type: "received",
    date: "2024-01-18",
    amount: 2500,
    paymentStatus: "completed",
    deliveryStatus: "in_transit",
    otherUser: "Anita Singh",
  },
]

export function UserOrders({ userId }: UserOrdersProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Other User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>
                    <Badge variant={order.type === "placed" ? "default" : "secondary"}>{order.type}</Badge>
                  </TableCell>
                  <TableCell>{order.otherUser}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "completed" ? "default" : "secondary"}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.deliveryStatus === "delivered" ? "default" : "secondary"}>
                      {order.deliveryStatus.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
