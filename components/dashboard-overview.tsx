"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingCart, UserPlus, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const monthlyData = [
  { month: "Jan", sales: 4000, orders: 240 },
  { month: "Feb", sales: 3000, orders: 139 },
  { month: "Mar", sales: 2000, orders: 980 },
  { month: "Apr", sales: 2780, orders: 390 },
  { month: "May", sales: 1890, orders: 480 },
  { month: "Jun", sales: 2390, orders: 380 },
]

const categoryData = [
  { name: "Lehenga", value: 35, color: "#3B82F6" },
  { name: "Anarkali", value: 25, color: "#10B981" },
  { name: "Saree", value: 20, color: "#F59E0B" },
  { name: "Sharara", value: 15, color: "#EF4444" },
  { name: "Others", value: 5, color: "#8B5CF6" },
]

const recentOrders = [
  {
    id: "ORD001",
    product: "Blue Lehenga Set",
    customer: "Priya Sharma",
    amount: 15000,
    status: "delivered",
    image: "/placeholder.svg",
  },
  {
    id: "ORD002",
    product: "Red Anarkali Suit",
    customer: "Meera Patel",
    amount: 2500,
    status: "pending",
    image: "/placeholder.svg",
  },
  {
    id: "ORD003",
    product: "Green Sharara Set",
    customer: "Anita Singh",
    amount: 3000,
    status: "cancelled",
    image: "/placeholder.svg",
  },
]

export function DashboardOverview() {
  const stats = [
    {
      title: "Customers",
      value: "3,782",
      change: "+11.01%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Orders",
      value: "5,359",
      change: "-6.05%",
      trend: "down",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: "8,921",
      change: "+8.2%",
      trend: "up",
      icon: Package,
    },
    {
      title: "Referrals",
      value: "1,234",
      change: "+15.3%",
      trend: "up",
      icon: UserPlus,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <stat.icon className="h-4 w-4" />
                    <span>{stat.title}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Sales Chart */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Revenue and order trends</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Target */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Monthly Target</CardTitle>
              <CardDescription>Target you've set for each month</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              +10%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                You earn ₹3287 today, it's higher than last month. Keep up your good work!
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target</span>
                <span className="text-sm font-medium">₹20K ↓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-medium">₹20K ↑</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="text-sm font-medium">₹20K ↑</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Distribution */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="ghost" size="sm">
                See all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{order.product}</div>
                      <div className="text-xs text-gray-500">{order.customer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">₹{order.amount.toLocaleString()}</div>
                    <Badge
                      variant="secondary"
                      className={
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
