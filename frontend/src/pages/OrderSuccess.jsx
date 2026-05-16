// Post-payment success confirmation page.

import { CheckCircle } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

function OrderSuccess() {
    const navigate = useNavigate();
  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-6'>
        <div className='bg-card rounded-2xl shadow-lg p-10 max-w-md w-full text-center'>
            {/* success icon */}
            <div className='flex justify-center'>
                <CheckCircle className='h-20 w-20 text-green-500'></CheckCircle>
            </div>
            {/* Title */}
            <h1 className='text-2xl font-bold mt-6'>Payment Successful</h1>

            {/* Message */}
            <p className='text-muted-foreground mt-2' >
                Thank you for your purchase! Your order has been placed Successfully.
            </p>

            {/* buttons */}
            <div className='mt-6 flex flex-col gap-3' >
                <button 
                onClick={()=>{navigate("/products")}}
                className='w-full bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition'
                >
                    Continue Shopping
                </button>
 
                 <button 
                onClick={()=>{navigate("/orders")}}
                className='w-full border border-primary text-primary py-3 rounded-xl hover:bg-accent transition'
                >
                    View My Orders
                </button>
               
            </div>
        </div>
    </div>
  )
}

export default OrderSuccess