import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/services/apiClient";

function AddressForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  //   console.log(cart)

  const handlePayment = async () => {
    try {
      const { data } = await apiClient.post(
        `/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
      );

      if (!data.success) {
        return toast.error("Something went wrong");
      }

      console.log("Razorpay data : ", data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id, // order id from backend
        name: "Ekart",
        description: "Order Payment",
        handler: async (response) => {
          try {
            const verifyRes = await apiClient.post(
              `/api/v1/orders/verify-payment`,
              response,
            );

            if (verifyRes.data.success) {
              toast.success("✅ Payment successfull !");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("❌ Payment verification failed");
            }
          } catch (error) {
            console.error(error)
            toast.error("Error verifying payment");
          }
        },
        model: {
          ondismiss: async function () {
            // handle user closing the popup
            try {
              await apiClient.post(
                `/api/v1/orders/verify-payment`,
                {
                  razorpay_order_id: data.order.id,
                  paymentFailed: true,
                },
              );
            } catch (error) {
              console.error("Error updating payment status on dismiss:", error);
            }
            toast.error("Payment Cancelled or Failed");
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#F47286" },
      };

      const rzp = new window.Razorpay(options);

      // listen for payment failures
      rzp.on("payment.failed", async function () {
        try {
          await apiClient.post(
            `/api/v1/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
          );
        } catch (error) {
          console.error("Error updating payment status on failure:", error);
        }
        toast.error("Payment Failed. Please try again");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid place-items-center pt-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-6xl mx-auto">
        <div className="space-y-4 p-6 bg-white">
          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 6789012345"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 street, Area"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Kolkata"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="West Bengal"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipcode">Zip Code</Label>
                  <Input
                    id="zipcode"
                    name="zipcode"
                    required
                    placeholder="236766"
                    value={formData.zipcode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="India"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((add, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => dispatch(setSelectedAddress(index))}
                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}
                  >
                    <p className="font-medium ">{add.fullName}</p>
                    <p>{add.phone}</p>
                    <p>{add.email}</p>
                    <p>
                      {add.address}, {add.city}, {add.state}, {add.zipcode},{" "}
                      {add.country}
                    </p>
                    <button
                      onClick={() => dispatch(deleteAddress(index))}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}

              <Button
                variant="outline"
                className={"w-full"}
                onClick={() => setShowForm(true)}
              >
                + Add New Address
              </Button>
              <Button
                onClick={handlePayment}
                disabled={selectedAddress === null}
                className="w-full bg-pink-600 cursor-pointer hover:bg-black"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>
        {/* Right side order summary */}
        <div>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bol text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free shipping on orders over 299</p>
                <p>* 30-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
