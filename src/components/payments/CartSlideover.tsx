import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { PurchaseModal } from './PurchaseModal';
import { cn } from '../../utils/cn';

export const CartSlideover = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />

            {/* Slideover panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-[#040608]/95 border-l border-white/10 shadow-2xl z-[100] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Institutional Bag</h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{items.length} items</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white text-gray-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <ShoppingBag className="w-16 h-16 text-gray-500" />
                    <div>
                      <p className="text-white font-black uppercase tracking-widest">Your bag is empty</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono mt-2">Add strategic assets to proceed</p>
                    </div>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{item.name}</h4>
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">{item.plan} Access</div>
                        <div className="text-lg font-black text-white mt-2">${item.price}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/40">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Value</span>
                    <span className="text-3xl font-black text-white">${cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && (
          <PurchaseModal
            plan={items.length === 1 ? items[0].plan : 'Multi-Asset Bundle'}
            amount={cartTotal}
            productId={items.map(i => i.productId).join(',')} // Comma separated for tracking
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={items} // We'll pass the whole array for the DB
          />
        )}
      </AnimatePresence>
    </>
  );
};
