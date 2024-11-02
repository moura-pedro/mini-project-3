// src/components/Preferences.jsx
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../User/User';
import './Preferences.css';

function Preferences() {
  const { preferences, setSelectedTopics } = useContext(UserContext);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetch('/data/news_articles.json');
        const articles = await response.json();
        
        // Get unique topics and sort them
        const topics = [...new Set(articles.map(article => article.topic))]
          .sort((a, b) => a.localeCompare(b));
        
        setAvailableTopics(topics);
        setLoading(false);
      } catch (err) {
        console.error('Error loading topics:', err);
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  const handleTopicToggle = (topic) => {
    const currentTopics = preferences.selectedTopics;
    let newTopics;
    
    if (currentTopics.includes(topic)) {
      newTopics = currentTopics.filter(t => t !== topic);
    } else {
      newTopics = [...currentTopics, topic];
    }
    
    setSelectedTopics(newTopics);
  };

  const handleSelectAll = () => {
    setSelectedTopics(availableTopics);
  };

  const handleClearAll = () => {
    setSelectedTopics([]);
  };

  if (loading) {
    return <div className="preferences-loading">Loading preferences...</div>;
  }

  return (
    <div className="preferences-container">
      <h2>Your Preferences</h2>
      
      <section className="preferences-section">
        <h3>Topics of Interest</h3>
        <p className="section-description">
          Select the topics you're interested in to filter articles.
        </p>

        <div className="topics-stats">
          <span>
            {preferences.selectedTopics.length} of {availableTopics.length} topics selected
          </span>
          <div className="topics-actions">
            <button onClick={handleSelectAll} className="topic-action-btn">
              Select All
            </button>
            <button onClick={handleClearAll} className="topic-action-btn">
              Clear All
            </button>
          </div>
        </div>

        <div className="topics-grid">
          {availableTopics.map(topic => (
            <label key={topic} className="topic-checkbox">
              <input
                type="checkbox"
                checked={preferences.selectedTopics.includes(topic)}
                onChange={() => handleTopicToggle(topic)}
              />
              <span className="checkbox-custom"></span>
              <span className="topic-name">{topic}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Preferences;