import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store"; // Adjust imports as per your setup
import { createProductRequest, resetSuccessStatus } from "@/features/product/productSlice";
import { fetchCategoriesRequest } from "@/features/category/categorySlice"; // Assuming you have this thunk/action
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

type ProductFormData = {
  name: string;
  image: File | null;
  price: string;
  discountedPrice: string;
  description: string;
  stock: string;
  categoryId: string;
};

const AddProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isSuccess = useSelector((state: RootState) => state.product.isSuccess);

  // Get categories from redux store
  const categories = useSelector((state: RootState) => state.category.items);
  const categoriesLoading = useSelector(
    (state: RootState) => state.category.loading
  );

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    image: null,
    price: "",
    discountedPrice: "",
    description: "",
    stock: "",
    categoryId: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories on mount if not already loaded
    if (!categories || categories.length === 0) {
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, categories]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("price", formData.price);
    data.append("discountedPrice", formData.discountedPrice);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    data.append("categoryId", formData.categoryId);

    dispatch(createProductRequest(data));
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

      <div className="container mx-auto max-w-6xl py-10">
        <div className="flex items-center gap-2 mb-8">
          <PlusCircle className="w-6 h-6 text-black" />
          <h1 className="text-2xl font-semibold">Add Product</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
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
            {previewUrl && (
              <div className="border rounded-md overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Fields */}
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
                onValueChange={handleCategoryChange}
                value={formData.categoryId}
                disabled={categoriesLoading}
              >
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue
                    placeholder={
                      categoriesLoading ? "Loading..." : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-category">
                      No categories available
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

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-black/90"
            >
              Submit Product
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddProductPage;
