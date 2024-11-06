import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../User/User'
import './Search.css'

// Utility functions for readability calculations
const countSentences = (text) => {
  return (text.match(/[.!?:;]+/g) || []).length;
};

const countWords = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const countSyllables = (text) => {
  const words = text.toLowerCase().split(/\s+/);
  return words.reduce((total, word) => {
    // Count syllables based on the rules from a youtube video:
    // https://www.youtube.com/watch?v=oPNAYXxxRUs&t=127s
    if (word.length <= 3) return total + 1;

    // Remove common suffixes
    word = word.replace(/(?:[^aeiouy]es|ed|[^aeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    // Count syllables based on vowel groups
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return total + (syllables ? syllables.length : 1);
  }, 0);
};

const computeFleschIndex = (syllables, words, sentences) => {
  if (sentences === 0 || words === 0) return 0;
  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
};

const classifyReadability = (fleschIndex) => {
  if (fleschIndex >= 90) return '5th grade';
  if (fleschIndex >= 80) return '6th grade';
  if (fleschIndex >= 70) return '7th grade';
  if (fleschIndex >= 60) return '8th & 9th grade';
  if (fleschIndex >= 50) return '10th to 12th grade';
  if (fleschIndex > 30) return 'College';
  return 'College graduate';
};

function Search({ setArticles }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [gradeLevel, setGradeLevel] = useState('all');
  const { preferences, filterArticles } = useContext(UserContext);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/news_articles.json');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();

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

        // Apply initial filtering
        const filteredArticles = applyFilters(processedArticles, gradeLevel, preferences);
        setArticles(filteredArticles);

        setLoading(false);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Function to apply both topic and grade level filters
  const applyFilters = (articles, currentGradeLevel) => {
    // First apply topic filter
    let filtered = filterArticles(articles);

    // Then apply grade level filter
    if (currentGradeLevel !== 'all') {
      filtered = filtered.filter(article =>
        article.readabilityMetrics.gradeLevel === currentGradeLevel
      );
    }

    return filtered;
  };

  // Update articles when preferences or grade level changes
  useEffect(() => {
    const filtered = applyFilters(allArticles, gradeLevel, preferences);
    setArticles(filtered);
  }, [preferences, gradeLevel, allArticles]);

  const handleGradeLevelChange = (e) => {
    const newGradeLevel = e.target.value;
    setGradeLevel(newGradeLevel);
  };

  if (loading) {
    return <div className="search-loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="search-error">Error: {error}</div>;
  }

  return (
    <div className="search-container">
      <div className="search-logo">
        <h2>ArticleSearch</h2>
        <h3>by Group 7</h3>
      </div>

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

      {/*  For debugging  */}
      {preferences.selectedTopics.length > 0 && (
        <div className="active-filters">
          <p>Filtering by topics: {preferences.selectedTopics.join(', ')}</p>
        </div>
      )}

      {preferences.selectedTopics.length === 0 && (
        <div className="search-notice">
          <p>Showing all topics. Visit Preferences to filter by specific topics.</p>
        </div>
      )}
    </div>
  );
}

export default Search;