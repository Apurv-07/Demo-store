import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, Star, X, Check, ArrowUpDown } from "lucide-react";
import { ProductService } from "../services/product.service";
import { Product, Category } from "../types";
import { ProductGridSkeleton } from "../components/SkeletonLoaders";

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get("search") || "";
  const categoryParamQuery = searchParams.get("category") || "";

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Filters & sorting state
  const [searchVal, setSearchVal] = useState(searchParamQuery);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [priceRange, setPriceRange] = useState<number>(1000); // Max dynamic slider
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync search input box with URL parameter
  useEffect(() => {
    setSearchVal(searchParamQuery);
  }, [searchParamQuery]);

  // Load category sidebar lookup list
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCats(true);
        const cats = await ProductService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Categories lookup failure", err);
      } finally {
        setIsLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  // Primary product fetcher koordinating Search and Categories
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setIsLoading(true);
        setErrorText(null);

        let data: Product[] = [];

        if (categoryParamQuery) {
          // Fetch products in category
          const categoryRes = await ProductService.getProductsByCategory(categoryParamQuery);
          data = categoryRes.products;

          // Double filter by search text client-side if a search param is also supplied
          if (searchParamQuery) {
            const queryClean = searchParamQuery.toLowerCase();
            data = data.filter(
              (p) =>
                p.title.toLowerCase().includes(queryClean) ||
                p.description.toLowerCase().includes(queryClean) ||
                (p.brand && p.brand.toLowerCase().includes(queryClean))
            );
          }
        } else if (searchParamQuery) {
          // Fetch across full search indexes
          const searchRes = await ProductService.searchProducts(searchParamQuery);
          data = searchRes.products;
        } else {
          // Default load first 30 products
          const productsRes = await ProductService.getProducts({ limit: 40 });
          data = productsRes.products;
        }

        setProducts(data);
      } catch (err) {
        console.error("Catalog load failed", err);
        setErrorText("Encountered connection refusal with DummyJSON database. Please retry shortly.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParamQuery, categoryParamQuery]);

  const handleSearchKeyPress = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedParams = new URLSearchParams(searchParams);
    if (searchVal.trim()) {
      updatedParams.set("search", searchVal.trim());
    } else {
      updatedParams.delete("search");
    }
    setSearchParams(updatedParams);
  };

  const handleSelectCategory = (slug: string | null) => {
    const updatedParams = new URLSearchParams(searchParams);
    if (slug) {
      updatedParams.set("category", slug);
    } else {
      updatedParams.delete("category");
    }
    setSearchParams(updatedParams);
    setShowFiltersMobile(false);
  };

  const handleClearAllFilters = () => {
    setSearchParams({});
    setSearchVal("");
    setSortBy("recommended");
    setPriceRange(1000);
    setMinRating(0);
  };

  // Compute maximum pricing boundary based on current selection to keep price slider dynamic
  const maxProductPriceFound = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 1000;

  // client-side sorting & secondary sliders logic
  const processedProducts = products
    .filter((p) => {
      const actualPrice = p.price * (1 - p.discountPercentage / 100);
      return actualPrice <= priceRange && p.rating >= minRating;
    })
    .sort((a, b) => {
      const priceA = a.price * (1 - a.discountPercentage / 100);
      const priceB = b.price * (1 - b.discountPercentage / 100);

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "rating":
          return b.rating - a.rating;
        case "name-asc":
          return a.title.localeCompare(b.title);
        default:
          return 0; // Default matches API raw rankings
      }
    });

  return (
    <div className="space-y-8 pb-16">
      {/* Search Header and filters description banner */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">E-Commerce Catalog</h1>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            {categoryParamQuery ? (
              <span>
                Browsing index <span className="font-semibold text-gray-800">"{categoryParamQuery}"</span>
              </span>
            ) : (
              "Browse full catalog with real time filter parameters"
            )}
            {" • "}
            <span>{processedProducts.length} items verified</span>
          </p>
        </div>

        {/* Global Search form */}
        <form onSubmit={handleSearchKeyPress} className="w-full md:max-w-xs">
          <div className="relative flex items-center bg-white border border-gray-200 focus-within:border-gray-900 rounded-xl p-0.5 transition-colors">
            <span className="pl-3 text-gray-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search category assets..."
              className="w-full bg-transparent text-xs py-2 px-2.5 outline-none text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            {searchVal && (
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer"
                onClick={() => {
                  setSearchVal("");
                  const updatedParams = new URLSearchParams(searchParams);
                  updatedParams.delete("search");
                  setSearchParams(updatedParams);
                }}
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[11px] rounded-lg tracking-wide cursor-pointer"
            >
              Go
            </button>
          </div>
        </form>
      </div>

      {/* Main body: filters col and goods grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Toggleable sidebar for mobile, sticky block sidebar on Desktop */}
        <aside
          className={`lg:col-span-1 bg-white border border-gray-100 p-6 rounded-2xl space-y-7 static shadow-sm lg:block ${
            showFiltersMobile ? "fixed inset-0 z-50 overflow-y-auto block p-8" : "hidden"
          }`}
        >
          {/* Mobile close buttons */}
          <div className="flex lg:hidden justify-between items-center pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Configure Filters</h3>
            <button
              className="p-1 px-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
              onClick={() => setShowFiltersMobile(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <SlidersHorizontal size={13} />
              <span>Catalog Filters</span>
            </h3>
            {(categoryParamQuery || searchParamQuery || priceRange < 1000 || minRating > 0) && (
              <button
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline transition-colors font-medium cursor-pointer"
                onClick={handleClearAllFilters}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories Sidebar */}
          <div className="space-y-3.5">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest select-none">
              By Category Index
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
              <button
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                  !categoryParamQuery
                    ? "bg-slate-900 text-white font-semibold shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => handleSelectCategory(null)}
              >
                <span>All Categories</span>
                {!categoryParamQuery && <Check size={12} />}
              </button>
              {isLoadingCats ? (
                <div className="space-y-2 py-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.slug}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                      categoryParamQuery === cat.slug
                        ? "bg-slate-900 text-white font-semibold shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelectCategory(cat.slug)}
                  >
                    <span className="truncate">{cat.name}</span>
                    {categoryParamQuery === cat.slug && <Check size={12} />}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Max Price limits */}
          <div className="space-y-3">
            <div className="flex justify-between items-center select-none">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Max Price Limit
              </label>
              <span className="text-xs font-bold font-mono text-gray-900">${priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              className="w-full accent-slate-900 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono select-none">
              <span>$0</span>
              <span>$1,500</span>
            </div>
          </div>

          {/* Star review ratings */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest select-none">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[4, 3, 2, 0].map((stars) => (
                <button
                  key={stars}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer ${
                    minRating === stars
                      ? "bg-gray-100 text-gray-900 font-bold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setMinRating(stars)}
                >
                  <span className="flex items-center text-amber-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < (stars || 1) ? "currentColor" : "none"}
                        className={i < (stars || 1) ? "" : "text-gray-300"}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-gray-600 leading-tight">
                    {stars === 0 ? "Any rating" : `${stars}.0 & Up`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Products Listing */}
        <section className="lg:col-span-3 space-y-6">
          {/* Sorting and mobile filter drawer toggler */}
          <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-2xl select-none">
            <button
              className="lg:hidden flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 shadow-sm cursor-pointer"
              onClick={() => setShowFiltersMobile(true)}
            >
              <Filter size={14} />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-xs text-gray-500 font-sans flex items-center gap-1">
                <ArrowUpDown size={13} />
                <span>Sort by:</span>
              </span>
              <select
                className="bg-white border border-gray-200 rounded-xl text-xs text-gray-800 py-1.5 px-3 select-none outline-none focus:border-gray-900"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Best Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="name-asc">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid display or states */}
          {errorText && (
            <div className="p-8 text-center bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs font-sans">
              {errorText}
            </div>
          )}

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : processedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {processedProducts.map((product) => {
                const discountedPrice = product.price * (1 - product.discountPercentage / 100);
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col h-full group"
                  >
                    {/* Thumbnail wrap */}
                    <div className="relative aspect-square w-full bg-gray-50/50 p-6 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {product.discountPercentage > 0 && (
                        <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 select-none uppercase tracking-wider">
                          Save {Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </div>

                    {/* Content wrap */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Tags */}
                        <span className="inline-block px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9.5px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          {product.category}
                        </span>
                        
                        {/* Title */}
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 line-clamp-1 leading-snug">
                          {product.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed font-sans">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-50 space-y-3.5">
                        {/* Star Rating details */}
                        <div className="flex items-center space-x-1 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-[11.5px] font-bold font-mono text-gray-800">{product.rating.toFixed(2)}</span>
                          <span className="text-[11px] text-gray-400">({product.reviews?.length || 0} reviews)</span>
                        </div>

                        {/* Price details alignment */}
                        <div className="flex items-baseline justify-between select-none">
                          <div className="flex items-baseline space-x-1.5 font-mono">
                            <span className="text-sm font-bold text-gray-900">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-semibold text-gray-900 group-hover:underline">
                            Inspect &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-100 inline-block text-gray-400 rounded-2xl mx-auto">
                <SlidersHorizontal size={36} className="stroke-[1.5]" />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-base font-semibold text-gray-900">No records found</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  We couldn't find matching inventory. Try expanding your sliders, choosing a different category or clearing searching filters.
                </p>
              </div>
              <button
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                onClick={handleClearAllFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
