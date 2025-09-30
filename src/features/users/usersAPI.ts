// src/features/users/usersAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Adjust path to your domain utility

// =================================================================
// INTERFACES (Aligned with Backend DTO)
// =================================================================

export interface UserApiResponse {
  userId: number;
  fullName: string;
  email: string;
  profilePictureUrl?: string | null;
  bio?: string;
  role: "admin" | "user" | "teacher" | "lecturer" | "student" | "blogger" | "tutor";
  reputationScore?: number;
  socialLinks?: {
    twitter?: string;
    linkedIn?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserDataTypes extends UserApiResponse {
  password?: string;
}

export interface UserUpdatePayload extends Partial<Omit<UserApiResponse, 'userId' | 'createdAt' | 'updatedAt' | 'role' | 'email' | 'reputationScore'>> {}

export interface UpdateUserRolePayload {
  role: UserApiResponse['role'];
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface PasswordActionResponse {
  msg: string;
}

export interface DeleteUserResponse {
    msg: string;
}

// =================================================================
// API DEFINITION
// =================================================================

export const usersAPI = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  refetchOnReconnect: true,
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
    // === User CRUD & Fetch Endpoints ===

    registerUser: builder.mutation<UserApiResponse, Omit<UserDataTypes, 'userId' | 'createdAt' | 'updatedAt' | 'role'>>({
      query: (newUser) => ({
        url: "auth/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    getUserById: builder.query<UserApiResponse, number>({
      query: (userId) => `users/${userId}`,
      providesTags: (_, __, id) => [{ type: "User", id }],
    }),

    fetchUsers: builder.query<UserApiResponse[], void>({
      query: () => "users",
      providesTags: (result) =>
        result
          ? [ ...result.map(({ userId }) => ({ type: 'User' as const, id: userId })), { type: 'Users', id: 'LIST' } ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    fetchUsersByRole: builder.query<UserApiResponse[], string>({
      query: (role) => `users/roles/${role}`,
      providesTags: (result) =>
        result
          ? [ ...result.map(({ userId }) => ({ type: 'User' as const, id: userId })), { type: 'Users', id: 'ROLES_LIST' } ]
          : [{ type: 'Users', id: 'ROLES_LIST' }],
    }),

    // =================================================================
    // === THE FINAL, BULLETPROOF updateUser MUTATION ===
    // This pattern explicitly removes the `userId` to satisfy both the backend and strict ESLint rules.
    // =================================================================
    updateUser: builder.mutation<UserApiResponse, { userId: number } & UserUpdatePayload>({
      query: (arg) => {
        // 1. Create a shallow copy of the argument object.
        const body = { ...arg };

        // 2. Explicitly delete the `userId` property from the copy.
        //    This guarantees it is NOT sent to the server.
        //    This also resolves any "unused variable" ESLint errors.
        delete (body as Partial<typeof body>).userId;

        return {
          url: `users/me`,
          method: "PATCH",
          body,
        };
      },
      // The original `userId` is still available in `arg` for invalidation logic.
      invalidatesTags: (_, __, { userId }) => [{ type: 'User', id: userId }, { type: 'Users', id: 'LIST' }],
    }),

    updateUserRoleByAdmin: builder.mutation<UserApiResponse, { userId: number } & UpdateUserRolePayload>({
      query: ({ userId, ...payloadToSend }) => ({
        url: `users/${userId}/role`,
        method: 'PATCH',
        body: payloadToSend,
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'User', id: userId }, { type: 'Users', id: 'LIST' }],
    }),

    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, userId) => [{ type: 'User', id: userId }, { type: 'Users', id: 'LIST' }],
    }),

    // === Password Management Endpoints ===
    requestPasswordReset: builder.mutation<PasswordActionResponse, PasswordResetRequestPayload>({
      query: (payload) => ({ url: `auth/request-password-reset`, method: "POST", body: payload }),
    }),
    resetPassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ url: `auth/reset-password`, method: "POST", body: payload }),
    }),
    changePassword: builder.mutation<PasswordActionResponse, ResetPasswordPayload>({
      query: (payload) => ({ url: `auth/change-password`, method: "POST", body: payload }),
    }),
  }),
});

// Auto-generated hooks for use in components
export const {
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useFetchUsersQuery,
  useFetchUsersByRoleQuery,
  useUpdateUserMutation,
  useUpdateUserRoleByAdminMutation,
  useDeleteUserMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = usersAPI;