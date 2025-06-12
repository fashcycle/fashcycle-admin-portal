import { UserDetailView } from "@/components/user-detail-view"

interface UserPageProps {
  params: {
    id: string
  }
}

export default function UserPage({ params }: UserPageProps) {
  return <UserDetailView userId={params.id} />
}
