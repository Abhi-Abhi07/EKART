import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Loader2, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setProducts } from "@/redux/productSlice";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiClient } from "@/services/apiClient";

/**
 * Admin page for managing products: view, edit, delete, and search products.
 * Displays a list of products with edit and delete actions in dialogs.
 * @returns {JSX.Element} The AdminProduct component
 */
function AdminProduct() {
  const { products } = useSelector((store) => store.product);
  const [editProduct, setEditProduct] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder,setSortOrder] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openEditDialog = (product) => {
    setEditProduct({
      ...product,
      productImg: Array.isArray(product.productImg) ? product.productImg : [],
    });
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productDesc", editProduct.productDesc);
    formData.append("category", editProduct.category);
    formData.append("brand", editProduct.brand);

    // Add existing images public_ids
    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    // Add new files
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("files", file);
      });

    try {
      setLoading(true);
      const res = await apiClient.put(
        `/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );
        dispatch(setProducts(updateProducts));
        setOpen(false);
        toast.success("Product updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await apiClient.delete(
        `/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProducts(remainingProducts));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
    }
  };

  let filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if(sortOrder === 'lowToHigh'){
  filteredProducts = [...filteredProducts].sort((a,b) => a.productPrice - b.productPrice)
  }

  if(sortOrder === 'highToLow'){
  filteredProducts = [...filteredProducts].sort((a,b) => b.productPrice - a.productPrice)
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <PageTransition>
        <div className="flex justify-between mb-6">
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search Product..."
              className="w-[400px] items-center bg-card"
            />
            <Search className="absolute right-3 top-1.5 text-muted-foreground" />
          </div>
          <Select onValueChange={(value)=>setSortOrder(value)}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            return (
              <Card key={product._id} className="bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        product.productImg?.[0]?.url ||
                        "https://via.placeholder.com/100"
                      }
                      alt=""
                      className="w-25 h-25 rounded-md object-cover"
                    />
                    <h1 className="font-bold w-96 text-foreground">
                      {product.productName}
                    </h1>
                  </div>
                  <h1 className="font-semibold text-foreground">
                    ₹{product.productPrice}
                  </h1>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="text-primary" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the product from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProductHandler(product._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </PageTransition>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[740px] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                value={editProduct?.productName ?? ""}
                onChange={handleChange}
                name="productName"
                required
                type="text"
                placeholder="Ex-Iphone"
              />
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                value={editProduct?.productPrice ?? ""}
                onChange={handleChange}
                name="productPrice"
                required
                type="number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  value={editProduct?.brand ?? ""}
                  onChange={handleChange}
                  name="brand"
                  required
                  type="text"
                  placeholder="Ex-apple"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  value={editProduct?.category ?? ""}
                  onChange={handleChange}
                  name="category"
                  required
                  type="text"
                  placeholder="Ex-mobile"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label>Description</Label>
              </div>
              <Textarea
                value={editProduct?.productDesc ?? ""}
                onChange={handleChange}
                name="productDesc"
                placeholder="Enter brief description of product"
                className="h-[200px]"
              />
            </div>
            <ImageUpload
              productData={editProduct}
              setProductData={setEditProduct}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} type="submit">
              {loading ? (
                <span className="flex gap-1 items-center">
                  <Loader2 className="animate-spin" /> Please wait
                </span>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminProduct;
