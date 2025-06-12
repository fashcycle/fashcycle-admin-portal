import { UsersTable } from "@/components/users-table"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>
      <UsersTable />
    </div>
  )
}
