// src/components/ArticleCard.jsx
import { useState } from 'react'
import './ArticleCard.css'

function ArticleCard({ article, onClick }) {
    const [imageError, setImageError] = useState(false);

    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="article-card" onClick={onClick}>
            <div className="article-image-container">
                {!imageError ? (
                    <img
                        src={article.large_image_url}
                        alt={article.title}
                        onError={() => setImageError(true)}
                        className="article-image"
                    />
                ) : (
                    <div className="article-image-fallback">
                        <span>{article.domain}</span>
                    </div>
                )}
                <div className="article-topic">{article.topic}</div>
            </div>

            <div className="article-content">
                <h3 className="article-title">{truncateText(article.title, 100)}</h3>

                <div className="article-metadata">
                    <div className="article-date">{formatDate(article.published_date)}</div>
                    <div className="article-domain">{article.domain}</div>
                </div>

                <p className="article-excerpt">
                    {truncateText(article.content, 150)}
                </p>

                <div className="article-readability">
                    Reading Level: {article.readabilityMetrics?.gradeLevel || 'Not analyzed'}
                </div>
            </div>
        </div>
    )
}

export default ArticleCard