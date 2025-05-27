import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import TopBar from '@/components/layout/TopBar';
import NavBar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  fetchProductDetailRequest,

} from '@/features/product/productSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { toast } from 'sonner';
import { getCookie } from "@/utils/storageManager";
import { ShoppingCart, CheckCircle, XCircle, Info, Minus, Plus } from 'lucide-react';
import { addToCartRequest } from '@/features/cart/cartSlice';

export default function ProductDetailView() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const product = useSelector((state: RootState) => state.product.selected);
  const loading = useSelector((state: RootState) => state.product.loading);
  const error = useSelector((state: RootState) => state.product.error);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetailRequest(productId));
    }
  }, [dispatch, productId]);

  const handleAddToCart = (id: number) => {
    const token = getCookie('shop.rfc7519') || null;

    if (!token) {
      toast.warning('Please log in to add products to your cart.');
      navigate('/login');
      return;
    }

    dispatch(addToCartRequest({ productId: id, quantity }));
    toast.success(`Added ${quantity} x "${product?.name}" to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-center flex items-center justify-center gap-2 text-gray-600">
        <Info className="w-5 h-5 animate-spin" />
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 flex items-center justify-center gap-2">
        <XCircle className="w-5 h-5" />
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500 flex items-center justify-center gap-2">
        <XCircle className="w-5 h-5" />
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <NavBar />

      <div className="container mx-auto p-6 py-16 flex flex-col md:flex-row gap-6 min-h-[70vh]">
        {/* Left side - Image */}
        <div className="md:w-1/2 flex justify-center items-center border">
          <img
            src={`http://localhost:3000${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Right side - Details */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-2">
            {product.discountedPrice ? (
              <>
                <span className="text-xl font-semibold text-pink-600">
                  ${product.discountedPrice}
                </span>
                <span className="line-through text-gray-400">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-pink-600">
                ${product.price}
              </span>
            )}
          </div>

          <div className="mb-4 flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold">
                  In Stock: {product.stock}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity controls */}
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-16 text-center border rounded px-2 py-1"
              min={1}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            disabled={!product.stock}
            onClick={() => handleAddToCart(product.id)}
            className="mb-6 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
