// Wishlist page displays favorited products from persisted client state.

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { toggleWishlistItem } from "@/redux/productSlice";
import { HeartOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Wishlist view for the currently signed-in user, displaying saved products in a grid layout.
 * Allows removing items from wishlist and navigating to product details.
 * @returns {JSX.Element} The Wishlist component
 */
const Wishlist = () => {
  const { wishlist } = useSelector((store) => store.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRemove = (product) => {
    dispatch(toggleWishlistItem(product));
    toast.success("Item removed from wishlist");
  };

  if (!wishlist?.length) {
    return (
      <div className="bg-background min-h-screen">
        <PageTransition>
          <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">Your wishlist is empty</h1>
            <p className="mt-2 text-muted-foreground">
              Save products you like and find them quickly later.
            </p>
            <Button className="mt-5" onClick={() => navigate("/products")}>
              Browse products
            </Button>
          </div>
        </PageTransition>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <PageTransition>
        <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-10 pt-24">
          <h1 className="mb-6 text-2xl font-bold text-foreground">My Wishlist</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((product) => (
              <Card key={product._id} className="bg-card overflow-hidden p-3 shadow-sm">
                <img
                  src={product.productImg?.[0]?.url}
                  alt={product.productName}
                  className="aspect-square w-full cursor-pointer rounded-md object-cover"
                  onClick={() => navigate(`/products/${product._id}`)}
                />
                <h2 className="mt-3 line-clamp-2 font-semibold text-foreground">{product.productName}</h2>
                <p className="mt-1 font-bold text-foreground">₹{product.productPrice}</p>
                <Button
                  className="mt-3 w-full"
                  variant="outline"
                  onClick={() => handleRemove(product)}
                >
                  <HeartOff className="mr-2 h-4 w-4" /> Remove
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Wishlist;
