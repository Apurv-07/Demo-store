"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCartOpen } from "../store/slices/cartSlice";
import { logout } from "../store/slices/authSlice";

// Layout overlays
import { CartDrawer } from "../components/CartDrawer";
import { AuthModal } from "../components/AuthModal";

// Interactive Icons
import {
  ShoppingBag,
  Lock,
  LogOut,
  Search,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const cartItemsCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Smooth scroll to top on page switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans">
      {/* 1. Global Announcement Micro Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-[10px] font-medium tracking-wider uppercase flex items-center justify-center space-x-1 sm:space-x-3 select-none">
        <span>📦 Free express priority shipping on purchases above $150</span>
        <span className="hidden sm:inline text-slate-500">|</span>
        <span className="hidden sm:inline flex items-center gap-1">
          <ShieldCheck size={11} className="text-emerald-400" />
          <span>Vouched by DummyJSON REST API Layer</span>
        </span>
      </div>

      {/* 2. Main Premium Navigation Panel */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <Link
            href="/"
            className="flex items-center space-x-2 tracking-wider font-sans group"
          >
            <div className="relative h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm shadow group-hover:scale-105 transition-transform">
              E
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-black tracking-widest text-slate-900 leading-none">ESSENTIALS.</span>
              <span className="text-[9.5px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">CURATED LABS</span>
            </div>
          </Link>

          {/* Center Links (Catalog Index shortcuts) */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Link
              href="/"
              className={`hover:text-slate-900 transition-colors ${
                pathname === "/" ? "text-slate-900 underline underline-offset-4 decoration-2" : ""
              }`}
            >
              Overview
            </Link>
            <Link
              href="/products"
              className={`hover:text-slate-900 transition-colors ${
                pathname?.startsWith("/products") && !pathname?.includes("?category")
                  ? "text-slate-900 underline underline-offset-4 decoration-2"
                  : ""
              }`}
            >
              Browse Catalog
            </Link>
            <Link
              href="/products?category=smartphones"
              className="hover:text-slate-900 transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=fragrances"
              className="hover:text-slate-900 transition-colors"
            >
              Cosmetics
            </Link>
          </nav>

          {/* Right Action Counters Group */}
          <div className="flex items-center space-x-3.5">
            {/* Search shortcut navigates to Catalog list */}
            <Link
              href="/products"
              title="Search directory"
              className="p-2 bg-gray-50 hover:bg-gray-100/80 rounded-xl text-gray-700 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
            >
              <Search size={16} />
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              id="cart-trigger-btn"
              title="Open shop cart"
              className="p-2 bg-gray-50 hover:bg-gray-100/80 rounded-xl text-gray-700 transition-all cursor-pointer border border-transparent hover:border-gray-100 flex items-center justify-center relative"
              onClick={() => dispatch(setCartOpen(true))}
            >
              <ShoppingBag size={16} />
              
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 bg-slate-900 text-white rounded-full text-[9px] font-black font-mono border-2 border-white flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Authentication Avatar block or Signin */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 pl-2.5 border-l border-gray-100 text-left">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="h-8.5 w-8.5 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                
                {/* Profile Meta and Logout clicker */}
                <div className="hidden sm:flex flex-col text-xs leading-none">
                  <span className="font-bold text-gray-800 leading-tight block">
                    {user.firstName}
                  </span>
                  <button
                    className="text-[10px] text-rose-500 hover:text-rose-600 font-medium hover:underline transition-all mt-1 flex items-center gap-1 cursor-pointer"
                    onClick={() => dispatch(logout())}
                  >
                    <LogOut size={10} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold tracking-wide rounded-xl uppercase transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm hover:shadow"
                onClick={() => setIsAuthOpen(true)}
              >
                <Lock size={12} />
                <span>Verify Identity</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content Injector */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>

      {/* Sticky overlays */}
      <CartDrawer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Modern Aesthetic Footer */}
      <footer className="border-t border-gray-100 bg-white py-12 px-6 sm:px-12 select-none text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and citation block */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-slate-900 rounded flex items-center justify-center text-white text-[11px] font-black">
                E
              </div>
              <span className="text-xs font-black tracking-widest text-slate-900">ESSENTIALS.</span>
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed font-sans">
              Curating robust lifestyle materials vended directly under the DummyJSON catalog indices. Optimized using responsive Redux state sync arrays and clean layouts.
            </p>
            <div className="text-[10.5px] text-gray-300 font-mono">
              System Time: UTC 2026-06-18
            </div>
          </div>

          {/* Quick references row */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Catalog Index</h4>
            <div className="flex flex-col space-y-2.5 text-xs text-gray-500">
              <Link href="/products?category=beauty" className="hover:text-slate-900 transition-colors">Beauty line</Link>
              <Link href="/products?category=fragrances" className="hover:text-slate-900 transition-colors">Fragrances</Link>
              <Link href="/products?category=laptops" className="hover:text-slate-900 transition-colors">Laptops</Link>
              <Link href="/products" className="hover:text-slate-900 transition-colors">All Products List</Link>
            </div>
          </div>

          {/* Legal / Dev citations */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Platform Integrity</h4>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Authored securely utilizing modern React Next.js App Router. Core persistence synced with client localStorage.
              </p>
              <div className="pt-2.5">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-mono text-[10px] border border-emerald-100">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Secure connection active</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-100 my-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-mono">
          <span>&copy; 1999 - 2026 Essentials Curated Lifestyle Inc. All Rights Reserved.</span>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Audits</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 transition-colors">Client API Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
