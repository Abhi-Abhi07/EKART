import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderCard({userOrder}) {
    const navigate = useNavigate();
  return (
    <div className=" pr-20 flex flex-col gap-3 bg-card  text-card-foreground">
      <div className="w-full p-6">
        <div className="flex items-center gap-4 mb-6 ">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>
        {userOrder?.length === 0 ? (
          <p className="text-gray-800 space-y-6 text-2xl">
            No Orders found for this user
          </p>
        ) : (
          <div className="space-y-6 w-full">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="shadow-lg dark:shadow-background
                rounded-2xl p-5"
              >
                {/* order header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Order Id: <span className="text-gray-600">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {order.amount.toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* user Info */}
                <div className="flex justify-between items-center">
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.firstName || "Unknown"}{" "}
                      {order.user?.lastName}{" "}
                    </p>
                    <p>Email: {order.user?.email || "N/A"}</p>
                  </div>
                  <span
                    className={`${order.status === "Paid" ? "bg-green-500" : order.status === "Failed" ? "bg-gray-500" : "bg-orange-300"} text-white px-2 py-1 rounded-lg `}
                  >
                    {order.status}
                  </span>
                </div>

                {/* products */}
                <div className='' >
                  <h3 className="font-medium mb-2 ">products</h3>
                  <ul className="space-y-2  bg-card text-card-foreground">
                    {order.products.map((product, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center  p-3 rounded-lg "
                      >
                        <img
                          onClick={() =>
                            navigate(`/products/${product.productId?._id}`)
                          }
                          className="w-16 cursor-pointer"
                          src={product.productId?.productImg?.[0].url}
                          alt=""
                        />
                        <span className="w-[300px] line-clamp-2">
                          {product.productId?.productName}
                        </span>
                        <span>{product?.productId?._id}</span>
                        <span className="font-medium">
                          ₹{product.productId?.productPrice}x{" "}
                          {product.quantity}{" "}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCard