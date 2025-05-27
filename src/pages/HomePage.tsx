import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Clock, ShoppingCart } from "lucide-react";

import type { AppDispatch, RootState } from "@/app/store";
import { fetchProductsRequest } from "@/features/product/productSlice";
import { fetchCategoriesRequest } from "@/features/category/categorySlice";
import { addToCartRequest } from "@/features/cart/cartSlice";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import bannerImg from "../assets/img/banner-img.png";
import bannerImg2 from "../assets/img/banner2.png";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCookie } from "@/utils/storageManager";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(3600);

  const categories = useSelector((state: RootState) => state.category.items);
  const products = useSelector((state: RootState) => state.product.list);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 3600 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchProductsRequest({ sort: "price_desc", categoryId: activeCategory }));
  }, [dispatch, activeCategory]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, categories]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const third = Math.ceil(products.length / 3);
  const flashSaleProducts = products.slice(0, third);
  const todaysProducts = products.slice(third, third * 2);
  const bestSellingProducts = products.slice(third * 2);

  const handleAddToCart = (id: number) => {
    const token = getCookie("shop.rfc7519");

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

    dispatch(addToCartRequest({ productId: id, quantity: 1 }));

    toast.success(`Added 1 x "${product.name}" to cart!`, {
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  const renderProductGrid = (list: typeof products) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {list.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer overflow-hidden rounded-md shadow-md flex flex-col h-[400px] pt-0"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <div className="h-[65%] w-full overflow-hidden">
            <img
              src={product.image ? `http://localhost:3000${product.image}` : bannerImg}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="relative flex flex-col justify-between h-[35%] p-4">
            <div>
              <h4 className="text-base font-semibold mb-1 truncate">{product.name}</h4>
              <p className="text-sm line-through text-gray-400">${product.price.toLocaleString()}</p>
              <p className="text-lg font-bold text-pink-600">
                ${product.discountedPrice?.toLocaleString() ?? "0"}
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
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <TopBar />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="w-full min-h-[80vh] bg-gradient-to-t from-black/5 flex items-center py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-[40%] text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold">
                Limited Time Offer! <span className="text-pink-600">Up to 50% OFF!</span>
              </h2>
              <p className="text-gray-600 mt-4 text-lg md:text-xl">Redefine Your Everyday Style</p>
              <button className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">
                Shop Now
              </button>
            </div>
            <div className="md:w-[60%] mt-6 md:mt-0">
              <img src={bannerImg} alt="Banner" className="w-full h-auto rounded-md" />
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <Tabs defaultValue="0" onValueChange={(val) => setActiveCategory(Number(val))}>
          <TabsList className="container mx-auto px-4 flex flex-wrap gap-6 justify-center items-center my-10 py-10 bg-gray-50">
            {[{ id: 0, name: "All Category" }, ...categories].map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id.toString()}
                className="flex justify-center items-center text-md px-8 py-4 rounded-md
                  data-[state=active]:bg-pink-600 data-[state=active]:text-white
                  hover:bg-pink-400 hover:text-white transition cursor-pointer"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Flash Sale */}
        <section className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center py-4 px-2">
            <h3 className="text-2xl font-semibold">Flash Sale</h3>
            <span className="flex items-center gap-2 text-lg font-bold text-white bg-pink-600 px-4 py-2 rounded-full shadow">
              <Clock size={20} />
              {formatTime(secondsLeft)}
            </span>
          </div>
          {renderProductGrid(flashSaleProducts)}
        </section>

        {/* Today's For You */}
        <section className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center py-4 px-2">
            <h3 className="text-2xl font-semibold">Today's For You</h3>
          </div>
          {renderProductGrid(todaysProducts)}
        </section>

        {/* Best Selling Store */}
        <section className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center py-4 px-2">
            <h3 className="text-2xl font-semibold">Best Selling Store</h3>
          </div>
          {renderProductGrid(bestSellingProducts)}
        </section>

        {/* Promotional Banner */}
        <div className="relative w-full h-100 md:h-100 bg-gray-800 overflow-hidden mt-12">
          <img
            src={bannerImg2}
            alt="Banner background"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4 px-4 text-center">
            <h2 className="text-white text-2xl md:text-4xl font-semibold italic">
              “Let’s Shop Beyond Boundaries”
            </h2>
            <button className="bg-white text-gray-900 font-semibold px-6 py-2 rounded-full hover:bg-pink-600 hover:text-white transition">
              Shop Now
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
