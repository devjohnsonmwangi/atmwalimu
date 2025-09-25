// 📁 services/teamApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIDomain } from '../../utils/APIDomain';
import { RootState } from '../../app/store';

// It's a good practice to define the expected response type
export interface TeamMember {
  userId: number;
  fullName: string;
  email: string;
  role: string;
    profilePictureUrl?: string | null; // Changed from profile_picture
  bio?: string; // Added field

  reputationScore?: number; // Added field
  socialLinks?: Record<string, string>; // Added field, assuming an object of key-value pairs
  createdAt: string; // Changed from created_at
  updatedAt: string; // Changed from updated_at
  // Add other relevant fields for a team member
}

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    /**
     * Prepares the headers for each request. This function retrieves the
     * authentication token from the Redux store and adds it to the
     * Authorization header.
     */
    prepareHeaders: (headers, { getState }) => {
      // CORRECTLY get the accessToken from the updated userSlice state
      const token = (getState() as RootState).user.accessToken;

      if (token) {
        // Ensure the standard 'Bearer' scheme is used
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  // Define tags for caching and invalidation
  tagTypes: ['Team'],
  endpoints: (builder) => ({
    /**
     * Fetches users grouped by their roles.
     * This endpoint will now automatically include the Authorization header.
     */
    getTeamByRoles: builder.query<Record<string, TeamMember[]>, void>({
      query: () => 'users/roles',
      // Provides a tag for caching purposes
      providesTags: ['Team'],
    }),
    // You can add other endpoints here, and they will also benefit from prepareHeaders
  }),
});

// Auto-generated hook for the endpoint
export const { useGetTeamByRolesQuery } = teamApi;