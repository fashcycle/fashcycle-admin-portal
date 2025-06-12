"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Package,
  User,
  Calendar,
  IndianRupee,
  Tag,
  MessageSquare,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductDetailViewProps {
  productId: string
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [showMessageDialog, setShowMessageDialog] = useState(false)

  const [product, setProduct] = useState({
    id: productId,
    name: "Red Anarkali Suit",
    category: "Anarkali",
    type: "rent",
    price: 2500,
    status: "active",
    seller: "Priya Sharma",
    sellerId: "1",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    description:
      "Beautiful red anarkali suit perfect for weddings and special occasions. Made with premium silk fabric and intricate embroidery work.",
    listedDate: "2024-01-15",
    size: "M",
    color: "Red",
    fabric: "Silk",
    occasion: "Wedding",
    brand: "Designer Collection",
    condition: "Excellent",
    rentalDuration: "3 days",
  })

  const handleStatusUpdate = (newStatus: string) => {
    if (newStatus === "query_raised" || newStatus === "rejected") {
      setShowMessageDialog(true)
    } else {
      setProduct({ ...product, status: newStatus })
    }
  }

  const handleSendMessage = () => {
    setProduct({ ...product, status: "query_raised" })
    setShowMessageDialog(false)
    setStatusMessage("")
    // API call to send message to user
  }

  const handleSaveChanges = () => {
    setIsEditing(false)
    // API call to update product
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className={isEditing ? "" : "bg-blue-600 hover:bg-blue-700"}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit Product"}
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Images */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                <Image src={product.images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Product Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={product.category}
                      onValueChange={(value) => setProduct({ ...product, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lehenga">Lehenga</SelectItem>
                        <SelectItem value="Anarkali">Anarkali</SelectItem>
                        <SelectItem value="Sharara">Sharara</SelectItem>
                        <SelectItem value="Saree">Saree</SelectItem>
                        <SelectItem value="Suit">Suit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={product.size}
                      onChange={(e) => setProduct({ ...product, size: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={product.color}
                      onChange={(e) => setProduct({ ...product, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fabric">Fabric</Label>
                    <Input
                      id="fabric"
                      value={product.fabric}
                      onChange={(e) => setProduct({ ...product, fabric: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {product.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          product.type === "rent" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                        }
                      >
                        {product.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : product.status === "query_raised"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {product.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-2xl font-bold text-green-600">
                      <IndianRupee className="h-6 w-6" />
                      {product.price.toLocaleString()}
                    </div>
                    {product.type === "rent" && <p className="text-sm text-gray-500">for {product.rentalDuration}</p>}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Seller:</span>
                      <Link href={`/users/${product.sellerId}`} className="text-blue-600 hover:underline">
                        {product.seller}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Listed:</span>
                      <span>{product.listedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Size:</span>
                      <span>{product.size}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Color:</span>
                      <span>{product.color}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Fabric:</span>
                      <span>{product.fabric}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Condition:</span>
                      <span>{product.condition}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Management */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle>Status Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="status">Update Product Status</Label>
              <Select value={product.status} onValueChange={handleStatusUpdate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="query_raised">Query Raised</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message to Seller</DialogTitle>
                    <DialogDescription>
                      Send a message to {product.seller} regarding {product.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message..."
                        value={statusMessage}
                        onChange={(e) => setStatusMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
