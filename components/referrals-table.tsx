"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Gift } from "lucide-react"

const mockReferrals = [
  {
    id: "1",
    referrerName: "Priya Sharma",
    referrerCode: "PRIYA123",
    referredName: "Meera Patel",
    referredEmail: "meera@example.com",
    status: "completed",
    rewardAmount: 500,
    date: "2024-01-20",
  },
  {
    id: "2",
    referrerName: "Anita Singh",
    referrerCode: "ANITA456",
    referredName: "Kavya Reddy",
    referredEmail: "kavya@example.com",
    status: "pending",
    rewardAmount: 500,
    date: "2024-01-18",
  },
  {
    id: "3",
    referrerName: "Meera Patel",
    referrerCode: "MEERA789",
    referredName: "Sita Gupta",
    referredEmail: "sita@example.com",
    status: "completed",
    rewardAmount: 500,
    date: "2024-01-15",
  },
]

export function ReferralsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referrer</TableHead>
            <TableHead>Referral Code</TableHead>
            <TableHead>Referred User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReferrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell className="font-medium">{referral.referrerName}</TableCell>
              <TableCell>
                <Badge variant="outline">{referral.referrerCode}</Badge>
              </TableCell>
              <TableCell>{referral.referredName}</TableCell>
              <TableCell>{referral.referredEmail}</TableCell>
              <TableCell>
                <Badge variant={referral.status === "completed" ? "default" : "secondary"}>{referral.status}</Badge>
              </TableCell>
              <TableCell>₹{referral.rewardAmount}</TableCell>
              <TableCell>{referral.date}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Gift className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
