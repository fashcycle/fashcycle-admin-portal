"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  UserPlus,
  IndianRupee,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"

// Mock data for charts (same as before)
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, orders: 120, products: 89 },
  { month: "Feb", revenue: 52000, orders: 145, products: 102 },
  { month: "Mar", revenue: 48000, orders: 132, products: 95 },
  { month: "Apr", revenue: 61000, orders: 168, products: 118 },
  { month: "May", revenue: 55000, orders: 152, products: 108 },
  { month: "Jun", revenue: 67000, orders: 185, products: 135 },
  { month: "Jul", revenue: 72000, orders: 198, products: 142 },
  { month: "Aug", revenue: 68000, orders: 189, products: 128 },
  { month: "Sep", revenue: 75000, orders: 205, products: 156 },
  { month: "Oct", revenue: 82000, orders: 225, products: 168 },
  { month: "Nov", revenue: 78000, orders: 212, products: 145 },
  { month: "Dec", revenue: 89000, orders: 245, products: 178 },
]

const categoryData = [
  { name: "Lehenga", value: 35, revenue: 285000, color: "#3B82F6" },
  { name: "Anarkali", value: 25, revenue: 198000, color: "#10B981" },
  { name: "Saree", value: 20, revenue: 156000, color: "#F59E0B" },
  { name: "Sharara", value: 15, revenue: 118000, color: "#EF4444" },
  { name: "Others", value: 5, revenue: 42000, color: "#8B5CF6" },
]

const userGrowth = [
  { month: "Jan", newUsers: 45, totalUsers: 1245 },
  { month: "Feb", newUsers: 52, totalUsers: 1297 },
  { month: "Mar", newUsers: 48, totalUsers: 1345 },
  { month: "Apr", newUsers: 61, totalUsers: 1406 },
  { month: "May", newUsers: 55, totalUsers: 1461 },
  { month: "Jun", newUsers: 67, totalUsers: 1528 },
  { month: "Jul", newUsers: 72, totalUsers: 1600 },
  { month: "Aug", newUsers: 68, totalUsers: 1668 },
  { month: "Sep", newUsers: 75, totalUsers: 1743 },
  { month: "Oct", newUsers: 82, totalUsers: 1825 },
  { month: "Nov", newUsers: 78, totalUsers: 1903 },
  { month: "Dec", newUsers: 89, totalUsers: 1992 },
]

const referralData = [
  { month: "Jan", referrals: 25, conversions: 20, rewards: 10000 },
  { month: "Feb", referrals: 32, conversions: 28, rewards: 14000 },
  { month: "Mar", referrals: 28, conversions: 22, rewards: 11000 },
  { month: "Apr", referrals: 41, conversions: 35, rewards: 17500 },
  { month: "May", referrals: 35, conversions: 30, rewards: 15000 },
  { month: "Jun", referrals: 47, conversions: 42, rewards: 21000 },
  { month: "Jul", referrals: 52, conversions: 45, rewards: 22500 },
  { month: "Aug", referrals: 48, conversions: 40, rewards: 20000 },
  { month: "Sep", referrals: 55, conversions: 48, rewards: 24000 },
  { month: "Oct", referrals: 62, conversions: 55, rewards: 27500 },
  { month: "Nov", referrals: 58, conversions: 50, rewards: 25000 },
  { month: "Dec", referrals: 69, conversions: 62, rewards: 31000 },
]

const orderStatusData = [
  { name: "Completed", value: 68, color: "#10B981" },
  { name: "Processing", value: 15, color: "#F59E0B" },
  { name: "Shipped", value: 12, color: "#3B82F6" },
  { name: "Cancelled", value: 5, color: "#EF4444" },
]

const topProducts = [
  { name: "Red Bridal Lehenga", orders: 45, revenue: 112500, category: "Lehenga" },
  { name: "Blue Anarkali Set", orders: 38, revenue: 95000, category: "Anarkali" },
  { name: "Golden Saree", orders: 32, revenue: 80000, category: "Saree" },
  { name: "Pink Sharara", orders: 28, revenue: 70000, category: "Sharara" },
  { name: "Green Lehenga", orders: 25, revenue: 62500, category: "Lehenga" },
]

const recentActivity = [
  { type: "order", message: "New order #ORD123 placed", time: "2 minutes ago", status: "new" },
  { type: "product", message: "Product 'Blue Lehenga' approved", time: "15 minutes ago", status: "approved" },
  { type: "user", message: "New user registration: Priya Sharma", time: "1 hour ago", status: "new" },
  { type: "referral", message: "Referral reward paid to Meera Patel", time: "2 hours ago", status: "completed" },
  { type: "order", message: "Order #ORD120 delivered", time: "3 hours ago", status: "delivered" },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("12months")

  const stats = [
    {
      title: "Total Revenue",
      value: "₹7,89,000",
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      description: "vs last month",
    },
    {
      title: "Total Orders",
      value: "2,156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      description: "vs last month",
    },
    {
      title: "Active Products",
      value: "1,423",
      change: "+15.3%",
      trend: "up",
      icon: Package,
      description: "vs last month",
    },
    {
      title: "Total Users",
      value: "1,992",
      change: "+18.7%",
      trend: "up",
      icon: Users,
      description: "vs last month",
    },
    {
      title: "Referrals",
      value: "623",
      change: "+22.1%",
      trend: "up",
      icon: UserPlus,
      description: "vs last month",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.5%",
      trend: "down",
      icon: TrendingUp,
      description: "vs last month",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <stat.icon className="h-4 w-4" />
                  <span className="truncate">{stat.title}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-1 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">{stat.description}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue and Orders Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Revenue & Orders Overview</CardTitle>
                <p className="text-sm text-gray-600">Monthly revenue and order trends</p>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#666" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Order Status</CardTitle>
                <p className="text-sm text-gray-600">Current order distribution</p>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {orderStatusData.map((item) => (
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
      </div>

      {/* Category Performance and User Growth */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Category Performance</CardTitle>
                <p className="text-sm text-gray-600">Revenue by product category</p>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} width={80} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? `₹${value.toLocaleString()}` : `${value}%`,
                      name === "revenue" ? "Revenue" : "Share",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>User Growth</CardTitle>
                <p className="text-sm text-gray-600">New user registrations over time</p>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Analytics */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Referral Analytics</CardTitle>
              <p className="text-sm text-gray-600">Referral performance and reward distribution</p>
            </div>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={referralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis yAxisId="left" stroke="#666" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="referrals" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rewards"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Products and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Top Performing Products</CardTitle>
                <p className="text-sm text-gray-600">Best selling products this month</p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm text-gray-900">₹{product.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{product.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-gray-600">Latest platform activities</p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "new"
                        ? "bg-blue-500"
                        : activity.status === "approved"
                          ? "bg-green-500"
                          : activity.status === "completed"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      activity.status === "new"
                        ? "bg-blue-100 text-blue-800"
                        : activity.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "completed"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
