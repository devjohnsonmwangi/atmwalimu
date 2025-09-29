import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain"; // Assuming you have this config file


// =================================================================
// TYPE DEFINITIONS (The single source of truth for API data shapes)
// =================================================================

// --- Document Types ---
export interface Document {
  documentId: number;
  uploaderId: number | null;
  title: string;
  description: string | null;
  genre: string;
  documentUrl: string;
  price: number; // <-- CORRECTED: Changed from string to number for consistency
  isFree: boolean;
  isApproved: boolean;
  averageRating: string; // Kept as string, assuming it can be formatted like "4.5"
  isFeatured: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Type for the grouped library response
export interface GroupedDocumentsResponse {
    [genre: string]: Document[];
}

export interface DocumentQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: 'price' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface PaginatedDocumentsResponse {
  data: Document[];
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateDocumentPayload {
  title: string;
  description?: string;
  genre: string;
  price: number; // This was already correct (number)
  file: File;
  isFeatured?: boolean;
}

export interface UploadForApprovalPayload {
    title: string;
    description: string;
    genre: string;
    file: File;
}

export interface ApproveDocumentPayload {
    documentId: number;
    updates: {
        isApproved: boolean;
        price?: number; // Price is correctly a number here
        genre?: string;
    };
}

// CORRECTED: This now correctly references `price` as a number from the Document interface
export type UpdateDocumentPayload = { documentId: number } & Partial<Pick<Document, 'title' | 'description' | 'price' | 'isFeatured' | 'genre'>>;

// --- Payment Types ---
export interface InitiateDocumentPaymentPayload {
  documentId: number;
  phoneNumber: string;
}

export interface InitiateSubscriptionPaymentPayload {
  planId: number;
  phoneNumber: string;
}

export interface InitiateBulkPaymentPayload {
  documentIds: number[];
  phoneNumber: string;
}

export interface PaymentResponse {
  paymentId: number;
  userId: number;
  documentId: number | null;
  planId: number | null;
  documentIds: number[] | null;
  amount: string; // Often a string from payment APIs to handle decimal precision
  status: 'pending' | 'completed' | 'failed';
  checkoutRequestId: string;
  mpesaReceiptNumber: string | null;
  createdAt: string;
}

// =================================================================
// API SLICE DEFINITION
// =================================================================

export const documentsApi = createApi({
  reducerPath: "documentsApi",
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
  tagTypes: ["Document", "DocumentsList", "UserLibrary", "PendingDocuments"],
  endpoints: (builder) => ({

    // =================== PUBLIC / GUEST ENDPOINTS ===================

    fetchDocuments: builder.query<PaginatedDocumentsResponse, DocumentQueryParams>({
      query: (params) => ({ url: 'documents', params }),
      providesTags: (result) => result
        ? [
            ...result.data.map(({ documentId }) => ({ type: 'Document' as const, id: documentId })),
            { type: 'DocumentsList', id: 'PAGINATED' },
          ]
        : [{ type: 'DocumentsList', id: 'PAGINATED' }],
    }),

    fetchDocumentById: builder.query<Document, number>({
      query: (documentId) => `documents/${documentId}`,
      providesTags: (_, __, documentId) => [{ type: 'Document', id: documentId }],
    }),

    fetchDocumentsByGenre: builder.query<GroupedDocumentsResponse, void>({
        query: () => 'documents/library',
        providesTags: (result) => result
          ? [
              ...Object.values(result).flat().map(({ documentId }) => ({ type: 'Document' as const, id: documentId })),
              { type: 'DocumentsList', id: 'GROUPED_BY_GENRE' },
            ]
          : [{ type: 'DocumentsList', id: 'GROUPED_BY_GENRE' }],
    }),


    // =================== AUTHENTICATED USER ENDPOINTS ===================

    fetchMyLibrary: builder.query<Document[], void>({
        query: () => 'documents/me/library',
        providesTags: [{ type: 'UserLibrary', id: 'CURRENT_USER' }]
    }),

    uploadDocumentForApproval: builder.mutation<Document, UploadForApprovalPayload>({
        query: ({ file, ...metadata }) => {
            const formData = new FormData();
            formData.append('file', file);
            Object.entries(metadata).forEach(([key, value]) => {
              formData.append(key, value.toString());
            });
            return {
                url: 'documents/upload-for-approval',
                method: 'POST',
                body: formData,
            };
        },
    }),

    // =================== ADMIN-ONLY ENDPOINTS ===================

    createDocument: builder.mutation<Document, CreateDocumentPayload>({
      query: ({ file, ...metadata }) => {
        const formData = new FormData();
        formData.append('file', file);
        // This logic is fine, as .toString() works correctly on numbers, booleans, etc.
        Object.entries(metadata).forEach(([key, value]) => {
          if (value !== undefined) { // Ensure optional fields aren't sent if they're undefined
            formData.append(key, value.toString());
          }
        });
        return { url: 'documents/upload', method: 'POST', body: formData };
      },
      invalidatesTags: [{ type: 'DocumentsList', id: 'PAGINATED' }, { type: 'DocumentsList', id: 'GROUPED_BY_GENRE' }],
    }),

    updateDocument: builder.mutation<Document, UpdateDocumentPayload>({
      query: ({ documentId, ...patch }) => ({
        url: `documents/${documentId}`,
        method: 'PATCH',
        body: patch, // For JSON patches, no need for FormData
      }),
      invalidatesTags: (_, __, { documentId }) => [
        { type: 'Document', id: documentId },
        { type: 'DocumentsList', id: 'PAGINATED' },
        { type: 'DocumentsList', id: 'GROUPED_BY_GENRE' }
      ],
    }),

    updateDocumentFeaturedStatus: builder.mutation<Document, { documentId: number; isFeatured: boolean }>({
        query: ({ documentId, ...patch }) => ({ url: `documents/${documentId}`, method: 'PATCH', body: patch }),
        // Optimistic update example
        async onQueryStarted({ documentId, isFeatured }, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
                documentsApi.util.updateQueryData('fetchDocuments', {} as DocumentQueryParams, (draft) => {
                    const doc = draft.data.find(d => d.documentId === documentId);
                    if (doc) doc.isFeatured = isFeatured;
                })
            );
            try { await queryFulfilled; } catch { patchResult.undo(); }
        },
        invalidatesTags: (_, __, { documentId }) => [{ type: 'Document', id: documentId }],
    }),

    deleteDocument: builder.mutation<void, number>({
      query: (documentId) => ({ url: `documents/${documentId}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'DocumentsList', id: 'PAGINATED' }, { type: 'DocumentsList', id: 'GROUPED_BY_GENRE' }],
    }),

    fetchPendingDocuments: builder.query<Document[], void>({
        query: () => 'documents/pending-approval',
        providesTags: [{ type: 'PendingDocuments', id: 'LIST' }],
    }),

    approveDocument: builder.mutation<Document, ApproveDocumentPayload>({
        query: ({ documentId, updates }) => ({
            url: `documents/approve/${documentId}`,
            method: 'PATCH',
            body: updates,
        }),
        invalidatesTags: [
            { type: 'PendingDocuments', id: 'LIST' },
            { type: 'DocumentsList', id: 'PAGINATED' },
            { type: 'DocumentsList', id: 'GROUPED_BY_GENRE' }
        ],
    }),


    // =================== PAYMENT & DOWNLOAD FLOW ===================

    initiateDocumentPayment: builder.mutation<PaymentResponse, InitiateDocumentPaymentPayload>({
        query: (payload) => ({ url: 'payments/initiate-document', method: 'POST', body: payload })
    }),

    initiateBulkPayment: builder.mutation<PaymentResponse, InitiateBulkPaymentPayload>({
      query: (payload) => ({ url: 'payments/initiate-bulk', method: 'POST', body: payload })
    }),

    initiateSubscriptionPayment: builder.mutation<PaymentResponse, InitiateSubscriptionPaymentPayload>({
      query: (payload) => ({ url: 'payments/initiate-subscription', method: 'POST', body: payload })
    }),

    confirmPayment: builder.query<PaymentResponse, string>({
        query: (checkoutRequestId) => `payments/confirm/${checkoutRequestId}`,
        async onQueryStarted(_, { queryFulfilled, dispatch }) {
            try {
                const { data: result } = await queryFulfilled;
                if (result.status === 'completed') {
                    dispatch(documentsApi.util.invalidateTags([{ type: 'UserLibrary', id: 'CURRENT_USER' }]));
                }
            } catch (err) {
                console.error("Payment confirmation poll failed:", err);
            }
        }
    }),

    getDownloadableDocument: builder.mutation<Document, number>({
        query: (documentId) => ({ url: `documents/${documentId}/download`, method: 'GET' }),
        invalidatesTags: (_, __, documentId) => [{ type: 'Document', id: documentId }],
    }),
  }),
});

// =================================================================
// EXPORTED HOOKS (Auto-generated for use in React components)
// =================================================================

export const {
  // --- Document Query Hooks ---
  useFetchDocumentsQuery,
  useLazyFetchDocumentsQuery,
  useFetchDocumentByIdQuery,
  useFetchMyLibraryQuery,
  useFetchDocumentsByGenreQuery,

  // --- User & Admin Mutation Hooks ---
  useUploadDocumentForApprovalMutation,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useUpdateDocumentFeaturedStatusMutation,
  useDeleteDocumentMutation,
  useFetchPendingDocumentsQuery,
  useApproveDocumentMutation,

  // --- Payment & Download Hooks ---
  useInitiateDocumentPaymentMutation,
  useInitiateBulkPaymentMutation,
  useInitiateSubscriptionPaymentMutation,
  useLazyConfirmPaymentQuery,
  useGetDownloadableDocumentMutation,
} = documentsApi;