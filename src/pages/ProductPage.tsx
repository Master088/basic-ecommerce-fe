import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import TopBar from "@/components/layout/TopBar";
import NavBar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Search,
  Plus,
  Filter,
  Tag,
  DollarSign,
  CheckCircle,
  Boxes,
  ShoppingCart,
  Edit2,
  Trash2,
} from "lucide-react";

import {
  deleteProductRequest,
  fetchProductsRequest,
} from "@/features/product/productSlice";
import { fetchCategoriesRequest } from "@/features/category/categorySlice";

import type { RootState } from "@/app/store";
import type { AppDispatch } from "@/app/store";
import { toast } from "sonner";
import { addToCartRequest } from "@/features/cart/cartSlice";
import { getCookie } from "@/utils/storageManager";
import type { User } from "@/features/auth/authTypes";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userCookie = getCookie("shop.user");
  const token = getCookie("shop.rfc7519") || null;
  const user = userCookie ? (JSON.parse(userCookie) as User) : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [hasStock, setHasStock] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const categories = useSelector((state: RootState) => state.category.items);
  const products = useSelector((state: RootState) => state.product.list);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((c) => c.id));
    }
  };

  const allCategoriesSelected =
    categories.length > 0 && selectedCategories.length === categories.length;

  useEffect(() => {
    dispatch(
      fetchProductsRequest({
        sort: "price_desc",
        search: searchTerm.trim(),
        categoryIds: selectedCategories,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        inStock: hasStock,
      })
    );
  }, [dispatch, searchTerm, selectedCategories, priceRange, hasStock]);

  useEffect(() => {
    if (!categories?.length) {
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, categories]);

  const openDeleteModal = (id: number) => {
    setDeleteProductId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteProductId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteProductId !== null) {
      // Dispatch delete action here
      console.log("Delete product with id:", deleteProductId);
      dispatch(deleteProductRequest(deleteProductId));

      // TODO: dispatch(deleteProductRequest(deleteProductId));
      // For now just close modal
      closeDeleteModal();
    }
  };

  const handleAddToCart = (id: number) => {
    const token = getCookie("shop.rfc7519") || null;

    if (!token) {
      toast.warning("Please log in to add products to your cart.");
      navigate("/login");
      return;
    }

    const product = products.find((p) => p.id === id);
    if (!product) {
      toast.error("Product not found.");
      return;
    }

    const quantity: number = 1;

    dispatch(addToCartRequest({ productId: id, quantity }));

    toast.success(`Added ${quantity} x "${product.name}" to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <NavBar />

      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r px-6 py-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </h2>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-gray-700">
              <Tag className="w-4 h-4" /> Categories
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <Checkbox
                id="all-categories"
                checked={allCategoriesSelected}
                onCheckedChange={toggleAllCategories}
              />
              <Label htmlFor="all-categories" className="font-semibold">
                All Categories
              </Label>
            </div>

            <div className="space-y-2 max-h-64 overflow-auto">
              {categories.map((category) => (
                <div className="flex items-center gap-2" key={category.id}>
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="capitalize"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-gray-700">
              <DollarSign className="w-4 h-4" /> Price Range
            </h3>
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={(val: [number, number]) => setPriceRange(val)}
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="hasStock"
              checked={hasStock}
              onCheckedChange={(val) => setHasStock(Boolean(val))}
            />
            <Label htmlFor="hasStock" className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              In Stock Only
            </Label>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
            {token && user?.role === "admin" && (
              <Link to="/product/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <Boxes className="w-12 h-12 mx-auto mb-4" />
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {products.map((product) => {
                const { id, name, price, discountedPrice, image } = product;

                return (
                  <Card
                    key={id}
                    className="cursor-pointer overflow-hidden rounded-md shadow-md flex flex-col h-[400px] pt-0 relative"
                    onClick={() => navigate(`/product/${id}`)}
                  >
                    {/* Edit/Delete buttons */}

                    {token && user?.role === "admin" && (
                      <div
                        className="absolute top-2 right-2 flex gap-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          aria-label={`Edit ${name}`}
                          onClick={() => navigate(`/product/${id}/edit`)}
                          className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          aria-label={`Delete ${name}`}
                          onClick={() => openDeleteModal(id)}
                          className="p-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    <div className="h-[65%] w-full overflow-hidden">
                      <img
                        src={
                          image
                            ? `http://localhost:3000${image}`
                            : "/placeholder.jpg"
                        }
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="relative flex flex-col justify-between h-[35%] p-4">
                      <div>
                        <h4 className="text-base font-semibold mb-1 truncate">
                          {name}
                        </h4>
                        <p className="text-sm line-through text-gray-400">
                          ${price?.toLocaleString() ?? "0"}
                        </p>
                        <p className="text-lg font-bold text-pink-600">
                          ${discountedPrice?.toLocaleString() ?? "0"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
