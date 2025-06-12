import { DashboardOverview } from "@/components/dashboard-overview"

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Annually</option>
          </select>
        </div>
      </div>
      <DashboardOverview />
    </div>
  )
}
