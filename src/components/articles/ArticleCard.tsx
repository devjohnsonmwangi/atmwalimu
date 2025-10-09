import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { Article } from '../../features/articles/articlesApi';
import { selectCurrentUserId, selectUserRole } from '../../features/users/userSlice';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const userId = useSelector(selectCurrentUserId);
  const userRole = useSelector(selectUserRole);
  const isOwner = userId && userId === article.author.userId;
  const isAdmin = userRole === 'admin';

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-in-out flex flex-col group relative">
      {/* Entire card is clickable */}
      <Link to={`/articles/${article.slug}`} aria-label={`Read article ${article.title}`} className="absolute inset-0 z-10 sm:rounded-xl" />

      {article.coverImageUrl && (
        <img src={article.coverImageUrl} alt={article.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4 sm:p-6 flex-grow">
        <p className="text-xs sm:text-sm text-gray-500 mb-1">{formatDate(article.createdAt)}</p>
  <h3 className="text-lg sm:text-2xl font-bold text-blue-600 transition-all duration-200 underline-border-hover">{article.title}</h3>
        <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-3">{article.excerpt}</p>
      </div>

      <div className="bg-gray-50 px-4 sm:px-6 py-3 mt-auto">
        <div className="flex items-center">
          <img
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
            src={article.author.profilePictureUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.fullName)}&background=random`}
            alt={`Profile of ${article.author.fullName}`}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{article.author.fullName}</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Link
              to={`/articles/${article.slug}`}
              className="relative z-20 inline-block px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </Link>

            {(isOwner || isAdmin) && (
              <Link
                to={`/articles/edit/${article.slug}`}
                className="relative z-20 inline-block px-3 py-1 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;