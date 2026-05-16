// Cart page with quantity controls, summary card, and empty state.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.png";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Displays the user's shopping cart with item management, quantity controls, and order summary.
 * Supports adding/removing items, updating quantities, and proceeding to checkout.
 * @returns {JSX.Element} The Cart component
 */
function Cart() {
  const {cart} = useSelector(store => store.product)
  const [loading, setLoading] = useState(false);

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05 //5%
  const total = subtotal + shipping + tax
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await apiClient.put(`/api/v1/cart/update`,{productId,type})
      if(res.data.success){
        dispatch(setCart(res.data.cart))
        toast.success(`Quantity ${type === 'increase' ? 'increased' : 'decreased'}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update quantity")
    }
  }

  const handleRemove =  async (cartItemId) => {
    try {
      const res = await apiClient.delete(`/api/v1/cart/remove`,{ data: {cartItemId} })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
        toast.success("Item removed from cart")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove item")
    }
  }

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/v1/cart/get`)
        if (res.data.success) {
          dispatch(setCart(res.data.cart))
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load cart")
      } finally {
        setLoading(false);
      }
    }

    loadCart()
  }, [dispatch])

  return (
    <div className='bg-background min-h-screen px-4'>
      <PageTransition>
        {loading ? (
          <div className="mx-auto max-w-6xl pt-24 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
        <>
        {
          cart?.items?.length > 0 ?
          <div className="max-w-6xl mx-auto pt-24 pb-10">
            <h1 className="text-2xl font-bold mb-7 text-foreground">Shopping Cart</h1>
            <div className="max-w-6xl mx-auto grid gap-7 lg:grid-cols-[2fr_1fr]">
              <div className='flex flex-col gap-5 flex-1'>
                {cart?.items?.map((product, index)=>{
                  return <Card key={index} className="bg-card">
                    <div className='flex flex-col gap-4 p-4 sm:flex-row sm:justify-between sm:items-center'>
                      <div className='flex items-center gap-3 sm:w-[350px]'>
                        <img src={product?.productId?.productImg?.[0]?.url || userLogo} alt='' className='w-25 h-25 cursor-pointer rounded-xl object-cover' />
                        <div className='sm:w-[280px]'>
                          <h1 className='font-semibold truncate text-foreground' >{product?.productId?.productName}</h1>
                          <p className="text-muted-foreground">₹{product?.productId?.productPrice}</p>
                        </div>
                      </div>
                      <div className='flex gap-3 items-center'>
                        <Button onClick={()=>handleUpdateQuantity(product.productId._id,'decrease')} variant='outline' size="icon">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-foreground font-medium">{product.quantity}</span>
                        <Button onClick={()=>handleUpdateQuantity(product.productId._id,'increase')} variant='outline' size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                                      <p className="text-foreground font-semibold">₹{(product?.productId?.productPrice)*(product?.quantity)}</p>
                      <Button onClick={()=>handleRemove(product?._id)} variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </Card>
                })}
              </div>
              <div className="lg:sticky lg:top-24">
                <Card className='w-full lg:w-[400px] bg-card'>
                  <CardHeader>
                    <CardTitle className="text-foreground">Order summary</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between'>
                      <span className="text-muted-foreground">Subtotal ({cart?.items?.length} items)</span>
                      <span className="text-foreground">₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">₹{shipping}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className="text-muted-foreground">Tax(5%)</span>
                      <span className="text-foreground">₹{tax}</span>
                    </div>
                    <Separator/>
                    <div className='flex justify-between font-bold text-lg'>
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground"> ₹{total}</span>
                    </div>
                    <div className='space-y-3 pt-4'>
                      <div className='flex space-x-2'>
                        <Input placeholder='Promo Code' />
                        <Button variant='outline'>Apply</Button>
                      </div>
                      <Button onClick={()=>navigate("/address")} className='w-full'>PLACE ORDER</Button>
                      <Button variant='outline' className='w-full bg-transparent'>
                        <Link to='/products'>Continue Shopping</Link>
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground pt-4">
                      <p>* Free shipping on orders over 299</p>
                      <p>* 30-days return policy</p>
                      <p>* Secure checkout with SSL encryption</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div> :
          <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
            {/* Icon */}
              <div className='bg-muted p-6 rounded-full'>
                <ShoppingCart className="w-16 h-16 text-primary"/>
              </div>
              {/* title */}
              <h2 className="mt-6 text-2xl font-bold text-foreground">Your Cart is Empty</h2>
              <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet</p>
              <Button onClick={()=>navigate('/products')} className="mt-6 p-4 px-6">Start Shopping</Button>
          </div>
        }
        </>
        )}
      </PageTransition>
    </div>
  )
}

export default Cart