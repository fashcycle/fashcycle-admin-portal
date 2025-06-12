"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  IndianRupee,
  Truck,
  CreditCard,
  MessageSquare,
  MapPin,
  CheckCircle,
  Clock,
  Package2,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderDetailViewProps {
  orderId: string
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [order, setOrder] = useState({
    id: orderId,
    productName: "Blue Lehenga Set",
    productId: "2",
    productImage: "/placeholder.svg",
    buyer: "Meera Patel",
    buyerId: "2",
    seller: "Priya Sharma",
    sellerId: "1",
    date: "2024-01-20",
    amount: 15000,
    paymentStatus: "completed",
    deliveryStatus: "in_transit",
    type: "sell",
    shippingAddress: "456 Fashion Avenue, Andheri East, Mumbai, Maharashtra - 400069",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-25",
    notes: "Handle with care - delicate embroidery work",
    orderPlaced: "2024-01-20 10:30 AM",
    orderConfirmed: "2024-01-20 11:15 AM",
    shipped: "2024-01-21 02:00 PM",
    outForDelivery: null,
    delivered: null,
  })

  const [adminNotes, setAdminNotes] = useState("")

  const handlePaymentStatusUpdate = (newStatus: string) => {
    setOrder({ ...order, paymentStatus: newStatus })
    // API call to update payment status
  }

  const handleDeliveryStatusUpdate = (newStatus: string) => {
    setOrder({ ...order, deliveryStatus: newStatus })
    // API call to update delivery status
  }

  const handleAddNotes = () => {
    // API call to add admin notes
    setAdminNotes("")
  }

  // Shipping progress steps
  const shippingSteps = [
    {
      id: "placed",
      title: "Order Placed",
      description: "Order has been placed successfully",
      timestamp: order.orderPlaced,
      icon: Package2,
      completed: true,
    },
    {
      id: "confirmed",
      title: "Order Confirmed",
      description: "Seller has confirmed the order",
      timestamp: order.orderConfirmed,
      icon: CheckCircle,
      completed: true,
    },
    {
      id: "shipped",
      title: "Shipped",
      description: "Package has been shipped",
      timestamp: order.shipped,
      icon: Truck,
      completed: order.deliveryStatus !== "processing",
    },
    {
      id: "out_for_delivery",
      title: "Out for Delivery",
      description: "Package is out for delivery",
      timestamp: order.outForDelivery,
      icon: Truck,
      completed: order.deliveryStatus === "delivered" || order.deliveryStatus === "out_for_delivery",
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Package has been delivered",
      timestamp: order.delivered,
      icon: CheckCircle,
      completed: order.deliveryStatus === "delivered",
    },
  ]

  const getCurrentStepIndex = () => {
    switch (order.deliveryStatus) {
      case "processing":
        return 1
      case "shipped":
        return 2
      case "in_transit":
        return 2
      case "out_for_delivery":
        return 3
      case "delivered":
        return 4
      default:
        return 0
    }
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            #{order.id}
          </Badge>
        </div>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Shipping Progress Tracker */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Shipping Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div
              className="absolute left-6 top-0 w-0.5 bg-blue-500 transition-all duration-1000 ease-out"
              style={{ height: `${(currentStep / (shippingSteps.length - 1)) * 100}%` }}
            ></div>

            {/* Steps */}
            <div className="space-y-6">
              {shippingSteps.map((step, index) => (
                <div key={step.id} className="relative flex items-start space-x-4">
                  {/* Step Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-blue-500 border-blue-500 text-white"
                        : index === currentStep
                          ? "bg-white border-blue-500 text-blue-500"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div
                      className={`flex items-center justify-between ${
                        step.completed ? "text-gray-900" : index === currentStep ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div>
                        <h3 className="text-sm font-semibold">{step.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                      {step.timestamp && (
                        <div className="text-xs text-gray-500 text-right">
                          <div>{step.timestamp.split(" ")[0]}</div>
                          <div>
                            {step.timestamp.split(" ")[1]} {step.timestamp.split(" ")[2]}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Current Step Indicator */}
                    {index === currentStep && !step.completed && (
                      <div className="mt-2 flex items-center space-x-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium">In Progress</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Tracking Number</h4>
                  <p className="text-lg font-mono text-gray-700">{order.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-gray-900">Expected Delivery</h4>
                  <p className="text-sm text-gray-600">{order.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Overview */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Order Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Product Info */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={order.productImage || "/placeholder.svg"}
                    alt={order.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{order.productName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={
                        order.type === "rent" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                      }
                    >
                      {order.type}
                    </Badge>
                    <Link href={`/products/${order.productId}`} className="text-blue-600 hover:underline text-sm">
                      View Product
                    </Link>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-green-600 mt-2">
                    <IndianRupee className="h-5 w-5" />
                    {order.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    Buyer
                  </h4>
                  <p className="font-semibold">{order.buyer}</p>
                  <Link href={`/users/${order.buyerId}`} className="text-green-600 hover:underline text-sm">
                    View Profile
                  </Link>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-orange-600" />
                    Seller
                  </h4>
                  <p className="font-semibold">{order.seller}</p>
                  <Link href={`/users/${order.sellerId}`} className="text-orange-600 hover:underline text-sm">
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                  Order Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Placed:</span>
                    <span className="font-medium">{order.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span className="font-medium">{order.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  Shipping Address
                </h4>
                <p className="text-gray-700">{order.shippingAddress}</p>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Management */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Badge
                  variant="secondary"
                  className={
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              <div>
                <Label htmlFor="payment-status">Update Payment Status</Label>
                <Select value={order.paymentStatus} onValueChange={handlePaymentStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Status */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Delivery Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Badge
                  variant="secondary"
                  className={
                    order.deliveryStatus === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.deliveryStatus === "in_transit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {order.deliveryStatus.replace("_", " ")}
                </Badge>
              </div>
              <div>
                <Label htmlFor="delivery-status">Update Delivery Status</Label>
                <Select value={order.deliveryStatus} onValueChange={handleDeliveryStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Admin Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="admin-notes">Add Notes</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add internal notes about this order..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleAddNotes}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!adminNotes.trim()}
              >
                Add Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
