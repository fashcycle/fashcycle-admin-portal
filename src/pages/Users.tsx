import React, { useEffect, useState } from "react";
import { Search, Eye, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Pagination from "../components/common/Pagination";
import { helpers } from "../utils/helper";

// Filters type
interface Filters {
  page: number;
  limit: number;
  search: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  //   const users: User[] = [
  //     {
  //       id: '1',
  //       name: 'Priya Sharma',
  //       email: 'priya@example.com',
  //       phone: '+91 98765 43210',
  //       status: 'active',
  //       type: 'seller',
  //       products: 12,
  //       orders: 8,
  //       referrer: 'Yes',
  //       registration: '2024-01-15'
  //     },
  //   ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getReferrerColor = (referrer: string) => {
    switch (referrer) {
      case "Yes":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "No":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { userList, getUserList, totalUsers } = useUser();
  console.log("userList", userList);

  useEffect(() => {
    getUserList(filters);
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Users
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Contact Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Referrer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Registration Date & Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {userList.map((user) => (
                <tr
                  key={user?.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user?.name ? user?.name : "-"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email ? user?.email : "-"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {/* <Mail className="h-4 w-4 text-gray-400" /> */}
                      {user?.phone ? (
                        <>
                          {/* <Phone className="h-4 w-4 text-gray-400 mr-2" /> */}
                          +{user?.phone}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {user?.products ? user?._count?.products : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {user?.orders ? user?._count?.orders : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReferrerColor(
                        user?.referrer
                      )}`}
                    >
                      {user?.referrer ? user?.referrer : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {user?.createdAt
                      ? helpers?.formatDateFunction(
                          user?.createdAt ?? "",
                          "dd/mm/yyyy",
                          true
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/users/${user?.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      title="View User"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalUsers > 0 && (
            <Pagination
              itemsPerPage={filters.limit}
              totalItems={totalUsers}
              currentPage={filters.page}
              onPageChange={(page: number) => {
                scrollToTop();
                setFilters({ ...filters, page });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
