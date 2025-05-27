import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { AppDispatch, RootState } from "@/app/store";
import { fetchCategoriesRequest } from "@/features/category/categorySlice";
import {
  fetchProductDetailRequest,
  resetSuccessStatus,
  updateProductRequest,
} from "@/features/product/productSlice";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/layout/TopBar";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Pencil } from "lucide-react";

// Types
type ProductForm = {
  name: string;
  price: string;
  discountedPrice: string;
  stock: string;
  description: string;
  categoryId: string;
  image?: File | null;
};

const EditProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: productId } = useParams<{ id: string }>();

  const categories = useSelector((state: RootState) => state.category.items);
  const categoriesLoading = useSelector((state: RootState) => state.category.loading);
  const product = useSelector((state: RootState) => state.product.selected);
 
  const navigate = useNavigate();

  const isSuccess = useSelector((state: RootState) => state.product.isSuccess);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: "",
    discountedPrice: "",
    stock: "",
    description: "",
    categoryId: "",
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch categories if not loaded
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, categories.length]);

  // Fetch product details by ID
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetailRequest(parseInt(productId, 10)));
    }
  }, [dispatch, productId]);

  // Populate form when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: String(product.price ?? ""),
        discountedPrice: String(product.discountedPrice ?? ""),
        stock: String(product.stock ?? ""),
        description: product.description || "",
        categoryId: String(product.categoryId ?? ""),
        image: null,
      });
      setPreviewUrl(null); // reset preview when product loads
    }
  }, [product]);

  // Handle input changes (including file input)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  // Submit updated product data
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productId) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("discountedPrice", formData.discountedPrice);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    data.append("categoryId", formData.categoryId);

    if (formData.image) {
      data.append("image", formData.image);
    }

    dispatch(updateProductRequest({ id: parseInt(productId, 10), data }));
  };

  
    useEffect(() => {
      if (isSuccess) {
        navigate("/products");
        dispatch(resetSuccessStatus()); // this is the action creator
      }
    }, [isSuccess, dispatch, navigate]);
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <NavBar />

      <main className="container mx-auto max-w-6xl py-10">
        <header className="flex items-center gap-2 mb-8">
          <Pencil className="w-6 h-6 text-black" />
          <h1 className="text-2xl font-semibold">Edit Product</h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload */}
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            {/* Image Preview */}
            {previewUrl ? (
              <div className="border rounded-md overflow-hidden">
                <img
                  src={previewUrl}
                  alt="New Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            ) : product?.image ? (
              <div className="border rounded-md overflow-hidden">
                <img
                  src={`http://localhost:3000${product.image}`}
                  alt="Current"
                  className="w-full h-64 object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="discountedPrice">Discounted Price</Label>
              <Input
                id="discountedPrice"
                name="discountedPrice"
                type="number"
                value={formData.discountedPrice}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleCategoryChange}
                disabled={categoriesLoading}
              >
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue
                    placeholder={categoriesLoading ? "Loading..." : "Select a category"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      No categories found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2 grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="bg-black text-white hover:bg-black/90">
              Save Changes
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditProductPage;
