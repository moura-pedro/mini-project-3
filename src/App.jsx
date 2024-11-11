import { useState } from 'react'

import Search from './components/Search/Search'
import ArticleCard from './components/ArticleCard/ArticleCard'
import FullArticle from './components/FullArticle/FullArticle'
import Preferences from './components/Preferences/Preferences'
import Navigation from './components/Navigation/Navigation';
import { UserProvider } from './components/User/User'

import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <UserProvider>
      <div className="app">
        {/* Preferences Modal */}
        {showPreferences && (
          <Preferences onClose={() => setShowPreferences(false)} />
        )}

        {/* Navigation component */}
        <Navigation setShowPreferences={setShowPreferences} />


        {/* Main Content */}
        <main className="main-content">
          {selectedArticle ? (
            // Full Article View
            <FullArticle
              article={selectedArticle}
              onBack={() => setSelectedArticle(null)}
            />
          ) : (
            <>
              <Search setArticles={setArticles} />
              <div className="articles-grid">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.link}
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
              {articles.length === 0 && (
                <div className="no-articles">
                  No articles found matching the selected criteria
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;