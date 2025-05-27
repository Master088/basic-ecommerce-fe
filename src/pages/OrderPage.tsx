// src/pages/OrderPage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchOrdersRequest,
  updateOrderRequest,
} from "@/features/order/orderSlice";
import type { Order } from "@/features/order/orderTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TopBar from "@/components/layout/TopBar";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

// Badge component with Tailwind CSS styles for different status variants
const Badge: React.FC<{
  variant?: "default" | "success" | "destructive" | "secondary" | "outline";
  children: React.ReactNode;
}> = ({ variant = "default", children }) => {
  const baseClass = "inline-flex items-center px-2 py-1 text-sm font-semibold rounded";

  const variantClass = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-300 text-gray-700",
    outline: "border border-gray-400 text-gray-600",
  }[variant];

  return <span className={`${baseClass} ${variantClass}`}>{children}</span>;
};

const OrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select orders and loading status from Redux store
  const { orders, loading } = useSelector((state: RootState) => state.order);

  // Get current logged-in user info from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch orders when component mounts
  useEffect(() => {
    dispatch(fetchOrdersRequest());
  }, [dispatch]);

  // Determine if user can cancel order based on order status
  const canUserCancel = (status: string) => ["pending", "processing"].includes(status);

  // Check if current user has admin role
  const isAdmin = user?.role === "admin";

  // Dispatch action to cancel an order
  const cancelOrder = (orderId: number) => {
    dispatch(updateOrderRequest({ id: orderId, status: "cancelled" }));
  };

  // Dispatch action to change order status (admin only)
  const changeOrderStatus = (orderId: number, newStatus: Order["status"]) => {
    dispatch(updateOrderRequest({ id: orderId, status: newStatus }));
  };

  // Map order status to badge variant styles
  const getBadgeVariant = (
    status: string
  ): "default" | "success" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "pending":
        return "outline";
      case "processing":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Possible statuses for admin status selector dropdown
  const allStatuses = ["pending", "processing", "completed", "cancelled"];

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Layout components */}
      <TopBar />
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 py-10 min-h-[70vh]">
        <h1 className="text-3xl font-semibold mb-8">My Orders</h1>

        {/* Loading indicator */}
        {loading ? (
          <p className="text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          // Show message if no orders exist
          <p className="text-muted-foreground">No orders found.</p>
        ) : (
          // List orders
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <Card key={order.id} className="shadow-sm border">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Order info */}
                    <div>
                      <h2 className="text-lg font-medium">Order #{order.id}</h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Status badge and action buttons/select */}
                    <div className="flex items-center gap-3">
                      <Badge variant={getBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>

                      {/* Cancel button for non-admin users if order is cancelable */}
                      {!isAdmin && canUserCancel(order.status) && (
                        <Button
                          variant="outline"
                          onClick={(event) => {
                            event.preventDefault();
                            cancelOrder(order.id);
                          }}
                          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Cancel Order
                        </Button>
                      )}

                      {/* Admin can change order status via dropdown */}
                      {isAdmin && (
                        <select
                          className="border rounded px-2 py-1"
                          value={order.status}
                          onChange={(event) => {
                            event.preventDefault();
                            changeOrderStatus(
                              order.id,
                              event.target.value as Order["status"]
                            );
                          }}
                        >
                          {allStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* List of ordered items */}
                  <div className="grid gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={`http://localhost:3000${
                            item.product?.image || "/placeholder.png"
                          }`}
                          alt="Product"
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">Product ID: {item.productId}</h3>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} &bull; ₱
                            {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderPage;
