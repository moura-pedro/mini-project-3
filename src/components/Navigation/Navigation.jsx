import './Navigation.css'

function Navigation({ setCurrentView }) {
    return (
        <nav className="navigation">
            <div className="nav-brand">
                <h1>News Search</h1>
            </div>

            <div className="nav-links">
                <button
                    onClick={() => setCurrentView('search')}
                    className="nav-link"
                >
                    Search
                </button>
                <button
                    onClick={() => setCurrentView('preferences')}
                    className="nav-link"
                >
                    Preferences
                </button>
            </div>
        </nav>
    )
}

export default Navigation