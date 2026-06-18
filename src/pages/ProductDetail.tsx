import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Cpu,
  Bookmark,
  Calendar,
  User as UserIcon, CheckCircle2
} from "lucide-react";
import { ProductService } from "../services/product.service";
import { Product } from "../types";
import { useAppDispatch } from "../store/hooks";
import { addToCart, setCartOpen } from "../store/slices/cartSlice";
import { ProductDetailSkeleton } from "../components/SkeletonLoaders";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");
  const [addedNotify, setAddedNotify] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setErrorText(null);
        const data = await ProductService.getProductById(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage(data.thumbnail);
        }
      } catch (err) {
        console.error("Failed to load product detail content", err);
        setErrorText("This product record is currently unavailable or doesn't exist in our DummyJSON datastore.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleQtyChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCartDetails = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    setAddedNotify(true);
    setTimeout(() => {
      setAddedNotify(false);
    }, 2500);
    // Auto slide over cart drawer for exceptional responsive UX
    setTimeout(() => {
      dispatch(setCartOpen(true));
    }, 150);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (errorText || !product) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5">
        <div className="p-4 bg-gray-50 border border-gray-100 inline-block text-gray-400 rounded-3xl mx-auto">
          <Cpu size={36} className="text-gray-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">Product registry failed</h2>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-sans">{errorText || "Invalid dynamic parameter requested."}</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl"
        >
          <ArrowLeft size={14} />
          <span>Return to Catalog Index</span>
        </Link>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const savingsAmount = product.price - discountedPrice;

  return (
    <div className="space-y-8 pb-16">
      {/* Return Navigation and Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-2 text-xs text-gray-400 font-sans">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-900 transition-colors">Catalog</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="capitalize hover:text-gray-900 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[160px] sm:max-w-none">{product.title}</span>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Exit to Full Directory</span>
        </Link>
      </div>

      {/* Main product showcase split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Gallery Panel */}
        <div className="space-y-4">
          {/* Main Frame showcase */}
          <div className="aspect-square bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center p-8 group relative">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 max-h-[420px]"
              referrerPolicy="no-referrer"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-6 left-6 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 select-none uppercase tracking-wider shadow-sm">
                -{Math.round(product.discountPercentage)}% Off
              </span>
            )}
            
            {product.stock <= 5 && (
              <span className="absolute top-6 right-6 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 select-none">
                Understocked: Only {product.stock} items left
              </span>
            )}
          </div>

          {/* Sub Images selector carousels */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-white border rounded-2xl overflow-hidden p-2 flex items-center justify-center transition-all ${
                    selectedImage === imgUrl
                      ? "border-slate-900 ring-2 ring-slate-900/10"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} - ${index + 1}`}
                    className="h-full w-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specs and checkout information */}
        <div className="flex flex-col space-y-6 lg:py-2">
          {/* Categorization details heading */}
          <div className="space-y-2 text-left">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-widest text-slate-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full uppercase">
              <Bookmark size={11} className="text-slate-400" />
              <span>{product.brand || "DummyJSON"}</span>
              <span>•</span>
              <span>{product.category}</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Subrating details indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                    className={i < Math.round(product.rating) ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs font-bold font-mono text-gray-800">{product.rating.toFixed(2)}</span>
              <span className="text-xs text-gray-400">({product.reviews?.length || 0} peer-reviewed audits)</span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-500 font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Price container display */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">Negotiated Price</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 leading-none">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.discountPercentage > 0 && (
              <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs py-2 px-3.5 rounded-xl block font-sans">
                <span className="font-semibold block sm:inline">Active Campaign Savings: </span>
                <span className="font-bold font-mono text-rose-700">${savingsAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Description snippet */}
          <div className="text-left space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Overview / Abstract</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans mt-1">
              {product.description}
            </p>
          </div>

          {/* Selector Quantity and Add action buttons */}
          <div className="pt-6 border-t border-gray-100 text-left space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-1.5 min-w-[130px]">
                <button
                  type="button"
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
                  onClick={() => handleQtyChange(-1)}
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 font-mono font-bold text-xs text-gray-800">{quantity}</span>
                <button
                  type="button"
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer"
                  onClick={() => handleQtyChange(1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to checkout cart */}
              <button
                type="button"
                className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all shadow-md  flex items-center justify-center space-x-2 group cursor-pointer"
                onClick={handleAddToCartDetails}
              >
                <ShoppingBag size={15} />
                <span>Place in Secured Cart</span>
              </button>
            </div>

            {/* Notification Toast Confirmation */}
            {addedNotify && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center space-x-2.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="font-sans font-semibold">Processed: {quantity} items cataloged successfully to cart!</span>
              </div>
            )}
          </div>

          {/* Secondary guarantee lines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-left">
            <div className="flex items-center space-x-2.5 text-xs text-gray-500 font-sans">
              <Truck size={16} className="text-gray-400" />
              <span>{product.shippingInformation || "Priority Transit"}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-gray-500 font-sans">
              <ShieldCheck size={16} className="text-gray-400" />
              <span>{product.warrantyInformation || "1 Year Warranty"}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-gray-500 font-sans">
              <RotateCcw size={16} className="text-gray-400" />
              <span>{product.returnPolicy || "30 Days Returns"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs segment: Detailed technical specifications & Audits reviews */}
      <div className="pt-10 border-t border-gray-100 text-left">
        {/* Toggle Headings */}
        <div className="flex space-x-6 border-b border-gray-100 pb-px">
          {[
            { id: "specs", name: "Technical Specifications" },
            { id: "reviews", name: `Customer Reviews (${product.reviews?.length || 0})` }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`pb-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="py-6 font-sans">
          {activeTab === "specs" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl text-xs">
              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-gray-900">Physical Metrics</h4>
                <div className="grid grid-cols-2 gap-y-2 border-t border-gray-100 pt-2.5 text-gray-500">
                  <span>Width dimension</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.dimensions?.width?.toFixed(2) || "N/A"} cm</span>
                  <span>Height dimension</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.dimensions?.height?.toFixed(2) || "N/A"} cm</span>
                  <span>Depth dimensions</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.dimensions?.depth?.toFixed(2) || "N/A"} cm</span>
                  <span>Net weight mass</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.weight || "N/A"} kg</span>
                </div>
              </div>

              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-gray-900">Operational Legals</h4>
                <div className="grid grid-cols-2 gap-y-2 border-t border-gray-100 pt-2.5 text-gray-500">
                  <span>Stock Available</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.stock} units</span>
                  <span>Min order quantity</span>
                  <span className="font-mono text-indigo-600 font-bold">{product.minimumOrderQuantity || 1} unit(s)</span>
                  <span>SKU reference No</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.sku}</span>
                  <span>Return restrictions</span>
                  <span className="font-mono text-gray-900 font-semibold">{product.returnPolicy}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl text-xs">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.reviews.map((rev, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-100 p-5 rounded-2xl space-y-3 shadow-sm hover:border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-gray-50 rounded-lg text-slate-800">
                            <UserIcon size={12} />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{rev.reviewerName}</span>
                            <span className="text-[10px] text-gray-400 block">{rev.reviewerEmail}</span>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                          <Calendar size={11} /> {new Date(rev.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            fill={i < rev.rating ? "currentColor" : "none"}
                            className={i < rev.rating ? "" : "text-gray-300"}
                          />
                        ))}
                      </div>

                      <p className="text-gray-600 leading-relaxed italic pr-2">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 italic">
                  This catalog listing currently has no associated customer audits.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
