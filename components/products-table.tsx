"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const mockProducts = [
  {
    id: "1",
    name: "Red Anarkali Suit",
    category: "Anarkali",
    type: "rent",
    price: 2500,
    status: "active",
    seller: "Priya Sharma",
    images: ["/placeholder.svg"],
    listedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Blue Lehenga Set",
    category: "Lehenga",
    type: "sell",
    price: 15000,
    status: "pending",
    seller: "Meera Patel",
    images: ["/placeholder.svg"],
    listedDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Green Sharara Set",
    category: "Sharara",
    type: "rent",
    price: 3000,
    status: "query_raised",
    seller: "Anita Singh",
    images: ["/placeholder.svg"],
    listedDate: "2024-01-18",
  },
]

export function ProductsTable() {
  const [products] = useState(mockProducts)

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Seller</TableHead>
              <TableHead className="hidden lg:table-cell">Listed Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 hidden sm:block">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="sm:hidden text-xs text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={product.type === "rent" ? "default" : "secondary"}>{product.type}</Badge>
                </TableCell>
                <TableCell>₹{product.price.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell">
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
                </TableCell>
                <TableCell className="hidden lg:table-cell">{product.seller}</TableCell>
                <TableCell className="hidden lg:table-cell">{product.listedDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}`}>
                      <Button variant="ghost" size="sm" className="hover:bg-orange-100 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="hover:bg-blue-100 transition-colors">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
