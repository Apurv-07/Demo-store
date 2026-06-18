import { Product, ProductsResponse, Category } from "../types";

const BASE_URL = "https://dummyjson.com";

// ==========================================
// HIGH FIDELITY OFFLINE/FALLBACK DATASET
// ==========================================
const FALLBACK_CATEGORIES: Category[] = [
  { slug: "beauty", name: "Beauty", url: `${BASE_URL}/products/category/beauty` },
  { slug: "fragrances", name: "Fragrances", url: `${BASE_URL}/products/category/fragrances` },
  { slug: "laptops", name: "Laptops", url: `${BASE_URL}/products/category/laptops` },
  { slug: "smartphones", name: "Smartphones", url: `${BASE_URL}/products/category/smartphones` },
  { slug: "furniture", name: "Furniture", url: `${BASE_URL}/products/category/furniture` },
  { slug: "groceries", name: "Groceries", url: `${BASE_URL}/products/category/groceries` },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description: "The Essence Mascara Lash Princess Lash Changer Mascara gives voluminous curls and unprecedented structural depth. Achieve iconic curves for daily premium wear.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 7.17,
    rating: 4.94,
    stock: 5,
    tags: ["beauty", "mascara"],
    brand: "Essence",
    sku: "RCH45CH",
    weight: 0.1,
    dimensions: { width: 1.5, height: 12.0, depth: 1.5 },
    warrantyInformation: "1 month standard warranty",
    shippingInformation: "Ships in 1-2 corporate days",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Exceptional length and definition!", date: "2026-05-10T12:00:00Z", reviewerName: "Grace Kelly", reviewerEmail: "grace@example.com" },
      { rating: 4, comment: "Very good everyday mascara", date: "2026-05-18T12:00:00Z", reviewerName: "Jane Doe", reviewerEmail: "jane@example.com" }
    ],
    returnPolicy: "30 days no-hassle return policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-01-01", updatedAt: "2026-06-01", barcode: "12345678", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    description: "Multi-tonal vibrant eyeshadow palette with integrated high-fidelity glass mirror. Features velvety smooth matte textures and highly pigmented diamond shimmers.",
    category: "beauty",
    price: 19.99,
    discountPercentage: 5.5,
    rating: 4.62,
    stock: 8,
    tags: ["beauty", "eyeshadow"],
    brand: "Glamour Labs",
    sku: "EYE78MP",
    weight: 0.25,
    dimensions: { width: 8.0, height: 1.2, depth: 14.5 },
    warrantyInformation: "No warranty",
    shippingInformation: "Ships in 2-3 corporate days",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Beautiful selection of earth tones", date: "2026-04-12T09:30:00Z", reviewerName: "Sophia Loren", reviewerEmail: "sophia@example.com" }
    ],
    returnPolicy: "30 days no-hassle return policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-02-15", updatedAt: "2026-06-03", barcode: "87654321", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png",
      "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png"
  },
  {
    id: 3,
    title: "Calvin Klein CK One",
    description: "A clean, contemporary composition with a refreshing green tea signature. CK One by Calvin Klein is a universally iconic unisex fragrance suited for any style.",
    category: "fragrances",
    price: 49.99,
    discountPercentage: 11.2,
    rating: 4.85,
    stock: 22,
    tags: ["fragrances", "perfume"],
    brand: "Calvin Klein",
    sku: "CK1-992",
    weight: 0.3,
    dimensions: { width: 4.5, height: 11.0, depth: 4.5 },
    warrantyInformation: "Lifetime warranty of authenticity",
    shippingInformation: "Ships in 24 corporate hours",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Classic and incredibly fresh scent.", date: "2026-06-01T15:45:00Z", reviewerName: "Michael Clark", reviewerEmail: "michael@example.com" }
    ],
    returnPolicy: "30 days unopened item policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-03-01", updatedAt: "2026-06-15", barcode: "44556677", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png",
      "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png"
  },
  {
    id: 4,
    title: "Chanel Coco Mademoiselle",
    description: "The essence of a bold, free woman. An elegant oriental-fresh perfume with strong character and absolute sensory premium luxury.",
    category: "fragrances",
    price: 120.00,
    discountPercentage: 0,
    rating: 4.91,
    stock: 14,
    tags: ["fragrances", "luxury"],
    brand: "Chanel",
    sku: "CH-COCO-88",
    weight: 0.35,
    dimensions: { width: 5.0, height: 12.0, depth: 5.0 },
    warrantyInformation: "Authenticity certified label",
    shippingInformation: "Ships in 24 corporate hours",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Pure elegance in a bottle. Exquisite.", date: "2026-06-08T08:00:00Z", reviewerName: "Emily Watson", reviewerEmail: "emily@example.com" }
    ],
    returnPolicy: "30 days unopened item policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-01-20", updatedAt: "2026-06-12", barcode: "99887766", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Mademoiselle/1.png",
      "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Mademoiselle/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Mademoiselle/thumbnail.png"
  },
  {
    id: 5,
    title: "MacBook Pro M3 Max",
    description: "The ultimate laptop for developers, creators, and visual artists. Features the lightning-fast Apple M3 Max silicon chip, brilliant Liquid Retina XDR screen, and phenomenal 22-hour reserve capacity.",
    category: "laptops",
    price: 1999.99,
    discountPercentage: 5.0,
    rating: 4.96,
    stock: 7,
    tags: ["laptops", "computers"],
    brand: "Apple",
    sku: "AP-MBP-M3",
    weight: 1.6,
    dimensions: { width: 31.2, height: 1.5, depth: 22.1 },
    warrantyInformation: "1 year AppleCare default warranty",
    shippingInformation: "Free Express corporate transit",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Compiles massive projects in seconds. Unbelievable performance.", date: "2026-06-11T12:00:00Z", reviewerName: "Linus T.", reviewerEmail: "linus@example.com" }
    ],
    returnPolicy: "14 days dynamic return window",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-05-01", updatedAt: "2026-06-16", barcode: "77788899", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/laptops/MacBook%20Pro%20M3%20Max/1.png",
      "https://cdn.dummyjson.com/products/images/laptops/MacBook%20Pro%20M3%20Max/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/laptops/MacBook%20Pro%20M3%20Max/thumbnail.png"
  },
  {
    id: 6,
    title: "iPhone 15 Pro Max Titanium",
    description: "The first iPhone featuring an aerospace-grade titanium alloy build. Houses the cutting-edge A17 Pro core processor, customizable Action button, and complete 5x Optical Telephoto zoom arrays.",
    category: "smartphones",
    price: 1199.99,
    discountPercentage: 6.25,
    rating: 4.88,
    stock: 3,
    tags: ["smartphones", "smartphones"],
    brand: "Apple",
    sku: "AP-IP15P-T",
    weight: 0.22,
    dimensions: { width: 7.6, height: 15.9, depth: 0.8 },
    warrantyInformation: "1 year limited warranty",
    shippingInformation: "Free overnight courier transit",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Titanium feels premium and lightweight.", date: "2026-06-14T21:10:00Z", reviewerName: "Arthur Dent", reviewerEmail: "arthur@example.com" }
    ],
    returnPolicy: "14 days return policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-04-10", updatedAt: "2026-06-17", barcode: "11223344", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/1.png",
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/thumbnail.png"
  },
  {
    id: 7,
    title: "Samsung Galaxy S24 Ultra",
    description: "Empower your projects with high tier Galaxy AI features. Capture unparalleled visual fidelity using the integrated 200MP sensor array and take precise design control with the S-Pen.",
    category: "smartphones",
    price: 1299.99,
    discountPercentage: 10.0,
    rating: 4.83,
    stock: 9,
    tags: ["smartphones", "android"],
    brand: "Samsung",
    sku: "SS-S24U-512",
    weight: 0.23,
    dimensions: { width: 7.9, height: 16.2, depth: 0.86 },
    warrantyInformation: "2 years Samsung warranty",
    shippingInformation: "Ships in 24 corporate hours",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Galaxy AI circle and search is awesome.", date: "2026-06-03T14:22:00Z", reviewerName: "Sarah Connor", reviewerEmail: "sarah@example.com" }
    ],
    returnPolicy: "30 days flexible return policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-03-22", updatedAt: "2026-06-10", barcode: "55667788", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/1.png",
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro/thumbnail.png"
  },
  {
    id: 8,
    title: "Ergonomic Office Chair Elite",
    description: "State-of-the-art office command seat. Provides continuous responsive lumbar support, fully premium modular 4D armrests, and dynamic breathability mesh structures.",
    category: "furniture",
    price: 349.99,
    discountPercentage: 15.0,
    rating: 4.71,
    stock: 12,
    tags: ["furniture", "chair"],
    brand: "Steelcase",
    sku: "SC-EL-99",
    weight: 18.5,
    dimensions: { width: 68.0, height: 110.0, depth: 65.0 },
    warrantyInformation: "10 year limited component warranty",
    shippingInformation: "Heavylift parcel freight transit",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Cured my lower back fatigue. Instant relief.", date: "2026-05-25T11:45:00Z", reviewerName: "John Smith", reviewerEmail: "john@example.com" }
    ],
    returnPolicy: "30 days moneyback return policy",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-02-10", updatedAt: "2026-06-15", barcode: "99001122", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/furniture/Classic%20Wooden%20Credenza/1.png",
      "https://cdn.dummyjson.com/products/images/furniture/Classic%20Wooden%20Credenza/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/furniture/Classic%20Wooden%20Credenza/thumbnail.png"
  },
  {
    id: 9,
    title: "Organic Honey Wildflower",
    description: "100% natural, certified non-pasteurized organic desert honey harvested from isolated wildflower territories. Pure liquid gold bursting with authentic botanical premium undertones.",
    category: "groceries",
    price: 14.99,
    discountPercentage: 0,
    rating: 4.95,
    stock: 25,
    tags: ["groceries", "honey"],
    brand: "Nature's Own",
    sku: "NO-HONEY-W",
    weight: 0.5,
    dimensions: { width: 6.5, height: 12.0, depth: 6.5 },
    warrantyInformation: "Authentic purity seal guaranteed",
    shippingInformation: "Ships in 2-3 green business days",
    availabilityStatus: "In Stock",
    reviews: [
      { rating: 5, comment: "Purest wildflower taste I have ever encountered.", date: "2026-06-16T18:00:00Z", reviewerName: "Alice Woods", reviewerEmail: "alice@example.com" }
    ],
    returnPolicy: "30 days satisfaction guarantee",
    minimumOrderQuantity: 1,
    meta: { createdAt: "2026-05-15", updatedAt: "2026-06-17", barcode: "88990011", qrCode: "" },
    images: [
      "https://cdn.dummyjson.com/products/images/groceries/Honey%20Jar/1.png",
      "https://cdn.dummyjson.com/products/images/groceries/Honey%20Jar/thumbnail.png"
    ],
    thumbnail: "https://cdn.dummyjson.com/products/images/groceries/Honey%20Jar/thumbnail.png"
  }
];

