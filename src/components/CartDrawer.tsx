import React from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromCart, updateQuantity, setCartOpen, clearCart } from "../store/slices/cartSlice";
import { AnimatePresence, motion } from "motion/react";

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 150;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleUpdateQty = (productId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQty }));
    }
  };

  const handleCheckout = () => {
    alert(`🎉 Purchase simulated successfully!\nItems: ${totalItems}\nTotal Amount: $${subtotal.toFixed(2)}\n\nThank you for choosing modern e-commerce! Your cart has been cleared.`);
    dispatch(clearCart());
    dispatch(setCartOpen(false));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            id="cart-overlay"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCartOpen(false))}
          />

          {/* Drawer container */}
          <motion.div
            id="cart-container"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col focus:outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-900 border border-gray-100 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 leading-tight">Your Cart</h2>
                  <p className="text-xs text-gray-400 font-medium">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
                </div>
              </div>
              <button
                id="close-cart-btn"
                className="p-1 px-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-100 cursor-pointer"
                onClick={() => dispatch(setCartOpen(false))}
              >
                <X size={20} />
              </button>
            </div>

            {/* Shopping status & content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
              {items.length > 0 ? (
                <>
                  {/* Free shipping bar ticker */}
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4.5 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-800">
                        {isFreeShipping
                          ? "🎉 You unlock FREE Express Shipping!"
                          : "Express Shipping eligibility"}
                      </span>
                      {!isFreeShipping && (
                        <span className="text-gray-500 font-mono text-xs">
                          ${amountNeededForFreeShipping.toFixed(2)} left
                        </span>
                      )}
                    </div>
                    
                    {/* Progress Slider */}
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          isFreeShipping ? "bg-emerald-500" : "bg-gray-900"
                        }`}
                        style={{ width: `${progressToFreeShipping}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isFreeShipping
                        ? "Your order qualifies for complimentary priority shipping at checkout."
                        : `Add an extra $${amountNeededForFreeShipping.toFixed(2)} worth of premium goods to avoid additional charges.`}
                    </p>
                  </div>

                  {/* Cart list items */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-start space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white transition-all duration-200 group relative"
                      >
                        {/* Imagelink container */}
                        <div className="h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-1.5">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Middle info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9.5px] font-semibold text-gray-500 uppercase tracking-wider">
                            {item.product.category}
                          </span>
                          <h3 className="text-sm font-medium text-gray-900 truncate leading-snug">
                            {item.product.title}
                          </h3>
                          <div className="flex items-baseline space-x-1 font-mono">
                            <span className="text-sm font-bold text-gray-900">
                              ${(item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2)}
                            </span>
                            {item.product.discountPercentage > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                ${item.product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Control counter row */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-1 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                              <button
                                className="p-1 rounded-md hover:bg-white text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                                onClick={() => handleUpdateQty(item.product.id, item.quantity, -1)}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="px-2 text-xs font-semibold font-mono text-gray-800 text-center min-w-[20px]">
                                {item.quantity}
                              </span>
                              <button
                                className="p-1 rounded-md hover:bg-white text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                                onClick={() => handleUpdateQty(item.product.id, item.quantity, 1)}
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <button
                              className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remove item"
                              onClick={() => dispatch(removeFromCart(item.product.id))}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-16 space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-2xl">
                    <ShoppingBag size={40} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Your cart is empty</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                      Explore our high-quality handpicked items and add something unique to start!
                    </p>
                  </div>
                  <button
                    className="mt-3 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                    onClick={() => dispatch(setCartOpen(false))}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary (Sticky Bottom) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-mono">
                      {isFreeShipping ? (
                        <span className="text-emerald-500 font-medium">FREE</span>
                      ) : (
                        "$15.00"
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span className="font-mono text-lg">
                      ${(isFreeShipping ? subtotal : subtotal + 15).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    id="checkout-btn"
                    className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow group cursor-pointer"
                    onClick={handleCheckout}
                  >
                    <span>Proceed to Secured Checkout</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 text-center font-medium transition-colors cursor-pointer"
                    onClick={() => dispatch(clearCart())}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
