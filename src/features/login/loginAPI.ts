// 📁 features/login/loginAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../users/userSlice"; // Check if this path is correct, might be ../user/userSlice
import { APIDomain } from "../../utils/APIDomain";
import { RootState } from "../../app/store"; // Import RootState

export interface TTokens {
    accessToken: string;
    refreshToken: string;
}

export interface TLoginResponse {
    user: User;
    tokens: TTokens;
}

export interface LoginFormData {
    email: string;
    password: string;
}

// Renamed from loginAPI to authApi to match your store config
export const authApi = createApi({
    reducerPath: 'authApi', // This matches the key in your store
    baseQuery: fetchBaseQuery({
        baseUrl: APIDomain,
        prepareHeaders: (headers, { getState }) => {
            // 👇 FIX: Correct the path to the token in the Redux state
            const token = (getState() as RootState).user.accessToken;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginFormData>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const { useLoginUserMutation, useLogoutUserMutation } = authApi;