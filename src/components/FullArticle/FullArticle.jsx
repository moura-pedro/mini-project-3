import { useMemo } from 'react'
import './FullArticle.css'

function FullArticle({ article, onBack }) {
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const readabilityInfo = useMemo(() => {
    const { readabilityMetrics } = article;
    return [
      {
        label: 'Reading Level',
        value: readabilityMetrics.gradeLevel
      },
      {
        label: 'Flesch Index',
        value: readabilityMetrics.fleschIndex.toFixed(1)
      },
      {
        label: 'Word Count',
        value: readabilityMetrics.words
      },
      {
        label: 'Sentence Count',
        value: readabilityMetrics.sentences
      },
      {
        label: 'Syllable Count',
        value: readabilityMetrics.syllables
      }
    ];
  }, [article]);

  return (
    <article className="full-article">
      <button className="back-button" onClick={onBack}>
        ← Back to Articles
      </button>

      <div className="article-header">
        <div className="topic-badge">{article.topic}</div>
        <h1>{article.title}</h1>
        
        <div className="article-meta">
          <span className="article-date">{formatDate(article.published_date)}</span>
          <span className="article-source">
            Source: <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.domain}
            </a>
          </span>
        </div>
      </div>

      {article.large_image_url && (
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
      )}

      <div className="article-body">
        <div className="content-section">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <aside className="readability-metrics">
          <h2>Readability Analysis</h2>
          <div className="metrics-grid">
            {readabilityInfo.map(({ label, value }) => (
              <div key={label} className="metric-item">
                <span className="metric-label">{label}</span>
                <span className="metric-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="readability-guide">
            <h3>Flesch Index Guide</h3>
            <ul>
              <li>90-100: Very easy (5th grade)</li>
              <li>80-89: Easy (6th grade)</li>
              <li>70-79: Fairly easy (7th grade)</li>
              <li>60-69: Standard (8th-9th grade)</li>
              <li>50-59: Fairly difficult (10th-12th grade)</li>
              <li>30-49: Difficult (College)</li>
              <li>0-29: Very difficult (College graduate)</li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

export default FullArticle;