// Primary navigation with auth actions, cart badge, and theme toggle.

import { Heart, Menu, ShoppingCart, LogOut } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { apiClient } from "@/services/apiClient";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Main navigation bar with links, cart/wishlist badges, theme toggle, and authentication.
 * Responsive design with mobile menu drawer.
 * @returns {JSX.Element} The Navbar component
 */
function Navbar() {
  const { user } = useSelector((store) => store.user);
  const { cart, wishlist } = useSelector((store) => store.product);
  const admin = user?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await apiClient.post("/api/v1/user/logout", {});
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Token expired, logged out locally");
    } finally {
      dispatch(setUser(null));
      localStorage.removeItem("accessToken");
      navigate("/login");
      setIsMobileOpen(false);
    }
  };

  return (
    <header className="fixed z-20 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/Ekart.png" alt="Ekart Logo" className="w-24 h-auto" />
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex flex-1 justify-center">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-foreground hover:text-primary transition"> 
              <li>Home</li> 
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition"> 
              <li>Products</li> 
            </Link>
            <Link to="/wishlist" className="text-foreground hover:text-primary transition"> 
              <li>Wishlist</li> 
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`} className="text-foreground hover:text-primary transition"> 
                <li>Hi, {user.firstName}</li> 
              </Link>
            )}
            {admin && (
              <Link to="/dashboard/sales" className="text-foreground hover:text-primary transition"> 
                <li>Dashboard</li> 
              </Link>
            )}
          </ul>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/wishlist" className="relative p-2 hover:bg-muted rounded-lg transition">
            <Heart className="w-5 h-5 text-foreground" />
            {wishlist?.length > 0 && (
              <span className="absolute -right-1 -top-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 hover:bg-muted rounded-lg transition">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cart?.items?.length > 0 && (
              <span className="absolute -right-1 -top-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {user ? (
            <Button onClick={logoutHandler} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} size="sm">
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 py-3 text-sm font-medium">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/wishlist" 
              className="text-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Wishlist</span>
              {wishlist?.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="text-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted flex items-center justify-between"
              onClick={() => setIsMobileOpen(false)}
            >
              <span>Cart</span>
              {cart?.items?.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>
            {user && (
              <Link 
                to={`/profile/${user._id}`} 
                className="text-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMobileOpen(false)}
              >
                Profile
              </Link>
            )}
            {admin && (
              <Link 
                to="/dashboard/sales" 
                className="text-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="border-t border-border pt-3 mt-3 flex gap-2">
              {user ? (
                <Button 
                  onClick={logoutHandler} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    navigate("/login");
                    setIsMobileOpen(false);
                  }} 
                  size="sm"
                  className="flex-1"
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