export class ProductService {
  /**
   * Helper method to handle fetch requests and throw typed errors
   */
  private static async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errBody = await response.json();
          if (errBody && errBody.message) {
            errorMessage = errBody.message;
          }
        } catch {
          // If response is not JSON, fallback to status code
        }
        throw new Error(errorMessage);
      }
      return await response.json() as T;
    } catch (error) {
      console.warn(`Direct fetch failed for URL: ${url}. Graceful degradation pattern active.`, error);
      throw error instanceof Error ? error : new Error("Failed to communicate with API server");
    }
  }

  /**
   * Get all products with optional query parameters (limit, skip, etc.)
   */
  static async getProducts(params?: { limit?: number; skip?: number }): Promise<ProductsResponse> {
    const limit = params?.limit ?? 30;
    const skip = params?.skip ?? 0;
    const url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
    try {
      return await this.fetchWithErrorHandling<ProductsResponse>(url);
    } catch (error) {
      // Fallback response using our high-fidelity static offline data
      console.log("Leveraging static fallback data for getProducts", error);
      const sliced = FALLBACK_PRODUCTS.slice(skip, skip + limit);
      return {
        products: sliced,
        total: FALLBACK_PRODUCTS.length,
        skip,
        limit
      };
    }
  }

  /**
   * Fetch a single product by its unique numeric ID
   */
  static async getProductById(id: number | string): Promise<Product> {
    const url = `${BASE_URL}/products/${id}`;
    try {
      return await this.fetchWithErrorHandling<Product>(url);
    } catch (error) {
      console.log(`Leveraging static fallback data for product ID: ${id}`, error);
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      const found = FALLBACK_PRODUCTS.find((p) => p.id === numericId);
      if (found) return found;
      
      // If not found in primary fallback list, synthesize a fallback item to avoid user blocker
      throw new Error(`Product record not found in live database or offline index.`);
    }
  }

  /**
   * Search products by keyword query
   */
  static async searchProducts(query: string): Promise<ProductsResponse> {
    const url = `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`;
    try {
      return await this.fetchWithErrorHandling<ProductsResponse>(url);
    } catch (error) {
      console.log(`Leveraging static search filtering for query: "${query}"`, error);
      const cleanedQuery = query.toLowerCase().trim();
      const matched = FALLBACK_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(cleanedQuery) ||
          p.description.toLowerCase().includes(cleanedQuery) ||
          p.category.toLowerCase().includes(cleanedQuery) ||
          (p.brand && p.brand.toLowerCase().includes(cleanedQuery))
      );
      return {
        products: matched,
        total: matched.length,
        skip: 0,
        limit: 100
      };
    }
  }

  /**
   * Fetch a comprehensive list of all product categories
   */
  static async getCategories(): Promise<Category[]> {
    const url = `${BASE_URL}/products/categories`;
    try {
      const rawCategories = await this.fetchWithErrorHandling<any[]>(url);
      if (rawCategories && rawCategories.length > 0) {
        if (typeof rawCategories[0] === "string") {
          return rawCategories.map((cat: string) => ({
            slug: cat,
            name: cat.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            url: `${BASE_URL}/products/category/${cat}`
          }));
        } else {
          return rawCategories.map((cat: any) => ({
            slug: cat.slug || cat.name || "",
            name: cat.name || cat.slug || "",
            url: cat.url || ""
          }));
        }
      }
      return FALLBACK_CATEGORIES;
    } catch (error) {
      console.log("Leveraging static fallback categories list due to fetch error.", error);
      return FALLBACK_CATEGORIES;
    }
  }

  /**
   * Get products that belong to a specific category slug
   */
  static async getProductsByCategory(slug: string): Promise<ProductsResponse> {
    const url = `${BASE_URL}/products/category/${encodeURIComponent(slug)}`;
    try {
      return await this.fetchWithErrorHandling<ProductsResponse>(url);
    } catch (error) {
      console.log(`Leveraging static category filtering for category: "${slug}"`, error);
      const matched = FALLBACK_PRODUCTS.filter((p) => p.category === slug);
      return {
        products: matched,
        total: matched.length,
        skip: 0,
        limit: 100
      };
    }
  }
}

