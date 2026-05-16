import React, { useState } from 'react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setCart, toggleWishlistItem } from '@/redux/productSlice'
import { apiClient } from '@/services/apiClient'
import { ShoppingCart, Zap, Heart } from 'lucide-react'

/**
 * Displays product description, price, and action buttons for adding to cart.
 * Allows quantity selection and provides "Add to Cart" and "Buy Now" options.
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object containing details
 * @param {string} props.product.productName - Name of the product
 * @param {string} props.product.category - Product category
 * @param {string} props.product.brand - Product brand
 * @param {number} props.product.productPrice - Price of the product
 * @param {string} props.product.productDesc - Description of the product
 * @param {string} props.product._id - Unique ID of the product
 * @returns {JSX.Element} The ProductDesc component
 */
function ProductDesc({product}) {
    const dispatch = useDispatch()
    const wishlist = useSelector((store) => store.product?.wishlist ?? [])
    const isWishlisted = wishlist.some((item) => item._id === product._id)
    const [quantity, setQuantity] = useState(1)

    const handleWishlistToggle = () => {
      if (!product || !product._id) return;
      dispatch(toggleWishlistItem(product))
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    }

    const addToCart = async() =>{
      try {
          const res = await apiClient.post(`/api/v1/cart/add`, {productId: product._id})
          if(res.data.success){
              toast.success('Product added to cart')
              dispatch(setCart(res.data.cart))
          }
      } catch (error) {
          console.error(error.response?.data || error.message)
          toast.error(error.response?.data?.message || 'Failed to add product to cart')
      }
    }

  return (
    <div className='flex flex-col gap-5'>
        {/* Product Name */}
        <div>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground leading-tight'>
            {product.productName}
          </h1>
          <p className='text-sm text-muted-foreground mt-2'>
            {product.category} • {product.brand}
          </p>
        </div>

        {/* Price */}
        <div className='border-b border-border pb-4'>
          <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
            ₹{product.productPrice?.toLocaleString('en-IN')}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {product.productDesc}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 border border-border rounded-lg p-3 w-fit bg-muted/30">
            <span className='text-sm font-medium text-foreground'>Quantity:</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </Button>
              <span className='w-8 text-center font-semibold text-foreground'>{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={addToCart} 
            className="flex-1 h-12 text-base font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            onClick={addToCart} 
            className="flex-1 h-12 text-base font-semibold flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Buy Now
          </Button>
          <Button
            variant={isWishlisted ? "default" : "outline"}
            onClick={handleWishlistToggle}
            className="h-12 text-base font-semibold flex items-center justify-center gap-2"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "text-red-500" : ""}`} />
            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-border pt-4 space-y-2">
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>Free shipping on orders over ₹299</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>30-days return policy</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-primary font-bold">✓</span>
            <span>Secure checkout with SSL encryption</span>
          </div>
        </div>
    </div>
  )
}

export default ProductDesc