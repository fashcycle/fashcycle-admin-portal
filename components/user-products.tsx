"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, MessageSquare } from "lucide-react"
import Image from "next/image"

interface UserProductsProps {
  userId: string
}

const mockProducts = [
  {
    id: "1",
    name: "Red Anarkali Suit",
    category: "Anarkali",
    type: "rent",
    price: 2500,
    status: "active",
    images: ["/placeholder.svg"],
    description: "Beautiful red anarkali suit perfect for weddings",
  },
  {
    id: "2",
    name: "Blue Lehenga Set",
    category: "Lehenga",
    type: "sell",
    price: 15000,
    status: "pending",
    images: ["/placeholder.svg"],
    description: "Elegant blue lehenga with intricate embroidery",
  },
  {
    id: "3",
    name: "Green Sharara Set",
    category: "Sharara",
    type: "rent",
    price: 3000,
    status: "query_raised",
    images: ["/placeholder.svg"],
    description: "Traditional green sharara set",
  },
]

export function UserProducts({ userId }: UserProductsProps) {
  const [products] = useState(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [statusMessage, setStatusMessage] = useState("")

  const handleStatusUpdate = (productId: string, newStatus: string) => {
    console.log(`Updating product ${productId} to status ${newStatus}`)
    if (newStatus === "query_raised" || newStatus === "rejected") {
      // Show message dialog
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="aspect-square relative mb-2">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant={product.type === "rent" ? "default" : "secondary"}>{product.type}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                <Badge
                  variant={
                    product.status === "active"
                      ? "default"
                      : product.status === "pending"
                        ? "secondary"
                        : product.status === "query_raised"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {product.status.replace("_", " ")}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

              <div className="space-y-2">
                <Label htmlFor={`status-${product.id}`}>Update Status</Label>
                <Select onValueChange={(value) => handleStatusUpdate(product.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="query_raised">Query Raised</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to User</DialogTitle>
                      <DialogDescription>Send a message regarding {product.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Enter your message..."
                          value={statusMessage}
                          onChange={(e) => setStatusMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Send Message</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
