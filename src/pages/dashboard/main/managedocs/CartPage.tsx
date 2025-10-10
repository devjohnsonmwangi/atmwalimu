import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { documentsApi } from '../../../../features/documents/docmentsApi';
import { store } from '../../../../app/store';
import { AnimatePresence } from 'framer-motion';
import {
  selectCartItems,
  selectCartTotal,
  removeItemFromCart,
  clearCart,
} from '../../../../features/cart/cartSlice';
import Button from '../../../../components/Button';
import PaymentModal from '../../../../components/payments/PaymentModal';
import CartItem from '../../../../components/cart/CartItem';
import { ShoppingCart, CheckCircle } from 'lucide-react';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isCheckoutSuccess, setCheckoutSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<typeof cartItems>([]);

  const handleRemoveItem = (documentId: number) => {
    dispatch(removeItemFromCart(documentId));
  };

  const handlePaymentSuccess = () => {
    setPurchasedItems([...cartItems]);
    dispatch(clearCart());
    setPaymentModalOpen(false);
    setCheckoutSuccess(true);
  };

  const navigate = useNavigate();

  const goToLibrary = () => {
    // Invalidate the UserLibrary tag to force a refetch on the library page
    try {
  // cast to unknown then never to satisfy TypeScript signature for invalidateTags payload
  store.dispatch(documentsApi.util.invalidateTags([{ type: 'UserLibrary', id: 'CURRENT_USER' }] as unknown as never));
    } catch (e) {
      // graceful fallback if util.invalidateTags isn't callable here
      // we'll still navigate; the library query should re-run when the page mounts
    }
    navigate('/dashboard/library');
  };

  const itemsToDisplay = isCheckoutSuccess ? purchasedItems : cartItems;

  // Infer the type of a cart item from the cartItems array
  type CartItemType = typeof cartItems extends (infer U)[] ? U : never;

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        {/* --- 1. PADDING REDUCED for a more compact view --- */}
        <div className="p-2 sm:p-4 max-w-4xl mx-auto">
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-lg shadow-lg mb-6 flex items-center gap-4">
            {isCheckoutSuccess ? <CheckCircle size={32} /> : <ShoppingCart size={32} />}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {isCheckoutSuccess ? 'Payment Successful!' : 'Shopping Cart'}
              </h1>
              <p className="text-blue-200 text-sm sm:text-base mt-1">
                {isCheckoutSuccess ? 'Your documents are ready for download.' : 'Review your items below.'}
              </p>
            </div>
          </div>

          {/* --- 2. CHECKOUT SUMMARY MOVED TO THE TOP --- */}
          {!isCheckoutSuccess && cartItems.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                {/* Order Total Section */}
                <div className="text-center sm:text-left">
                  <span className="text-gray-600 text-md">Order Total:</span>
                  <p className="font-extrabold text-2xl text-gray-900">
                    Ksh {cartTotal.toFixed(2)}
                  </p>
                </div>
                {/* Checkout Button */}
                <Button 
                  className="w-full sm:w-auto sm:px-10 py-3" 
                  onClick={() => setPaymentModalOpen(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}

          {/* --- Cart Items or Empty State --- */}
          {itemsToDisplay.length === 0 && !isCheckoutSuccess ? (
            <div className="text-center mt-10 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">Your cart is empty</h3>
              <p className="text-gray-600 mt-2 mb-4">Looks like you haven't added any documents yet.</p>
              <Link to="/documents">
                <Button>Start Browsing</Button>
              </Link>
            </div>
          ) : (
            <div>
              <AnimatePresence>
                {itemsToDisplay.map((item: CartItemType) => (
                  <CartItem
                    key={item.documentId}
                    item={item}
                    isPurchased={isCheckoutSuccess}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {/* --- 3. "SUCCESS" BUTTONS are now a static block at the end --- */}
          {isCheckoutSuccess && (
            <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <p className="text-gray-700 font-medium">What's next?</p>
          <div className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full" onClick={goToLibrary}>Go to My Library</Button>
          </div>
                    <Link to="/dashboard/documents" className="w-full sm:w-auto">
                        <Button className="w-full">Continue Browsing</Button>
                    </Link>
                </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        documentIds={cartItems.map((item: CartItemType) => item.documentId)}
      />
    </>
  );
};

export default CartPage;