import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";
import { ProductService } from "../../../services/product.service";
import { ProductDetailClient } from "./ProductDetailClient";
import { Product } from "../../../types";

export const revalidate = 3600; // SSG: Revalidate caches hourly

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// SSG static path triggers
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
  ];
}

// Dynamic SEO head triggers
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  try {
    const product = await ProductService.getProductById(params.id);
    return {
      title: `${product.title} | Curated Essentials`,
      description: product.description,
    };
  } catch {
    return {
      title: "Product Registry | Essentials",
    };
  }
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  let product: Product | null = null;

  try {
    product = await ProductService.getProductById(params.id);
  } catch (error) {
    console.error("Failed to load product page on the server:", error);
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5">
        <div className="p-4 bg-gray-50 border border-gray-100 inline-block text-gray-400 rounded-3xl mx-auto">
          <Cpu size={36} className="text-gray-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">Product registry failed</h2>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-sans">
            This product record is currently unavailable or doesn't exist in our DummyJSON datastore.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl"
        >
          <ArrowLeft size={14} />
          <span>Return to Catalog Index</span>
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
