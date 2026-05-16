// Product card UI with loading state, cart action, and wishlist toggle.

import React from "react";
import { Button } from "./ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion as Motion } from "framer-motion";
import { setCart, toggleWishlistItem } from "@/redux/productSlice";
import { apiClient } from "@/services/apiClient";

const ProductCard = ({ product, loading }) => {
    const { productImg, productPrice, productName } = product || {};
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const wishlist = useSelector((store) => store.product?.wishlist) ?? [];
    const isWishlisted = wishlist.some((item) => item._id === product?._id);

    const addToCart = async(productId) =>{
        try {
            const res = await apiClient.post("/api/v1/cart/add", {productId})
            if(res.data.success){
                toast.success('Product added to Cart')
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.error(error.response?.data || error.message)
            toast.error(error.response?.data?.message || 'Failed to add product to cart')
        }
    }
  return (
    <Motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className='group shadow-sm hover:shadow-xl rounded-xl overflow-hidden h-max bg-card border border-border/70'
    >
        <div className='w-full h-full overflow-hidden aspect-square'>
            {
                loading ? <Skeleton className='w-full bg-muted h-full rounded-lg'/> : <img  
                    onClick={()=>navigate(`/products/${product._id}`)}
                    src={productImg?.[0]?.url} 
                    alt="" 
                    className='w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04] cursor-pointer object-cover'
                />
            }
        </div>
        {
            loading ? <div className='px-2 space-y-2 my-2'>
                <Skeleton className='w-[200px] h-4'/>
                <Skeleton className='w-[100px] h-4'/>
                <Skeleton className='w-[150px] h-8'/>
            </div> : <div className='px-2 space-y-1'>
            <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
            <h2 className='font-bold'>₹{productPrice}</h2>
            <div className="mb-3 flex gap-2">
              <Button onClick={()=>addToCart(product._id)} className='w-full'> <ShoppingCart/> Add to Cart </Button>
              <Button
                variant={isWishlisted ? "default" : "outline"}
                onClick={() => {
                  if (!product || !product._id) return;
                  dispatch(toggleWishlistItem(product));
                }}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="flex gap-2 items-center"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500" : ""}`} />
                {isWishlisted ? "Liked" : "Like"}
              </Button>
            </div>
        </div>
        }
    </Motion.div>
  )
}

export default ProductCard