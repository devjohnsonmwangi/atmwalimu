// src/features/users/usersAPI.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";

// =================================================================
// INTERFACES
// =================================================================

/**
 * Represents the user data structure received from the API.
 * Matches the UserResponseDto from the backend.
 */
export interface UserApiResponse {
  userId: number;
  fullName: string;
  email: string;
  profilePictureUrl?: string | null;
  bio?: string;
  role: "admin" | "user" | "teacher" | "lecturer" | "student" | "blogger" | "tutor";
  reputationScore?: number;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents user data used within the client, potentially including a password for forms.
 */
export interface UserDataTypes extends UserApiResponse {
  password?: string;
}

/**
 * Defines the payload for updating a user's general profile information.
 */
export interface UserUpdatePayload extends Partial<Omit<UserApiResponse, 'userId' | 'createdAt' | 'updatedAt' | 'role'>> {}

/**
 * NEW: Defines the payload for an admin updating a user's role.
 */
export interface UpdateUserRolePayload {
  role: UserApiResponse['role'];
}

// Password-related interfaces
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
          ? [
              ...result.map(({ userId }) => ({ type: 'User' as const, id: userId })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    fetchUsersByRole: builder.query<UserApiResponse[], string>({
      query: (role) => `users/roles/${role}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({ type: 'User' as const, id: userId })),
              { type: 'Users', id: 'ROLES_LIST' },
            ]
          : [{ type: 'Users', id: 'ROLES_LIST' }],
    }),

    updateUser: builder.mutation<UserApiResponse, { userId: number } & UserUpdatePayload>({
        query: (payloadToSend) => ({
            url: `users/me`, // This now correctly points to the endpoint for a user updating their own profile
            method: "PATCH", // Corrected from PUT to PATCH for partial updates
            body: payloadToSend,
        }),
        invalidatesTags: (_, __, { userId }) => [{ type: 'User', id: userId }, { type: 'Users', id: 'LIST' }],
    }),

    /**
     * NEW: Mutation for admins to update a user's role.
     * This hits the new PATCH /users/:id/role endpoint.
     */
    updateUserRoleByAdmin: builder.mutation<UserApiResponse, { userId: number } & UpdateUserRolePayload>({
      query: ({ userId, ...payloadToSend }) => ({
        url: `users/${userId}/role`,
        method: 'PATCH',
        body: payloadToSend, // Body will be { "role": "new-role" }
      }),
      // Invalidate the specific user's cache and the list of all users
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

// Auto-generated hooks, now including the new useUpdateUserRoleByAdminMutation
export const {
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useFetchUsersQuery,
  useFetchUsersByRoleQuery,
  useUpdateUserMutation,
  useUpdateUserRoleByAdminMutation, // <-- New hook is exported
  useDeleteUserMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = usersAPI;