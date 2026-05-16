// Product details page with premium two-column layout and responsive behavior.

import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import PageTransition from '@/components/PageTransition'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Displays detailed product information in a responsive two-column layout.
 * Left column shows product images, right column shows product description and actions.
 * @param {Object} props - Component props (none required)
 * @returns {JSX.Element} The SingleProduct component
 */
function SingleProduct() {
  const params = useParams()
  const productId = params.id;
  const {products} = useSelector((store) => store.product)
  const product = products.find((item) => item._id === productId)

  if (!product) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto min-h-screen max-w-6xl px-4 pb-10 pt-24">
          <Skeleton className="h-6 w-60" />
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-44" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='bg-background min-h-screen'>
      <PageTransition>
        <div className='pt-24 pb-10 max-w-6xl mx-auto px-4'>
          <Breadcrums product={product}/>
          <div className='mt-8 bg-card rounded-3xl p-6 shadow-sm'>
            <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
              <ProductImg images={product.productImg}/>
              <div className="md:pl-2">
                <ProductDesc product={product}/>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  )
}

export default SingleProduct