import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Gift, TrendingUp, Users } from "lucide-react"

export function ReferralsStats() {
  const stats = [
    {
      title: "Total Referrals",
      value: "1,234",
      change: "+15%",
      icon: UserPlus,
      description: "This month",
    },
    {
      title: "Successful Referrals",
      value: "987",
      change: "+12%",
      icon: Users,
      description: "Completed registrations",
    },
    {
      title: "Rewards Paid",
      value: "₹4,93,500",
      change: "+18%",
      icon: Gift,
      description: "Total rewards distributed",
    },
    {
      title: "Conversion Rate",
      value: "80%",
      change: "+5%",
      icon: TrendingUp,
      description: "Referral to registration",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <stat.icon className="h-4 w-4" />
                  <span>{stat.title}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="text-green-600">{stat.change}</span> {stat.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
