import ImageUpload from '@/components/ImageUpload'
import PageTransition from '@/components/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import { apiClient } from '@/services/apiClient'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

/**
 * Admin page for adding new products with image uploads and form validation.
 * Allows admins to create products with details like name, price, brand, category, and images.
 * @returns {JSX.Element} The AddProduct component
 */
function AddProduct() {
  const dispatch = useDispatch()
  const {products} = useSelector((store)=>store.product)
  const [loading,setLoading] = useState(false)
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc:"",
    productImg: [],
    brand: "",
    category: ""
  })

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setProductData((prev) => ({
      ...prev, [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);
    
    if(productData.productImg.length === 0){
      toast.error("Please select at least one image")
      return;
    }
    
    productData.productImg.forEach((img)=>{
      formData.append('files',img)
    })

    try {
      setLoading(true)
      const res = await apiClient.post(`/api/v1/product/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if(res.data.success){
        dispatch(setProducts([...products,res.data.product]))
        toast.success(res.data.message)
        setProductData({
          productName: "",
          productPrice: 0,
          productDesc:"",
          productImg: [],
          brand: "",
          category: ""
        })
      }
    } catch (error) {
      toast.error("Failed to add product")
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className='bg-background min-h-screen p-6'>
      <PageTransition>
        <div className="max-w-2xl mx-auto">
          <Card className='bg-card'>
            <CardHeader>
              <CardTitle className="text-foreground">Add New Product</CardTitle>
              <CardDescription>Enter product details to add to inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-4'>
                <div className="grid gap-2">
                  <Label>Product Name</Label>
                  <Input 
                  value={productData.productName}
                  onChange={handleChange} 
                  type='text' 
                  name='productName' 
                  placeholder='Ex-Iphone 15 Pro' 
                  required />
                </div>
                <div className="grid gap-2">
                  <Label>Price</Label>
                  <Input
                  value={productData.productPrice}
                  onChange={handleChange} 
                  type='number' name='productPrice' placeholder='0' required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Brand</Label>
                    <Input
                    value={productData.brand}
                  onChange={handleChange} 
                     type='text' name='brand' placeholder='Ex-Apple' required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input 
                    value={productData.category}
                  onChange={handleChange} 
                    type='text' name='category' placeholder='Ex-Mobile' required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className='flex items-center'>
                    <Label>Description</Label>
                  </div>
                    <Textarea 
                    value={productData.productDesc}
                  onChange={handleChange} 
                    name='productDesc' placeholder='Enter brief description of product' className="min-h-24" />
                  </div>
                  <ImageUpload productData={productData} setProductData={setProductData} />
              </div>
            </CardContent>
            <CardFooter className='flex gap-2'>
              <Button
              disabled={loading}
              onClick={submitHandler}
              className='flex-1'>{
                loading ? <span className='flex gap-1 items-center'> <Loader2 className='animate-spin'/> Adding... </span> : "Add Product"
              }</Button>
            </CardFooter>
          </Card>
        </div>
      </PageTransition>
    </div>
  )
}

export default AddProduct