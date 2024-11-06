import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {
      selectedTopics: [], // Empty array means show all topics
      readingLevel: 'all'
    };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
  };

  const setSelectedTopics = (topics) => {
    setPreferences(prev => ({
      ...prev,
      selectedTopics: topics
    }));
  };

  const filterArticles = (articles) => {
    if (!articles) return [];

    // If no topics are selected, show all articles
    if (preferences.selectedTopics.length === 0) {
      return articles;
    }

    // Filter by selected topics
    return articles.filter(article =>
      preferences.selectedTopics.includes(article.topic)
    );
  };

  const value = {
    preferences,
    updatePreferences,
    setSelectedTopics,
    filterArticles
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}