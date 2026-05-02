"use client";

import { useCartStore } from "@/store/useCartStore";
import { ArrowRight, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";

export default function Cart() {
  const { isOpen, closeCart, items, removeItem, addItem, decrementItem } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-stone-950/45 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-[32rem] flex-col overflow-hidden border-l border-white/15 bg-[#141210]/92 text-[#F4F1E8] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        onWheelCapture={(event) => event.stopPropagation()}
        onTouchMoveCapture={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(244,114,182,0.22),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(251,146,60,0.12),_transparent_30%)]" />

        {/* Cart Header */}
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-6 sm:px-7">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-300">
              <Sparkles className="h-3.5 w-3.5 text-rose-300" />
              Selected pieces
            </div>
            <div>
              <h2 className="text-2xl font-serif italic tracking-tight text-[#FAF9F6]">Your Cart</h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">{itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout.</p>
            </div>
          </div>

          <button onClick={closeCart} className="rounded-full border border-white/10 bg-white/5 p-2.5 text-stone-300 transition-colors hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-6 sm:px-7"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
        >
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-stone-400">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <ShoppingBag className="h-7 w-7 text-stone-300" />
              </div>
              <p className="text-lg font-serif italic text-[#FAF9F6]">Your cart is empty.</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-stone-400">
                Add one of the curated hampers or memory pieces to begin building your order.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/25 to-orange-400/20 text-sm font-semibold uppercase text-[#FAF9F6]">
                        {item.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-medium text-[#FAF9F6]">{item.name}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-stone-400">Quantity {item.quantity}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-stone-300 transition-colors hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                    <div className="flex items-center gap-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Quantity</p>
                      <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          className="border-r border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-10 px-3 py-1.5 text-center text-sm font-medium text-[#FAF9F6]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                          disabled={item.quantity >= 9}
                          className="border-l border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-stone-300 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-stone-500 disabled:hover:bg-white/5 disabled:hover:text-stone-500"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      {item.quantity >= 9 && (
                        <span className="text-[10px] uppercase tracking-[0.22em] text-rose-300">Max 9</span>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-[#FAF9F6]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer / Checkout */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-white/10 px-6 py-6 sm:px-7">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm text-stone-300">
                <span className="uppercase tracking-[0.22em]">Subtotal</span>
                <span className="text-xl font-semibold text-[#FAF9F6]">${total.toFixed(2)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-400">
                Shipping and taxes are calculated at checkout.
              </p>
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#FAF9F6] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-300">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}