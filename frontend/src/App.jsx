import React from "react";
import { Button } from "./components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/AdminLayout";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProduct from "./pages/admin/AdminProduct";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrder from "./pages/MyOrder";
import Wishlist from "./pages/Wishlist";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <> <Navbar/><Home/><Footer/> </> 
    },
    {
      path: "/signup",
      element: <> <Signup/> </> 
    },
    {
      path: "/login",
      element: <> <Login/> </> 
    },
    {
      path: "/verify",
      element: <> <Verify/> </> 
    },
    {
      path: "/verify/:token",
      element: <> <VerifyEmail/> </> 
    },
    {
      path: "/profile/:userId",
      element: <ProtectedRoute> <Navbar/><Profile/> </ProtectedRoute> 
    },
    {
      path: "/products",
      element: <> <Navbar/><Products/> </> 
    },
    {
      path: "/products/:id",
      element: <> <Navbar/><SingleProduct/> </> 
    },
    {
      path: "/cart",
      element: <ProtectedRoute> <Navbar/><Cart/> </ProtectedRoute> 
    },
    {
    path: "/address",
      element: <ProtectedRoute> <AddressForm/> </ProtectedRoute> 
    },
    {
    path: "/order-success",
      element: <ProtectedRoute> <OrderSuccess/> </ProtectedRoute> 
    },
    {
    path: "/wishlist",
      element:  <Wishlist/>
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminSales />,
        },
        {
          path: "sales",
          element: <AdminSales />,
        },
        {
          path: "add-product",
          element: <AddProduct />,
        },
        {
          path: "orders",
          element: <AdminOrders />,
        },
        {
          path: "products",
          element: <AdminProduct />,
        },
        {
          path: "users/orders/:userId",
          element: <ShowUserOrders />,
        },
        {
          path: "users",
          element: <AdminUsers />,
        },
        {
          path: "users/:id",
          element: <UserInfo />,
        },
      ],
    }
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
