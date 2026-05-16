import OrderCard from '@/components/OrderCard';
import PageTransition from '@/components/PageTransition';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

/**
 * Admin page displaying orders for a specific user.
 * Shows all orders placed by the user with their details.
 * @returns {JSX.Element} The ShowUserOrders component
 */
function ShowUserOrders() {
  const [userOrder, setUserOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams()

  useEffect(() => {
    const fetchUserOrders = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (res.data.success) {
          setUserOrder(res.data.orders);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user orders");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [params.userId]);

  return (
    <div className="bg-background min-h-screen p-6">
      <PageTransition>
        {loading ? (
          <div className="max-w-6xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <OrderCard userOrder={userOrder} />
        )}
      </PageTransition>
    </div>
  )
}

export default ShowUserOrders