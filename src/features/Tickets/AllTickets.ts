import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APIDomain } from '../../utils/APIDomain'; // Your API base URL
import type { RootState } from '../../app/store';

// =========================================================================
// --- Type Definitions (Corrected to Match NestJS DTOs) ---
// =========================================================================

/**
 * Represents the sender of a message, matching the `SenderDto`.
 */
export interface UserSummary {
  userId: number;
  fullName: string;
  email: string; // Optional but useful
}

/**
 * Represents a single message, matching the `TicketMessageDto`.
 */
export interface SupportMessage {
  messageId: number;
  message: string; // CORRECTED: Was 'content'
  createdAt: string;
  sender: UserSummary; // CORRECTED: Was 'author'
}

/**
 * Represents a full support ticket object, matching the `SupportTicketResponseDto`.
 */
export interface SupportTicket {
  ticketId: number;
  userId: number;
  assigneeId: number | null;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
  messages: SupportMessage[];
}

/**
 * Data for creating a new ticket, matching `CreateSupportTicketDto`.
 */
export interface CreateTicketDto {
  subject: string;
  description: string; // CORRECTED: Was 'initialMessage'
}

/**
 * Data for adding a new message, matching `AddMessageDto`.
 */
export interface AddMessageDto {
  message: string; // CORRECTED: Was 'content'
}

/**
 * Data for updating a ticket's metadata (Admin only), matching `UpdateTicketDto`.
 */
export interface UpdateTicketDto {
  status?: 'open' | 'in_progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  assigneeId?: number;
}


// =========================================================================
// --- RTK Query API Slice Definition ---
// =========================================================================

export const supportTicketApi = createApi({
  reducerPath: 'supportTicketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['SupportTicket', 'SupportTicketList'],
  endpoints: (builder) => ({
    // ================== USER-FACING ENDPOINTS ==================
    createUserTicket: builder.mutation<SupportTicket, CreateTicketDto>({
      query: (newTicketData) => ({
        url: 'support-tickets',
        method: 'POST',
        body: newTicketData,
      }),
      invalidatesTags: ['SupportTicketList'],
    }),
    getUserTickets: builder.query<SupportTicket[], void>({
      query: () => 'support-tickets',
      providesTags: ['SupportTicketList'],
    }),
    getUserTicketById: builder.query<SupportTicket, number>({
      query: (ticketId) => `support-tickets/${ticketId}`,
      providesTags: (_result, _error, ticketId) => [{ type: 'SupportTicket', id: ticketId }],
    }),
    addUserMessage: builder.mutation<void, { ticketId: number; data: AddMessageDto }>({
      query: ({ ticketId, data }) => ({
        url: `support-tickets/${ticketId}/messages`,
        method: 'POST',
        body: data, // CORRECTED: Pass the data object directly
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [{ type: 'SupportTicket', id: ticketId }],
    }),

    // ================== ADMIN-ONLY ENDPOINTS ==================
    getAllTicketsForAdmin: builder.query<SupportTicket[], void>({
      query: () => 'admin/support-tickets',
      providesTags: ['SupportTicketList'],
    }),
    getTicketByIdForAdmin: builder.query<SupportTicket, number>({
      query: (ticketId) => `admin/support-tickets/${ticketId}`,
      providesTags: (_result, _error, ticketId) => [{ type: 'SupportTicket', id: ticketId }],
    }),
    addMessageForAdmin: builder.mutation<void, { ticketId: number; data: AddMessageDto }>({
      query: ({ ticketId, data }) => ({
        url: `admin/support-tickets/${ticketId}/messages`,
        method: 'POST',
        body: data, // CORRECTED: Pass the data object directly
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [{ type: 'SupportTicket', id: ticketId }],
    }),
    updateTicketForAdmin: builder.mutation<SupportTicket, { ticketId: number; data: UpdateTicketDto }>({
      query: ({ ticketId, data }) => ({
        url: `admin/support-tickets/${ticketId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: 'SupportTicket', id: ticketId },
        'SupportTicketList',
      ],
    }),
  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useCreateUserTicketMutation,
  useGetUserTicketsQuery,
  useGetUserTicketByIdQuery,
  useAddUserMessageMutation,
  useGetAllTicketsForAdminQuery,
  useGetTicketByIdForAdminQuery,
  useAddMessageForAdminMutation,
  useUpdateTicketForAdminMutation,
} = supportTicketApi;