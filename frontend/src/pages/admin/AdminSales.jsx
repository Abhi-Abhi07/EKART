import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageTransition from '@/components/PageTransition'
import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { Area, ResponsiveContainer,AreaChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

/**
 * Admin dashboard displaying sales statistics and metrics.
 * Shows total users, products, orders, sales amount, and a sales chart over 30 days.
 * @returns {JSX.Element} The AdminSales component
 */
function AdminSales() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: []
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async()=>{
    try {
      setLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/sales`,{
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        const { totalUsers, totalProducts, totalOrders, totalSales, salesByDate } = res.data
        setStats({
          totalUsers,
          totalProducts,
          totalOrders,
          totalSales,
          salesByDate
        })
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load sales data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchStats()
  },[])

  if(loading) {
    return (
      <div className='bg-background min-h-screen p-6'>
        <PageTransition>
          <div className='grid gap-4 lg:grid-cols-4'>
            {Array.from({length: 4}).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
            <Skeleton className="h-80 lg:col-span-4" />
          </div>
        </PageTransition>
      </div>
    )
  }

  return (
    <div className='bg-background  min-h-screen p-6'>
      <PageTransition>
        <div className='space-y-6'>
          <h1 className='text-3xl font-bold text-foreground'>Sales Dashboard</h1>
          <div className='grid gap-4 lg:grid-cols-4'>
            {/* Stats Cards */}
            <Card className='bg-card border-border shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-foreground'>{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className='bg-card border-border shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-foreground'>{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className='bg-card border-border shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-foreground'>{stats.totalOrders}</div>
              </CardContent>
            </Card>

            <Card className='bg-card border-border shadow-sm'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-primary'>₹{stats.totalSales.toLocaleString('en-IN')}</div>
              </CardContent>
            </Card>

            {/* Sales Chart */}
            <Card className='lg:col-span-4 bg-card border-border shadow-sm'>
              <CardHeader>
                <CardTitle className='text-foreground'>Sales Last 30 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{height:300}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesByDate}>
                      <XAxis dataKey="date" stroke="currentColor" className="text-muted-foreground" />
                      <YAxis stroke="currentColor" className="text-muted-foreground" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }} />
                      <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill='hsl(var(--primary))' fillOpacity={0.1}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  )
}

export default AdminSales