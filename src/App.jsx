import { useState } from 'react'
import Navigation from './components/Navigation/Navigation'
import Search from './components/Search/Search'
import ArticleCard from './components/Card/ArticleCard'
// import FullArticle from './components/FullArticle'
// import Preferences from './components/Preferences'
import './index.css'

function App() {
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [currentView, setCurrentView] = useState('search')

  return (
    <div className="app">
      <Navigation setCurrentView={setCurrentView} />

      <main className="main-content">
        {currentView === 'search' && (
          <>
            <Search setArticles={setArticles} />
            <div className="articles-grid">
              {articles.map((article) => (
                <ArticleCard
                  key={article.link}
                  article={article}
                  onClick={() => {
                    setSelectedArticle(article)
                    setCurrentView('fullArticle')
                  }}
                />
              ))}
            </div>
          </>
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
  )
}

export default App
