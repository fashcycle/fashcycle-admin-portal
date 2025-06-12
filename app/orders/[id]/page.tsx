import { OrderDetailView } from "@/components/order-detail-view"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  return <OrderDetailView orderId={params.id} />
}
