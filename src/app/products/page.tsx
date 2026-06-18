import React from "react";
import { ProductService } from "../../services/product.service";
import { CatalogClient } from "./CatalogClient";
import { Product, Category } from "../../types";

export const revalidate = 1800; // Cache category catalogs server-side for 30 minutes

interface PageProps {
  searchParams?: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsCatalogPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const searchParamQuery = searchParams?.search || "";
  const categoryParamQuery = searchParams?.category || "";

  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    // 1. Fetch categories for sidebar
    categories = await ProductService.getCategories();

    // 2. Fetch products matching category and/or query filter
    if (categoryParamQuery) {
      const categoryRes = await ProductService.getProductsByCategory(categoryParamQuery);
      products = categoryRes.products;

      if (searchParamQuery) {
        const queryClean = searchParamQuery.toLowerCase();
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(queryClean) ||
            p.description.toLowerCase().includes(queryClean) ||
            (p.brand && p.brand.toLowerCase().includes(queryClean))
        );
      }
    } else if (searchParamQuery) {
      const searchRes = await ProductService.searchProducts(searchParamQuery);
      products = searchRes.products;
    } else {
      const productsRes = await ProductService.getProducts({ limit: 40 });
      products = productsRes.products;
    }
  } catch (error) {
    console.error("ProductsCatalogPage data fetching error:", error);
  }

  return (
    <CatalogClient
      initialProducts={products}
      categories={categories}
      searchParamQuery={searchParamQuery}
      categoryParamQuery={categoryParamQuery}
    />
  );
}
