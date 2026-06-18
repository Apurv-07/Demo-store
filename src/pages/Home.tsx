import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";
import { ProductService } from "../services/product.service";
import { Product, Category } from "../types";
import { ProductGridSkeleton } from "../components/SkeletonLoaders";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories and initial products
    const loadHomeData = async () => {
      try {
        setIsLoadingCats(true);
        setIsLoadingProducts(true);

        const [cats, productsRes] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getProducts({ limit: 8 })
        ]);

        // Limit to first 10 popular categories for cleaner layout
        setCategories(cats.slice(0, 10));
        setFeaturedProducts(productsRes.products);
      } catch (err) {
        console.error("Home data fetch failed", err);
        setErrorHeader("Unable to load latest items. Please check your network connectivity.");
      } finally {
        setIsLoadingCats(false);
        setIsLoadingProducts(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white rounded-3xl overflow-hidden py-16 sm:py-24 px-6 sm:px-12 lg:px-16 shadow-xl">
        {/* Subtle geometric grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 tracking-wide uppercase">
            <Sparkles size={14} className="text-amber-400" />
            <span>Introducing DummyJSON Premium Line</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight">
            Crafted Elegance. <br />
            <span className="text-slate-400 font-medium">Engineered for perfection.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Discover a tailored ecosystem of curated lifestyle commodities, professional electronics, and sensory beauty. Seamless, real-time dispatch from state-of-the-art transit nodes.
          </p>

          {/* Search container */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-lg mt-4">
            <div className="relative flex items-center p-1.5 bg-white rounded-2xl shadow-lg border border-gray-100">
              <span className="pl-4 pr-2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search thousands of handpicked physical goods..."
                className="w-full bg-transparent text-gray-900 border-none outline-none text-xs placeholder-gray-400 py-3 block focus:ring-0 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl tracking-wide transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Trending suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="text-xs text-slate-400 font-medium font-sans">Trending topics:</span>
            {["Fragrances", "Laptops", "Groceries", "Skincare"].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/products?search=${item}`)}
                className="px-3.5 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/40 transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Top Banner Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Truck size={20} className="text-slate-900" />,
            title: "Secured Express Shipping",
            desc: "Complimentary global distribution on orders exceeding $150. Sealed custom delivery grids."
          },
          {
            icon: <RefreshCw size={20} className="text-slate-900" />,
            title: "Complimentary 30-Day Returns",
            desc: "Uncompromising satisfaction assurance. Return items with our pre-paid parcel labels."
          },
          {
            icon: <ShieldCheck size={20} className="text-slate-900" />,
            title: "Quality Inspection Vouched",
            desc: "Every item qualifies through meticulous laboratory assurance testing before dispatch."
          }
        ].map((feat, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
          >
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {feat.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{feat.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Category Carousel Quick links */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Eminent Categories</h2>
            <p className="text-xs text-gray-400">Sectionalized indexes representing standard industrial classification</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-gray-900 hover:text-gray-700 flex items-center space-x-1 hover:underline transition-colors group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoadingCats ? (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 animate-pulse rounded-full w-28 flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-900 hover:bg-gray-50 rounded-full text-xs font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap transition-all shadow-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Deals Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Today's Trending Acquisitions</h2>
            <p className="text-xs text-gray-400">Synchronized item rankings loaded dynamically from live registries</p>
          </div>
        </div>

        {errorHeader && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 text-center font-sans">
            {errorHeader}
          </div>
        )}

        {isLoadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const discountedPrice = product.price * (1 - product.discountPercentage / 100);
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Thumbnail Cover wrap */}
                  <div className="relative aspect-square w-full bg-gray-50/70 p-6 flex items-center justify-center overflow-hidden border-b border-gray-50">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Discount badge */}
                    {product.discountPercentage > 0 && (
                      <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 select-none uppercase tracking-wider">
                        Save {Math.round(product.discountPercentage)}%
                      </span>
                    )}

                    {/* Stock Warning badge */}
                    {product.stock <= 5 && (
                      <span className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded text-[9.5px] font-bold bg-amber-50 text-amber-700 border border-amber-100 select-none">
                        Only {product.stock} Left
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand and Category row */}
                      <div className="flex items-center space-x-1.5 text-[9.5px] font-bold tracking-wider text-gray-400 uppercase mb-2">
                        <span>{product.brand || "Eminent"}</span>
                        <span>•</span>
                        <span className="text-gray-500">{product.category}</span>
                      </div>

                      {/* Heading */}
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-slate-800 line-clamp-1 leading-snug">
                        {product.title}
                      </h3>

                      {/* Explanatory description summary snippet */}
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 space-y-3">
                      {/* Rating details */}
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star size={13} fill="currentColor" />
                        <span className="text-[11.5px] font-bold font-mono text-gray-800">{product.rating.toFixed(2)}</span>
                        <span className="text-[11px] text-gray-400">({product.reviews?.length || 0} audits)</span>
                      </div>

                      {/* Pricing row */}
                      <div className="flex items-baseline justify-between pt-1 border-t border-gray-50">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-sm font-bold font-mono text-gray-900">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          {product.discountPercentage > 0 && (
                            <span className="text-xs text-gray-400 line-through font-mono">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-semibold text-gray-900 group-hover:underline transition-all">
                          Inspect Account Detail &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
