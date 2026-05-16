// Customer order history page.

import OrderCard from "@/components/OrderCard";
import PageTransition from "@/components/PageTransition";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Displays the user's order history with loading states and order details.
 * @returns {JSX.Element} The MyOrder component
 */
function MyOrder() {
  const [userOrder, setUserOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches orders for the logged-in customer.
   */
  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      const res = await apiClient.get("/api/v1/orders/my-order");

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
      setLoading(false);
    };

    fetchUserOrders();
  }, []);

  return (
    <div className="bg-background min-h-screen pt-2 px-4  text-foreground">
      <PageTransition>
        {loading ? (
          <div className="mx-auto max-w-6xl space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <OrderCard userOrder={userOrder}/>
        )}
      </PageTransition>
    </div>
  );
}

export default MyOrder;
