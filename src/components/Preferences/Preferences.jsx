import { useState, useContext } from 'react';
import { UserContext } from '../User/User';
import './Preferences.css';

function Preferences({ onClose }) {
  const { preferences, setSelectedTopics } = useContext(UserContext);

  const categories = [
    { id: 'science', name: 'SCIENCE', icon: '🔬' },
    { id: 'technology', name: 'TECHNOLOGY', icon: '💻' },
    { id: 'health', name: 'HEALTH', icon: '⚕' },
    { id: 'world', name: 'WORLD', icon: '🌎' },
    { id: 'entertainment', name: 'ENTERTAINMENT', icon: '🎬' },
    { id: 'sports', name: 'SPORTS', icon: '🏈' },
    { id: 'business', name: 'BUSINESS', icon: '💼' },
    { id: 'nation', name: 'NATION', icon: '🏛' }
  ];

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

  return (
    <div className="preferences-overlay">
      <div className="preferences-modal">
        <div className="preferences-header">
          <h2>Select news categories to fine-tune your feed</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${preferences.selectedTopics.includes(category.name) ? 'selected' : ''
                }`}
              onClick={() => handleTopicToggle(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              {preferences.selectedTopics.includes(category.name) && (
                <span className="check-icon">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Preferences;