import './Navigation.css';

function Navigation({ setShowPreferences }) {
  return (
    <nav className="navigation">

      <div className="nav-links">
        <button
          onClick={() => setShowPreferences(true)}
          className="nav-link"
        >
          Preferences
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
