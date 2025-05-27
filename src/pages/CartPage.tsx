import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { AppDispatch, RootState } from "@/app/store";
import { getCookie } from "@/utils/storageManager";
import type { User } from "@/features/auth/authTypes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Minus } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  fetchCartRequest,
  removeFromCartRequest,
  updateQuantityRequest,
} from "@/features/cart/cartSlice";
import { createOrderRequest, resetOrderStatus } from "@/features/order/orderSlice";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderStatus = useSelector((state: RootState) => state.order.status);
  const { items, loading, error } = useSelector((state: RootState) => state.cart);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const userCookie = getCookie("shop.user");
  const user: User | null = userCookie ? (JSON.parse(userCookie as string) as User) : null;

  useEffect(() => {
    dispatch(fetchCartRequest());
  }, [dispatch]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const incrementQty = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const item = items.find((item) => item.id === id);
    if (!item) return;

    dispatch(
      updateQuantityRequest({
        productId: id,
        quantity: item.quantity + 1,
      })
    );
  };

  const decrementQty = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const item = items.find((item) => item.id === id);
    if (!item) return;

    if (item.quantity > 1) {
      dispatch(
        updateQuantityRequest({
          productId: id,
          quantity: item.quantity - 1,
        })
      );
    } else {
      removeItem(e, id);
    }
  };

  const removeItem = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    dispatch(removeFromCartRequest(id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handlePlaceOrder = () => {
    if (!user) {
      return;
    }

    const selected = items.filter(
      (item) => item.id !== undefined && selectedItems.includes(item.id)
    );

    if (selected.length === 0) {
      return;
    }

    const orderPayload = {
      customerName: user.name,
      customerEmail: user.email,
      customerAddress: user.address || "",
      items: selected.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product?.price) || 0,
      })),
    };

    dispatch(createOrderRequest(orderPayload));
  };

  useEffect(() => {
    if (orderStatus === "success") {
      toast.success("Order placed successfully!");
      navigate("/orders");
      dispatch(resetOrderStatus());
    }
  }, [orderStatus, navigate, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <NavBar />

      <div className="container max-w-6xl mx-auto py-12 min-h-[70vh]">
        <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

        {loading ? (
          <p className="text-gray-500">Loading cart...</p>
        ) : error ? (
          <p className="text-red-500">Error loading cart: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {items?.length === 0 ? (
                <p className="text-gray-500">Your cart is currently empty.</p>
              ) : (
                items
                  ?.filter((item) => item.id !== undefined)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id!)}
                        onCheckedChange={() => toggleSelect(item.id!)}
                      />

                      <img
                        src={`http://localhost:3000${item.product?.image || ""}`}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₱{item.product?.price?.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={(e) => decrementQty(e, item.id!)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={(e) => incrementQty(e, item.id!)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={(e) => removeItem(e, item.id!)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))
              )}
            </div>

            {items.length > 0 && user && (
              <div className="space-y-6 border p-6 rounded-lg shadow-sm bg-white">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
                  <div>
                    <Label className="mb-2">Name</Label>
                    <Input value={user.name} readOnly />
                  </div>
                  <div>
                    <Label className="mb-2">Email</Label>
                    <Input value={user.email} readOnly />
                  </div>
                  <div>
                    <Label className="mb-2">Address</Label>
                    <Input value={user.address} readOnly />
                  </div>
                </div>
                <Button
                  className="w-full bg-black text-white hover:bg-black/90"
                  onClick={handlePlaceOrder}
                  disabled={selectedItems.length === 0}
                >
                  Place Order ({selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""})
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
