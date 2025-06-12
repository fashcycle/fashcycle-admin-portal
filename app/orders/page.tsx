import { OrdersTable } from "@/components/orders-table"
import { OrdersFilters } from "@/components/orders-filters"

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
      </div>
      <OrdersFilters />
      <OrdersTable />
    </div>
  )
}
