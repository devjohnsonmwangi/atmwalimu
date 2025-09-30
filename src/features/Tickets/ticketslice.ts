import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the UI-related state for the support ticket feature
interface SupportTicketUIState {
  filters: {
    subject: string;
    status: '' | 'open' | 'in_progress' | 'closed';
    // Admin-specific filters
    userName: string;
    userEmail: string;
  };
  toast: {
    message: string;
    type: 'success' | 'error';
  } | null;
}

const initialState: SupportTicketUIState = {
  filters: {
    subject: '',
    status: '',
    userName: '',
    userEmail: '',
  },
  toast: null,
};

const supportTicketSlice = createSlice({
  name: 'supportTicketUI', // Renamed to clarify its purpose
  initialState,
  reducers: {
    /**
     * Updates the filter values in the state.
     * Can be used for search and filter inputs in the UI.
     */
    setTicketFilters(state, action: PayloadAction<Partial<SupportTicketUIState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    /**
     * Resets all filters to their initial empty state.
     */
    resetTicketFilters(state) {
      state.filters = initialState.filters;
    },
    /**
     * Sets a toast message to be displayed to the user.
     */
    showToast(state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) {
      state.toast = action.payload;
    },
    /**
     * Hides the current toast message.
     */
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const {
  setTicketFilters,
  resetTicketFilters,
  showToast,
  hideToast,
} = supportTicketSlice.actions;

export default supportTicketSlice.reducer;