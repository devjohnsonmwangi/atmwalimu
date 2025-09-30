import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store"; // Adjust the path to your Redux store

// =================================================================
// TYPE DEFINITIONS (Directly mapped from your NestJS DTOs)
// =================================================================

/**
 * Represents the public-facing author/user information.
 * Mapped from: `AuthorDto` and `CommenterDto`
 */
export interface UserSummary {
    userId: number;
    fullName: string;
    profilePictureUrl: string | null;
}

/**
 * Represents a full Article object.
 * Mapped from: `ArticleResponseDto`
 */
export interface Article {
    articleId: number;
    author: UserSummary;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    status: 'draft' | 'published'; // Assuming articleStatusEnum values
    publishedAt: string | null; // Dates from JSON are strings
    createdAt: string;
    updatedAt: string;
    categories?: Category[]; 
}

/**
 * The response shape for the paginated articles endpoint.
 * Mapped from: `PaginatedArticlesResponseDto`
 */
export interface PaginatedArticlesResponse {
    data: Article[];
    totalItems: number;
    limit: number;
    currentPage: number;
    totalPages: number;
}

/**
 * Query parameters for searching and sorting articles.
 * Mapped from: `SearchArticlesQueryDto`
 */
export interface SearchArticlesQuery {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt';
    order?: 'asc' | 'desc';
}

/**
 * The data transfer object for creating a new article.
 * Mapped from: `CreateArticleDto`
 */
export type CreateArticleDto = {
    title: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    categoryIds?: number[];
};

/**
 * The data transfer object for updating an article.
 * Mapped from: `UpdateArticleDto`
 */
export type UpdateArticleDto = Partial<Omit<CreateArticleDto, 'categoryIds'> & { status?: 'draft' | 'published' }>;


// --- Category Types ---

/**
 * Represents a Category object.
 * Mapped from: `CategoryResponseDto`
 */
export interface Category {
    categoryId: number;
    name: string;
    slug: string;
}

/**
 * The data transfer object for creating a new category.
 * Mapped from: `CreateCategoryDto`
 */
export type CreateCategoryDto = Pick<Category, 'name'>;


// --- Comment Types ---

/**
 * Represents a Comment object, including potential replies (threading).
 * Mapped from: `CommentResponseDto`
 */
export interface Comment {
    commentId: number;
    articleId: number;
    user: UserSummary;
    content: string;
    createdAt: string;
    replies?: Comment[];
}

/**
 * The data transfer object for creating a new comment.
 * Mapped from: `CreateCommentDto`
 */
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
    baseUrl: "/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Article", "ArticleList", "Category", "Comment"],
  endpoints: (builder) => ({

    // =================== Articles Endpoints ===================

    getArticles: builder.query<PaginatedArticlesResponse, SearchArticlesQuery>({
      query: (params) => ({ url: "articles", params }),
      providesTags: (result) => result
        ? [
            ...result.data.map(({ articleId }) => ({ type: "Article" as const, id: articleId })),
            { type: "ArticleList", id: "LIST" },
          ]
        : [{ type: "ArticleList", id: "LIST" }],
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
      invalidatesTags: [{ type: "ArticleList", id: "LIST" }],
    }),

    updateArticle: builder.mutation<Article, { id: number } & UpdateArticleDto>({
      query: ({ id, ...patch }) => ({
        url: `articles/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Article", id }],
    }),

    deleteArticle: builder.mutation<void, number>({
      query: (id) => ({
        url: `articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ArticleList", id: "LIST" }],
    }),

    // =================== Categories Endpoints ===================
 getCategories: builder.query<Category[], void>({
      query: () => "categories",
      providesTags: (result) => result
        ? [
            ...result.map(({ categoryId }) => ({ type: "Category" as const, id: categoryId })),
            { type: "Category", id: "LIST" },
          ]
        : [{ type: "Category", id: "LIST" }],
    }),

    // --- ADD THE FOLLOWING MUTATIONS ---

    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (newCategory) => ({
        url: 'categories',
        method: 'POST',
        body: newCategory,
      }),
      // When this mutation runs, it invalidates the 'LIST' tag,
      // forcing the getCategories query to refetch.
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
  // (We will add category mutation hooks when we build those components)

  // Comment Hooks
  useGetCommentsForArticleQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = articlesApi;