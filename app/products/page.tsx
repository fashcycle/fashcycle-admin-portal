import { ProductsTable } from "@/components/products-table"
import { ProductsFilters } from "@/components/products-filters"

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Product Tracking</h2>
      </div>
      <ProductsFilters />
      <ProductsTable />
    </div>
  )
}
