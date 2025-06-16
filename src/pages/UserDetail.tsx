import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  MessageSquare,
  UserX,
  MoreHorizontal,
} from "lucide-react";

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("orders");

  // Mock user data
  const user = {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    status: "active",
    type: "seller",
    joinDate: "2024-01-15",
    bio: "Fashion enthusiast and designer with 5+ years of experience in traditional Indian wear.",
    address: "123 Fashion Street, Bandra West, Mumbai, Maharashtra - 400050",
    stats: {
      productsListed: 12,
      ordersPlaced: 8,
      totalReferrals: 5,
      referralCode: "PRIYA22",
    },
    products: [
      {
        id: "1",
        name: "Red Anarkali Suit",
        category: "Anarkali",
        type: "rent",
        price: 2500,
        status: "active",
        image:
          "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
        description: "This is a description for the Red Anarkali Suit.",
      },
      {
        id: "2",
        name: "Blue Lehenga Set",
        category: "Lehenga",
        type: "sell",
        price: 15000,
        status: "pending",
        image:
          "https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "3",
        name: "Green Sharara Set",
        category: "Sharara",
        type: "rent",
        price: 3000,
        status: "query raised",
        image:
          "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        id: "4",
        name: "Green Sharara Set",
        category: "Sharara",
        type: "rent",
        price: 3000,
        status: "query raised",
        image:
          "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
    orders: [
      {
        id: "ORD001",
        product: "Blue Lehenga Set",
        type: "placed",
        otherUser: "Meera Patel",
        date: "2024-01-20",
        amount: 15000,
        payment: "completed",
      },
      {
        id: "ORD002",
        product: "Red Anarkali Suit",
        type: "received",
        otherUser: "Anita Singh",
        date: "2024-01-18",
        amount: 2500,
        payment: "completed",
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "query raised":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "sell":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "placed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "received":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/users"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Users</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Profile
          </h1>
        </div>
        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
              </div>
              <Edit className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-start space-x-4 mb-6">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                      user.type
                    )}`}
                  >
                    {user.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">{user.bio}</p>
          </div>
        </div>

        {/* Right Column - Quick Stats and Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Products Listed
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {user.stats.productsListed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Orders Placed
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {user.stats.ordersPlaced}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Referral Code
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {user.stats.referralCode}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Referrals
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {user.stats.totalReferrals}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send Message
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Address Information
            </h3>
          </div>
          <Edit className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-green-500" />
          <span>{user.address}</span>
        </div>
      </div>

      {/* Products Listed / Order History Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Products Listed
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Order History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "products" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 h-32 flex items-center justify-center rounded-lg mb-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>

                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(
                        product.type
                      )}`}
                    >
                      {product.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {product?.description || "No description available."}
                  </p>

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <div className="mb-2">
                    <select className="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">
                      <option>Change status</option>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Query Raised</option>
                    </select>
                  </div>

                  <div className="flex justify-between space-x-2">
                    <button className="flex-1 inline-flex items-center justify-center text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Edit className="h-3 w-3" />
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <MessageSquare className="h-3 w-3" />
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <UserX className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order History
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Other User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {user.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {order.product}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                              order.type
                            )}`}
                          >
                            {order.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {order.otherUser}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {order.date}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          ₹{order.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.payment
                            )}`}
                          >
                            {order.payment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
