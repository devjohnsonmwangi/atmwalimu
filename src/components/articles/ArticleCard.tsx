import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed
import type { Article } from '../../features/articles/articlesApi'; // Import the type definition from our API slice

interface ArticleCardProps {
  /** The full article object to display. */
  article: Article;
}

/**
 * A reusable UI card to display a summary of an article.
 * It links to the full article detail page.
 */
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  /**
   * Formats a date string into a more readable format, e.g., "October 25, 2025".
   * @param dateString The ISO date string from the API.
   * @returns A formatted, human-readable date string.
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col group">
      {/* Article Content Section */}
      <div className="p-6 flex-grow">
        <p className="text-sm text-gray-500 mb-2">
          {formatDate(article.createdAt)}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          <Link to={`/articles/${article.slug}`} className="focus:outline-none">
            {/* This invisible overlay makes the entire card clickable, improving accessibility */}
            <span className="absolute inset-0" aria-hidden="true"></span>
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 text-gray-700 leading-relaxed">
          {article.excerpt}
        </p>
      </div>

      {/* Author Footer Section */}
      <div className="bg-gray-50 px-6 py-4 mt-auto">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={article.author.profilePictureUrl || `https://ui-avatars.com/api/?name=${article.author.fullName.replace(/\s/g, '+')}&background=random`}
            alt={`Profile of ${article.author.fullName}`}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{article.author.fullName}</p>
            {/* You could add the author's role or other info here if needed */}
            {/* <p className="text-xs text-gray-500">Editor</p> */}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;