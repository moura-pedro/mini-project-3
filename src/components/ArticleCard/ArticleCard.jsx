import { useState } from 'react';
import './ArticleCard.css';

function ArticleCard({ article, onClick }) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  return (
    <div className="article-card" onClick={onClick}>
      {/* Image Container */}
      <div className="article-image-container">
        {!imageError ? (
          <img
            src={article.large_image_url}
            alt={article.title}
            onError={() => setImageError(true)}
            className="article-image"
          />
        ) : (
          <div className="article-image-fallback" />
        )}
        <div className="article-topic">{article.topic}</div>
      </div>

      <div className="article-content">
        {/* Source Link */}
        <a href={article.link} className="article-source" onClick={e => e.stopPropagation()}>
          {article.domain}
        </a>

        {/* Title */}
        <h3 className="article-title">
          {truncateText(article.title, 100)}
        </h3>

        {/* Date */}
        <div className="article-date">
          {formatDate(article.published_date)}
        </div>

        {/* Preview Text */}
        <p className="article-preview">
          {truncateText(article.content, 150)}
        </p>
      </div>
    </div>
  );
}

export default ArticleCard;