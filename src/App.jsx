import { useState } from 'react'
import Navigation from './components/Navigation/Navigation'
import Search from './components/Search/Search'
import ArticleCard from './components/ArticleCard/ArticleCard'
import FullArticle from './components/FullArticle/FullArticle'
import Preferences from './components/Preferences/Preferences'
import { UserProvider } from './components/User/User'

import './index.css'

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentView, setCurrentView] = useState('search');

  return (
    <UserProvider>
      <div className="app">
        <Navigation setCurrentView={setCurrentView} />
        
        <main className="main-content">
          {currentView === 'search' && (
            <div>
              <Search setArticles={setArticles} />
              {articles.length > 0 ? (
                <div className="articles-grid">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.link}
                      article={article}
                      onClick={() => {
                        setSelectedArticle(article);
                        setCurrentView('fullArticle');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-articles">
                  No articles found matching the selected criteria
                </div>
              )}
            </div>
          )}

          {currentView === 'fullArticle' && selectedArticle && (
            <FullArticle 
              article={selectedArticle} 
              onBack={() => setCurrentView('search')} 
            />
          )}

          {currentView === 'preferences' && (
            <Preferences />
          )}
        </main>
      </div>
    </UserProvider>
  );
}

export default App;