// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store';

// =================================================================
// INTERFACES (Updated to match the API response DTO)
// =================================================================

/**
 * The detailed User object structure.
 * This now perfectly matches the UserApiResponse from your usersAPI.ts file.
 */
export interface User {
    userId: number;
    fullName: string;
    email: string;
    profilePictureUrl?: string | null;
    bio?: string;
    role: string; // Kept as string for flexibility, but you can use the specific union type too
    reputationScore?: number;
    socialLinks?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}

/**
 * The shape of the payload for the loginSuccess action.
 * It matches the successful response from the loginUser mutation.
 */
export interface LoginSuccessPayload {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string; // refreshToken is available but typically not stored in Redux state for security
    };
}

/**
 * The state for this slice, holding the user's authentication info.
 */
export interface UserState {
    accessToken: string | null;
    user: User | null;
}

// =================================================================
// INITIAL STATE
// =================================================================

const initialState: UserState = {
    accessToken: localStorage.getItem('authToken') || null, // Rehydrate token from localStorage
    user: null, // User info is fetched on app load or after login
}

// =================================================================
// SLICE DEFINITION
// =================================================================

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        /**
         * Action to handle successful login.
         * Stores the accessToken and user details in the state.
         */
        setCredentials(state, action: PayloadAction<LoginSuccessPayload>) {
            const { user, tokens } = action.payload;
            state.user = user;
            state.accessToken = tokens.accessToken;
            // Persist the accessToken to localStorage for session persistence
            localStorage.setItem('authToken', tokens.accessToken);
        },
        /**
         * Action to clear credentials on logout.
         */
        logOut(state) {
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem('authToken');
        }
    }
});

export const { setCredentials, logOut } = userSlice.actions;

export default userSlice.reducer;

// =================================================================
// SELECTORS (Updated to use new state structure and camelCase properties)
// =================================================================

export const selectCurrentUser = (state: RootState): User | null => state.user.user;
export const selectCurrentToken = (state: RootState): string | null => state.user.accessToken;
export const selectIsAuthenticated = (state: RootState): boolean => !!state.user.accessToken;
export const selectCurrentUserId = (state: RootState): number | undefined => state.user.user?.userId;
export const selectUserRole = (state: RootState): string | undefined => state.user.user?.role;