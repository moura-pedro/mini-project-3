import { useState, useEffect } from 'react'
import { fetchArticles } from '../../helpers/fetchArticle'
import './Search.css'

const countSentences = (text) => {
  return (text.match(/[.!?:;]+/g) || []).length;
}

const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

const countSyllables = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  return words.reduce((total, word) => {
    if (word.length <= 3) return total + 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return total + (syllables ? syllables.length : 1);
  }, 0);
}

const computeFleschIndex = (syllables, words, sentences) => {
  if (sentences === 0 || words === 0) return 0;
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

const classifyReadability = (fleschIndex) => {
  if (fleschIndex >= 90) return '5th grade';
  if (fleschIndex >= 80) return '6th grade';
  if (fleschIndex >= 70) return '7th grade';
  if (fleschIndex >= 60) return '8th & 9th grade';
  if (fleschIndex >= 50) return '10th to 12th grade';
  if (fleschIndex >= 30) return 'College';
  return 'College graduate';
}

function Search({ setArticles }) {
  const [gradeLevel, setGradeLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchArticles();

        // Process articles with readability scores
        const processedArticles = data.map(article => {
          const sentences = countSentences(article.content);
          const words = countWords(article.content);
          const syllables = countSyllables(article.content);
          const fleschIndex = computeFleschIndex(syllables, words, sentences);

          return {
            ...article,
            readabilityMetrics: {
              fleschIndex,
              gradeLevel: classifyReadability(fleschIndex),
              sentences,
              words,
              syllables
            }
          };
        });

        setAllArticles(processedArticles);
        setArticles(processedArticles);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadArticles();
  }, [setArticles]);

  const handleGradeLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setGradeLevel(selectedLevel);

    const filteredArticles = selectedLevel === 'all'
      ? allArticles
      : allArticles.filter(article =>
        article.readabilityMetrics.gradeLevel === selectedLevel
      );

    setArticles(filteredArticles);
  };

  if (loading) return (
    <div className="search-loading">
      <div className="loading-spinner"></div>
      <p>Loading articles...</p>
    </div>
  );

  if (error) return (
    <div className="search-error">
      <p>Error loading articles: {error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="search-container">
      <h2>Search Articles by Reading Level</h2>
      <div className="search-controls">
        <select
          value={gradeLevel}
          onChange={handleGradeLevelChange}
          className="grade-select"
        >
          <option value="all">All Reading Levels</option>
          <option value="5th grade">5th Grade</option>
          <option value="6th grade">6th Grade</option>
          <option value="7th grade">7th Grade</option>
          <option value="8th & 9th grade">8th & 9th Grade</option>
          <option value="10th to 12th grade">10th-12th Grade</option>
          <option value="College">College</option>
          <option value="College graduate">College Graduate</option>
        </select>
      </div>

      <div className="search-stats">
        <p>Showing {allArticles.length} articles</p>
      </div>
    </div>
  )
}

export default Search