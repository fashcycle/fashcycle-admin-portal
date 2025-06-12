import { ProductDetailView } from "@/components/product-detail-view"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailView productId={params.id} />
}
