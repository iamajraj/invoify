import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '6months'

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
      case '12months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1)
        break
      case 'all':
        startDate = new Date(2020, 0, 1) // Far enough back
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    }

    // Get all invoices for the user within the time range
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
        issueDate: {
          gte: startDate,
        },
      },
      include: {
        client: true,
        items: true,
      },
    })

    // Calculate basic metrics
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length
    const pendingInvoices = invoices.filter(inv => inv.status === 'SENT' || inv.status === 'DRAFT').length
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE').length
    const averageInvoiceValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

    // Get unique clients
    const clientIds = [...new Set(invoices.map(inv => inv.clientId))]
    const totalClients = clientIds.length

    // Monthly revenue data
    const monthlyData: { [key: string]: { revenue: number; invoices: number } } = {}

    invoices.forEach(invoice => {
      const date = new Date(invoice.issueDate)
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, invoices: 0 }
      }

      monthlyData[monthKey].revenue += invoice.total
      monthlyData[monthKey].invoices += 1
    })

    const monthlyRevenue = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        invoices: data.invoices,
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    // Status breakdown
    const statusCounts: { [key: string]: { count: number; value: number } } = {}

    invoices.forEach(invoice => {
      const status = invoice.status
      if (!statusCounts[status]) {
        statusCounts[status] = { count: 0, value: 0 }
      }
      statusCounts[status].count += 1
      statusCounts[status].value += invoice.total
    })

    const statusBreakdown = Object.entries(statusCounts).map(([status, data]) => ({
      status: status.charAt(0) + status.slice(1).toLowerCase(),
      count: data.count,
      value: data.value,
    }))

    // Top clients by revenue
    const clientRevenue: { [key: string]: { name: string; email: string; revenue: number; count: number } } = {}

    invoices.forEach(invoice => {
      const clientId = invoice.clientId
      const client = invoice.client

      if (!clientRevenue[clientId]) {
        clientRevenue[clientId] = {
          name: client.name,
          email: client.email,
          revenue: 0,
          count: 0,
        }
      }

      clientRevenue[clientId].revenue += invoice.total
      clientRevenue[clientId].count += 1
    })

    const topClients = Object.values(clientRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .map(client => ({
        name: client.name,
        email: client.email,
        totalRevenue: client.revenue,
        invoiceCount: client.count,
      }))

    const analyticsData = {
      totalRevenue,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalClients,
      averageInvoiceValue,
      monthlyRevenue,
      statusBreakdown,
      topClients,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
