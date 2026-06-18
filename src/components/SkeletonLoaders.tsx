import React from "react";

/**
 * Shimmering Product Card Skeleton Loader
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Aspect ratio box for image skeleton */}
      <div className="relative aspect-square bg-gray-100 w-full overflow-hidden" />
      
      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tag / Category */}
          <div className="h-4 bg-gray-100 rounded-md w-1/4 mb-3" />
          {/* Title */}
          <div className="h-5 bg-gray-100 rounded-md w-full mb-2" />
          <div className="h-5 bg-gray-100 rounded-md w-3/4 mb-4" />
        </div>
        
        <div>
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-100 rounded-full" />
            ))}
          </div>
          {/* Price & Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 bg-gray-100 rounded-md w-1/3" />
            <div className="h-9 bg-gray-100 rounded-lg w-1/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Grid layout for Product Card Skeletons
 */
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Rich Detail Page Skeleton Loader
 */
export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8 lg:space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Interactive Media Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-100 rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="aspect-square bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div className="flex flex-col justify-between h-full space-y-6 lg:py-4">
          {/* Meta & Heading Group */}
          <div className="space-y-4">
            <div className="h-5 bg-gray-100 rounded-md w-1/4" />
            <div className="h-10 bg-gray-100 rounded-lg w-10/12" />
            <div className="h-5 bg-gray-100 rounded-md w-1/2" />
          </div>

          {/* Pricing & Rating Group */}
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-gray-100 rounded-lg w-1/3" />
              <div className="h-5 bg-gray-100 rounded-md w-1/4" />
            </div>
            <div className="h-4 bg-gray-100 rounded-md w-2/3" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-md w-full" />
            <div className="h-4 bg-gray-100 rounded-md w-full" />
            <div className="h-4 bg-gray-100 rounded-md w-5/6" />
          </div>

          {/* Actions Structure */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="h-12 bg-gray-100 rounded-xl w-32" />
              <div className="h-12 bg-gray-100 rounded-xl flex-1" />
            </div>
          </div>

          {/* Highlights / Specs Grid */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews and Additional Specs */}
      <div className="pt-12 border-t border-gray-100">
        <div className="h-8 bg-gray-100 rounded-lg w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="bg-white p-5 border border-gray-100 rounded-2xl space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded-md w-1/3" />
                <div className="h-4 bg-gray-100 rounded-md w-1/6" />
              </div>
              <div className="h-4 bg-gray-100 rounded-md w-2/3" />
              <div className="h-4 bg-gray-100 rounded-md w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
