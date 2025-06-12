"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, Package, ShoppingCart } from "lucide-react"

interface UserProfileProps {
  userId: string
}

export function UserProfile({ userId }: UserProfileProps) {
  // Mock user data - in real app, fetch based on userId
  const user = {
    id: userId,
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra",
    status: "active",
    type: "seller",
    registrationDate: "2024-01-15",
    totalProducts: 12,
    totalOrders: 8,
    isReferrer: true,
    referralCode: "PRIYA123",
    totalReferrals: 5,
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  <Badge variant={user.type === "seller" ? "outline" : "secondary"}>{user.type}</Badge>
                  {user.isReferrer && <Badge variant="default">Referrer</Badge>}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {user.registrationDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Products Listed</span>
            </div>
            <span className="font-bold">{user.totalProducts}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Orders Placed</span>
            </div>
            <span className="font-bold">{user.totalOrders}</span>
          </div>

          {user.isReferrer && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">Referral Code</span>
                <Badge variant="outline">{user.referralCode}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Total Referrals</span>
                <span className="font-bold">{user.totalReferrals}</span>
              </div>
            </>
          )}

          <div className="pt-4 space-y-2">
            <Button className="w-full" variant="outline">
              Send Message
            </Button>
            <Button className="w-full" variant="outline">
              Suspend Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
