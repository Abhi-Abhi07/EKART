import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * Admin page displaying all orders with order details, status badges, and date.
 * Shows user information, products, amount, and order status.
 * @returns {JSX.Element} The AdminOrders component
 */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get("/api/v1/orders/all");
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch admin orders: ", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className='bg-background min-h-screen p-6'>
      <PageTransition>
        <div className="mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-foreground">All Orders</h1>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">No orders found.</p>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg bg-card">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 font-semibold text-foreground">Order ID</th>
                    <th className="px-4 py-3 font-semibold text-foreground">User</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Products</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-border hover:bg-muted/30 transition">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{order._id.slice(0, 8)}...</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{order.user?.name}</p>
                        <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        {order.products.map((p, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground">
                            {p.productName} x {p.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            order.status === "Paid"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
}

export default AdminOrders;
