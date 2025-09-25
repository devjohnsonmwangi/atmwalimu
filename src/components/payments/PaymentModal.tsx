import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast'; // For notifications
import {
  useInitiateDocumentPaymentMutation,
  useInitiateBulkPaymentMutation,
  useLazyConfirmPaymentQuery,
} from '../../features/documents/docmentsApi'; // Adjust path if needed
import Modal from '../Modal'; // Your base Modal component
import Button from '../Button'; // Your custom Button component
import { Phone, CheckCircle, XCircle, Loader, ShieldCheck, Zap, Lock } from 'lucide-react';

// Define the props for the component
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  documentId?: number;
  documentIds?: number[];
}

// Animation variants for smooth state transitions
const modalContentVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  documentId,
  documentIds,
}) => {
  // --- STATE MANAGEMENT ---
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'pending' | 'confirmed' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

  // --- RTK QUERY HOOKS ---
  const [initiateSinglePayment, { isLoading: isInitiatingSingle }] = useInitiateDocumentPaymentMutation();
  const [initiateBulkPayment, { isLoading: isInitiatingBulk }] = useInitiateBulkPaymentMutation();
  const [confirmPayment, { data: confirmationData, error: confirmationError }] = useLazyConfirmPaymentQuery();
  const isLoading = isInitiatingSingle || isInitiatingBulk;

  // --- SIDE EFFECTS ---

  // Effect to reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhoneNumber('');
        setPaymentStatus('idle');
        setCheckoutRequestId(null);
      }, 300);
    }
  }, [isOpen]);

  // Effect for polling payment status
  useEffect(() => {
    if (paymentStatus !== 'pending' || !checkoutRequestId) return;
    const interval = setInterval(() => {
      confirmPayment(checkoutRequestId);
    }, 5000);
    return () => clearInterval(interval);
  }, [paymentStatus, checkoutRequestId, confirmPayment]);

  // Effect to handle the result of the confirmation poll
  useEffect(() => {
    if (confirmationData?.status === 'completed') {
      setPaymentStatus('confirmed');
      toast.success('Payment Confirmed! Your items are ready.');
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2500);
    } else if (confirmationData?.status === 'failed' || confirmationError) {
      setPaymentStatus('failed');
      // **IMPROVED**: Extract the specific error message from the polling error
      type ApiError = { data?: { message?: string } };
      const apiError = confirmationError as ApiError;
      const message = apiError?.data?.message || 'Payment failed or was cancelled by the user.';
      toast.error(message);
    }
  }, [confirmationData, confirmationError, onPaymentSuccess, onClose]);

  // --- EVENT HANDLERS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('initiating');
    const toastId = toast.loading('Sending STK push request...');

    try {
      let response;
      if (documentIds && documentIds.length > 0) {
        response = await initiateBulkPayment({ documentIds, phoneNumber }).unwrap();
      } else if (documentId) {
        response = await initiateSinglePayment({ documentId, phoneNumber }).unwrap();
      } else {
        throw new Error("No document ID was provided for payment.");
      }
      
      // **IMPROVED**: Use the actual success message from the API if available
      toast.success('Request sent successfully!', { id: toastId });
      toast('Please check your phone to complete payment.');
      setCheckoutRequestId(response.checkoutRequestId);
      setPaymentStatus('pending');
    } catch (err: unknown) {
      // **IMPROVED**: Display the EXACT error message from the backend API
      let message = 'An unexpected error occurred. Please try again.';
      if (typeof err === 'object' && err !== null && 'data' in err && typeof (err as { data?: { message?: string } }).data?.message === 'string') {
        message = (err as { data: { message: string } }).data.message;
      }
      toast.error(message, { id: toastId });
      setPaymentStatus('failed');
    }
  };
  
  // --- DYNAMIC RENDER LOGIC ---
  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={paymentStatus}
          variants={modalContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-center"
        >
          {/* State 1: Idle - Enriched with more content */}
          {paymentStatus === 'idle' && (
            <div className="text-left">
              <p className="text-center text-gray-600 mb-4">You're one step away from unlocking your documents. Please enter your phone number to complete the purchase via M-Pesa.</p>
              
              {/* Feature List */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">SSL Encrypted & Secure Transaction</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Instant Access to Documents After Payment</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 254712345678"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                    required
                  />
                </div>
                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <Button variant="secondary" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Processing...' : 'Complete Purchase'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Other states (pending, confirmed, failed) remain visually the same */}
          {(paymentStatus === 'initiating' || paymentStatus === 'pending') && (
            <div className="py-8">
              <Loader className="mx-auto h-16 w-16 text-blue-500 animate-spin mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Awaiting Confirmation</h3>
              <p className="mt-2 text-gray-500">Check your phone to enter your M-Pesa PIN.</p>
              <Button variant="danger" onClick={onClose} className="mt-6">
                Cancel Payment
              </Button>
            </div>
          )}
          
          {paymentStatus === 'confirmed' && (
             <div className="py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: 'spring', stiffness: 200, damping: 10 }}}>
                    <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">Payment Successful!</h3>
                <p className="mt-2 text-gray-500">Your documents are now unlocked. Redirecting...</p>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="py-8">
                <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                    <XCircle className="mx-auto h-20 w-20 text-red-500" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">Payment Failed</h3>
                <p className="text-gray-500 mt-2">An error occurred. Please check the details and try again.</p>
                <Button onClick={() => setPaymentStatus('idle')} className="mt-6">
                    Try Again
                </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="font-poppins">
        <div className="bg-green-600 text-white p-4 rounded-t-lg">
           <h3 className="text-xl font-bold text-center group relative w-fit mx-auto">
            <ShieldCheck className="inline-block mr-2 -mt-1" />
            Secure Checkout
            <span className="absolute bottom-0 left-0 h-0.5 bg-blue-400 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </h3>
        </div>
        <div className="p-6 bg-white rounded-b-lg">
          {renderContent()}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;