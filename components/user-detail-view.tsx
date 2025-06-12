"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  ShoppingCart,
  Edit,
  Save,
  X,
  ArrowLeft,
  User,
  Home,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { UserProducts } from "@/components/user-products"
import { UserOrders } from "@/components/user-orders"

interface UserDetailViewProps {
  userId: string
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  // Mock user data
  const [user, setUser] = useState({
    id: userId,
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    address: "123 Fashion Street, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    status: "active",
    type: "seller",
    registrationDate: "2024-01-15",
    totalProducts: 12,
    totalOrders: 8,
    isReferrer: true,
    referralCode: "PRIYA123",
    totalReferrals: 5,
    bio: "Fashion enthusiast and designer with 5+ years of experience in traditional Indian wear.",
  })

  const handleProfileUpdate = () => {
    setIsEditingProfile(false)
    // API call to update profile
  }

  const handleAddressUpdate = () => {
    setIsEditingAddress(false)
    // API call to update address
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </div>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                {isEditingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
                    </div>
                    <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          variant="secondary"
                          className={
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status}
                        </Badge>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {user.type}
                        </Badge>
                        {user.isReferrer && <Badge className="bg-orange-100 text-orange-800">Referrer</Badge>}
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>Joined {user.registrationDate}</span>
                      </div>
                    </div>

                    <p className="text-gray-600">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Products Listed</span>
              </div>
              <span className="font-bold text-blue-700">{user.totalProducts}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Orders Placed</span>
              </div>
              <span className="font-bold text-green-700">{user.totalOrders}</span>
            </div>

            {user.isReferrer && (
              <>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Referral Code</span>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {user.referralCode}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Total Referrals</span>
                  <span className="font-bold text-purple-700">{user.totalReferrals}</span>
                </div>
              </>
            )}

            <div className="pt-4 space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                Suspend Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Address Card */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Address Information</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingAddress(!isEditingAddress)}>
              {isEditingAddress ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isEditingAddress ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={user.address}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={user.city} onChange={(e) => setUser({ ...user, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={user.state} onChange={(e) => setUser({ ...user, state: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={user.pincode}
                  onChange={(e) => setUser({ ...user, pincode: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Button onClick={handleAddressUpdate} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Address
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">{user.address}</p>
                <p className="text-gray-600">
                  {user.city}, {user.state} - {user.pincode}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Products and Orders */}
      <Card className="border border-gray-200">
        <Tabs defaultValue="products" className="w-full">
          <CardHeader className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products Listed</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-6">
            <TabsContent value="products" className="space-y-4 mt-0">
              <UserProducts userId={userId} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 mt-0">
              <UserOrders userId={userId} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
