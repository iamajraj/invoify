"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Users, Plus, TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalInvoices: number
  totalRevenue: number
  paidInvoices: number
  pendingInvoices: number
  totalClients: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalRevenue: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalClients: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardStats()
    }
  }, [session])

  const fetchDashboardStats = async () => {
    try {
      const [invoicesRes, clientsRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/clients")
      ])

      if (invoicesRes.ok) {
        const invoices = await invoicesRes.json()
        const totalRevenue = invoices
          .filter((inv: any) => inv.status === 'PAID')
          .reduce((sum: number, inv: any) => sum + inv.total, 0)

        setStats(prev => ({
          ...prev,
          totalInvoices: invoices.length,
          totalRevenue,
          paidInvoices: invoices.filter((inv: any) => inv.status === 'PAID').length,
          pendingInvoices: invoices.filter((inv: any) => inv.status === 'SENT' || inv.status === 'DRAFT').length
        }))
      }

      if (clientsRes.ok) {
        const clients = await clientsRes.json()
        setStats(prev => ({
          ...prev,
          totalClients: clients.length
        }))
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/invoices/new">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <Plus className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Invoice</h3>
                    <p className="text-sm text-gray-600">Generate a new invoice</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/clients/new">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <Users className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Add Client</h3>
                    <p className="text-sm text-gray-600">Create a new client profile</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/invoices">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <FileText className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900">View Invoices</h3>
                    <p className="text-sm text-gray-600">Manage your invoices</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvoices}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From paid invoices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.paidInvoices}</div>
                <p className="text-xs text-muted-foreground">Successfully collected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Your latest invoice activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices yet</p>
                <p className="text-sm">Create your first invoice to get started</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Your latest client additions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No clients yet</p>
                <p className="text-sm">Add your first client to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
