import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store"; // Adjust path to your Redux store
import { APIDomain } from '../../utils/APIDomain'; // Adjust path to your API domain utility

// =================================================================
// TYPE DEFINITIONS
// (Mapped from your NestJS backend DTOs)
// =================================================================

export interface UserSummary {
  userId: number;
  fullName: string;
  profilePictureUrl: string | null;
}

export interface Article {
  articleId: number;
  author: UserSummary;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

export interface PaginatedArticlesResponse {
  data: Article[];
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export interface SearchArticlesQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export type CreateArticleDto = {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  categoryIds?: number[];
};

// Note: A regular user should not send the 'status' property when updating.
// The backend enforces this, but the type allows it for admin use.
export type UpdateArticleDto = Partial<Omit<CreateArticleDto, 'categoryIds'> & { status?: 'draft' | 'published' }>;

export interface Category {
  categoryId: number;
  name: string;
  slug: string;
}

export type CreateCategoryDto = Pick<Category, 'name'>;

export interface Comment {
  commentId: number;
  articleId: number;
  user: UserSummary;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: number;
}

// =================================================================
// API SLICE DEFINITION
// =================================================================

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: APIDomain ? `${APIDomain.replace(/\/+$/, '')}/` : '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Article",         // A single article detail
    "ArticleList",     // The public list of articles
    "AdminArticleList",// The admin's comprehensive list of all articles
    "UserArticleList", // A user's personal list of their own articles
    "Category",        // For categories (list and individual)
    "Comment"          // For comments, tagged by article ID for isolation
  ],
  endpoints: (builder) => ({

    // =================== Articles Endpoints ===================

    getArticles: builder.query<PaginatedArticlesResponse, SearchArticlesQuery>({
      query: (params) => ({ url: "articles", params }),
      providesTags: (result) => result
        ? [...result.data.map(({ articleId }) => ({ type: "Article" as const, id: articleId })), { type: "ArticleList", id: "LIST" }]
        : [{ type: "ArticleList", id: "LIST" }],
    }),

    getAdminArticles: builder.query<PaginatedArticlesResponse, SearchArticlesQuery>({
      query: (params) => ({ url: "articles/all", params }),
      providesTags: (result) => result
        ? [...result.data.map(({ articleId }) => ({ type: "Article" as const, id: articleId })), { type: "AdminArticleList", id: "LIST" }]
        : [{ type: "AdminArticleList", id: "LIST" }],
    }),

    getMyArticles: builder.query<PaginatedArticlesResponse, SearchArticlesQuery>({
      query: (params) => ({ url: "articles/my-articles", params }),
      providesTags: (result) => result
        ? [...result.data.map(({ articleId }) => ({ type: "Article" as const, id: articleId })), { type: "UserArticleList", id: "LIST" }]
        : [{ type: "UserArticleList", id: "LIST" }],
    }),

    getArticleBySlug: builder.query<Article, string>({
      query: (slug) => `articles/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Article", id: slug }],
    }),

    previewArticleBySlug: builder.query<Article, string>({
      query: (slug) => `articles/preview/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Article", id: slug }],
    }),

    createArticle: builder.mutation<Article, CreateArticleDto>({
      query: (newArticle) => ({
        url: "articles",
        method: "POST",
        body: newArticle,
      }),
      invalidatesTags: [
        { type: "AdminArticleList", id: "LIST" },
        { type: "UserArticleList", id: "LIST" }
      ],
    }),

    updateArticle: builder.mutation<Article, { id: number } & UpdateArticleDto>({
      query: ({ id, ...patch }) => ({
        url: `articles/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Article", id },
        { type: "ArticleList", id: "LIST" },
        { type: "AdminArticleList", id: "LIST" },
        { type: "UserArticleList", id: "LIST" }
      ],
    }),

    deleteArticle: builder.mutation<void, number>({
      query: (id) => ({
        url: `articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "ArticleList", id: "LIST" },
        { type: "AdminArticleList", id: "LIST" },
        { type: "UserArticleList", id: "LIST" }
      ],
    }),

    // =================== Categories Endpoints ===================

    getCategories: builder.query<Category[], void>({
      query: () => "categories",
      providesTags: (result) => result
        ? [...result.map(({ categoryId }) => ({ type: "Category" as const, id: categoryId })), { type: "Category", id: "LIST" }]
        : [{ type: "Category", id: "LIST" }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (newCategory) => ({
        url: 'categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Category, Partial<Category> & Pick<Category, 'categoryId'>>({
      query: ({ categoryId, ...patch }) => ({
        url: `categories/${categoryId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: 'Category', id: 'LIST' },
        { type: 'Category', id: categoryId }
      ],
    }),
    
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // =================== Comments Endpoints ===================

    getCommentsForArticle: builder.query<Comment[], number>({
      query: (articleId) => `articles/${articleId}/comments`,
      providesTags: (_result, _error, articleId) => [{ type: "Comment", id: articleId }],
    }),

    createComment: builder.mutation<void, { articleId: number; newComment: CreateCommentDto }>({
      query: ({ articleId, newComment }) => ({
        url: `articles/${articleId}/comments`,
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: (_result, _error, { articleId }) => [{ type: "Comment", id: articleId }],
    }),

    deleteComment: builder.mutation<void, { articleId: number; commentId: number }>({
      query: ({ articleId, commentId }) => ({
        url: `articles/${articleId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { articleId }) => [{ type: 'Comment', id: articleId }],
    }),
  }),
});

// =================================================================
// EXPORTED HOOKS
// =================================================================

export const {
  // Article Hooks
  useGetArticlesQuery,
  useGetAdminArticlesQuery,
  useGetMyArticlesQuery,
  useGetArticleBySlugQuery,
  usePreviewArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,

  // Category Hooks
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Comment Hooks
  useGetCommentsForArticleQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = articlesApi;