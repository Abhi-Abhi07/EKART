// Product listing page with filter controls and responsive grid.

import FilterSidebar from '@/components/FilterSidebar'
import PageTransition from '@/components/PageTransition'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { apiClient } from '@/services/apiClient'
import { motion as Motion } from "framer-motion";

/**
 * Displays a grid of products with filtering, sorting, and search capabilities.
 * Includes a sidebar for filters and a responsive product grid with loading states.
 * @returns {JSX.Element} The Products component
 */
function Products() {
  const {products} = useSelector(store=>store.product)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [priceRange, setPriceRange] = useState([0,999999]);
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [sortOrder, setSortOrder] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const res = await apiClient.get(`/api/v1/product/get`)
        if (res.data.success) {
          setAllProducts(res.data.products)
          dispatch(setProducts(res.data.products))
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to load products")
      } finally {
        // await new Promise((resolve) => setTimeout(resolve, 2000)); // slow loading for check skeleton working
        setLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch])

  useEffect(()=>{
    if(allProducts.length === 0)  return

    let filtered = [...allProducts]

    if(search.trim() !== ""){
      filtered = filtered.filter(prod => prod.productName?.toLowerCase().includes(search.toLowerCase()))
    }

    if(category !== "All"){
      filtered = filtered.filter(p=>p.category === category)
    }

    if(brand !== "All"){
      filtered = filtered.filter(p=>p.brand === brand)
    }

    filtered = filtered.filter(p=>p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

    if(sortOrder === "lowToHigh"){
      filtered.sort((a,b)=>a.productPrice - b.productPrice)
    }else if(sortOrder === "highToLow"){
      filtered.sort((a,b)=>b.productPrice - a.productPrice)
    }

    dispatch(setProducts(filtered))

  },[search,category,brand,sortOrder,priceRange,allProducts,dispatch])

  return (
    <div className='bg-background min-h-screen pt-20 pb-10'>
      <PageTransition>
        <div className='max-w-6xl mx-auto flex gap-7'>
          {/* sidebar */}
          <FilterSidebar
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          search={search}
          setSearch={setSearch}
          brand = {brand}
          setBrand = {setBrand}
          category={category}
          setCategory = {setCategory}
          setSortOrder ={setSortOrder}
          />
          {/* Main product section  */}
          <div className='flex flex-col flex-1'>
            <div className='flex justify-end mb-4'>
              <Select
              value={sortOrder}
              onValueChange={(value)=>setSortOrder(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort</SelectLabel>
                    <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                    <SelectItem value="highToLow">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              {/* product grid  */}
              <Motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.03 } },
                }}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'
              >
                {
                  loading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <ProductCard key={`skeleton-${index}`} product={{}} loading={true} />
                    ))
                  : products.map((product)=>{
                    return (
                      <Motion.div
                        key={product._id}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                        }}
                      >
                        <ProductCard product={product} loading={loading}/>
                      </Motion.div>
                    )
                  })
                }
              </Motion.div>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  )
}

export default Products