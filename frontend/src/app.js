import React, { useState } from 'react';

function App() {
  const [claim, setClaim] = useState('');
  const [search, setSearch] = useState('');

  const handleSubmit = () => {
    // TODO: call external API to detect claim and get confidence score
    console.log('Checking claim:', claim);
  };

  const handleSearch = () => {
    // TODO: implement search over past fact-checked topics
    console.log('Searching for:', search);
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="logo">FactCheck (No Misinfo)</h1>
        <div className="menu">
          <button>Home</button>
          <button>About</button>
          <button>Contact</button>
        </div>
      </nav>

      <section className="hero">
        <h2>Detect and Verify Claims Instantly</h2>
        <textarea
          placeholder="Enter your claim here..."
          value={claim}
          onChange={e => setClaim(e.target.value)}
        />
        <button onClick={handleSubmit}>Check Claim</button>
      </section>

      <section className="search-section">
        <input
          type="text"
          placeholder="Search past fact-checked topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} FactCheck. All rights reserved.</p>
        <p>Contact: info@factchecknomisinfo.com</p>
      </footer>
    </div>
  );
}

export default App;