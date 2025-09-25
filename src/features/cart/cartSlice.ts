import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store'; // Assuming your store is here
import { Document } from '../documents/docmentsApi';

// Define the shape of a single item in the cart
export interface CartItem extends Document {}

// Define the shape of the cart state
export interface CartState {
  items: CartItem[];
}

// Define the initial state
export const initialState: CartState = {
  items: [],
};

 const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to add a document to the cart
    addItemToCart: (state, action: PayloadAction<Document>) => {
      // Prevent duplicates: check if the item is already in the cart
      const existingItem = state.items.find(item => item.documentId === action.payload.documentId);
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    // Action to remove a document from the cart
    removeItemFromCart: (state, action: PayloadAction<number>) => { // payload is documentId
      state.items = state.items.filter(item => item.documentId !== action.payload);
    },
    // Action to clear the entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Export the actions for use in components
export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;

// --- Selectors ---
// Selectors are memoized functions that let us efficiently get data from the store.
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemCount = (state: RootState) => state.cart.items.length;
export const selectCartTotal = (state: RootState) => {
  return state.cart.items.reduce((total, item) => total + parseFloat(String(item.price)), 0);
};
export const selectIsInCart = (documentId: number) => (state: RootState) => {
  return state.cart.items.some(item => item.documentId === documentId);
};

// Export the reducer to be added to the store
export default cartSlice.reducer;