import React, { useState } from 'react';
import {
  useGetCommentsForArticleQuery,
  useCreateCommentMutation,
  type Comment,
  
} from '../../features/articles/articlesApi';

// A helper component to render a single comment and its replies recursively
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="flex space-x-4">
      <img
        className="h-10 w-10 rounded-full object-cover mt-1"
        src={comment.user.profilePictureUrl || `https://ui-avatars.com/api/?name=${comment.user.fullName.replace(/\s/g, '+')}&background=random`}
        alt={`Profile of ${comment.user.fullName}`}
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold text-gray-900">{comment.user.fullName}</p>
            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
          </div>
          <p className="text-gray-800 mt-2">{comment.content}</p>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-8 border-l-2 border-gray-200 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.commentId} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CommentsSectionProps {
  articleId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
  const { data: comments, isLoading, error } = useGetCommentsForArticleQuery(articleId);
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
  const [commentContent, setCommentContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await createComment({
        articleId,
        newComment: { content: commentContent },
      }).unwrap();
      setCommentContent(''); // Clear input on success
    } catch (err) {
      console.error('Failed to post comment:', err);
      // Here you could show an error toast to the user
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments?.length || 0})
      </h2>
      
      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Join the discussion..."
          disabled={isSubmitting}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !commentContent.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {isLoading && <p>Loading comments...</p>}
        {error && <p className="text-red-500">Could not load comments.</p>}
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} />
          ))
        ) : (
          !isLoading && <p className="text-gray-500">Be the first to comment.</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;