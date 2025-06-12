"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Eye, Check, X, Plus, Filter, Search, MoreHorizontal } from "lucide-react"
import { ReferralsStats } from "@/components/referrals-stats"

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

export function ReferralsManagement() {
  const [referrals, setReferrals] = useState(mockReferrals)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newReferral, setNewReferral] = useState({
    referrerEmail: "",
    referredEmail: "",
    rewardAmount: 500,
  })

  const handleAddReferral = () => {
    // API call to create referral
    setShowAddDialog(false)
    setNewReferral({ referrerEmail: "", referredEmail: "", rewardAmount: 500 })
  }

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setReferrals(referrals.map((ref) => (ref.id === id ? { ...ref, status: newStatus } : ref)))
    // API call to update status
  }

  const handleRewardPayout = (id: string) => {
    // API call to process reward payout
    console.log(`Processing reward payout for referral ${id}`)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Referrals Management</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Referral
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Referral</DialogTitle>
              <DialogDescription>Create a new referral relationship between users</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="referrer-email">Referrer Email</Label>
                <Input
                  id="referrer-email"
                  placeholder="Enter referrer's email"
                  value={newReferral.referrerEmail}
                  onChange={(e) => setNewReferral({ ...newReferral, referrerEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="referred-email">Referred User Email</Label>
                <Input
                  id="referred-email"
                  placeholder="Enter referred user's email"
                  value={newReferral.referredEmail}
                  onChange={(e) => setNewReferral({ ...newReferral, referredEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reward-amount">Reward Amount (₹)</Label>
                <Input
                  id="reward-amount"
                  type="number"
                  value={newReferral.rewardAmount}
                  onChange={(e) => setNewReferral({ ...newReferral, rewardAmount: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReferral} className="bg-blue-600 hover:bg-blue-700">
                Create Referral
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <ReferralsStats />

      {/* Referrals Table */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle>All Referrals</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search referrals..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-medium text-gray-900">Referrer</TableHead>
                <TableHead className="font-medium text-gray-900">Referral Code</TableHead>
                <TableHead className="font-medium text-gray-900">Referred User</TableHead>
                <TableHead className="font-medium text-gray-900">Email</TableHead>
                <TableHead className="font-medium text-gray-900">Status</TableHead>
                <TableHead className="font-medium text-gray-900">Reward</TableHead>
                <TableHead className="font-medium text-gray-900">Date</TableHead>
                <TableHead className="font-medium text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{referral.referrerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {referral.referrerCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900">{referral.referredName}</TableCell>
                  <TableCell className="text-gray-600">{referral.referredEmail}</TableCell>
                  <TableCell>
                    <Select value={referral.status} onValueChange={(value) => handleStatusUpdate(referral.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium">₹{referral.rewardAmount}</TableCell>
                  <TableCell className="text-gray-600">{referral.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {referral.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRewardPayout(referral.id)}
                          className="hover:bg-orange-50 text-orange-600"
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(referral.id, "completed")}
                        className="hover:bg-green-50 text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(referral.id, "cancelled")}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
