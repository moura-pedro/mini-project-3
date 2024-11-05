// src/components/FullArticle/FullArticle.jsx
import { useMemo } from 'react';
import './FullArticle.css';

function FullArticle({ article, onBack }) {
  const readabilityInfo = useMemo(() => [
    { label: 'Word Count', value: article.readabilityMetrics.words },
    { label: 'Sentence Count', value: article.readabilityMetrics.sentences },
    { label: 'Syllable Count', value: article.readabilityMetrics.syllables },
    { label: 'Flesch Index', value: article.readabilityMetrics.fleschIndex.toFixed(14) },
    { label: 'Grade Level', value: article.readabilityMetrics.gradeLevel }
  ], [article]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="full-article">
      {/* Back Button */}
      <button onClick={onBack} className="back-button">
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Articles
      </button>

      {/* Main Article Content */}
      <article className="article-content">
        {/* Article Image */}
        <div className="article-image-container">
          <img 
            src={article.large_image_url} 
            alt={article.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Article Source Link */}
        <a href={article.link} className="article-link" target="_blank" rel="noopener noreferrer">
          {article.domain}
        </a>

        {/* Article Title */}
        <h2 className="article-title">{article.title}</h2>

        {/* Article Date */}
        <div className="article-date">{formatDate(article.published_date)}</div>

        {/* Article Type/Topic */}
        <div className="article-type">{article.topic}</div>

        {/* Article Content */}
        <div className="article-text">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Readability Metrics */}
        <div className="metrics-table">
          {readabilityInfo.map(({ label, value }, index) => (
            <div key={label} className={`metric-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
              <span className="metric-label">{label}</span>
              <span className="metric-value">{value}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default FullArticle;