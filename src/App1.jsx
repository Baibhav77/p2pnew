import React, { useState } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import './App1.css';
import Dashboard from './Dashboard';
import Analytics from './Analytics'; // assuming you have a component for Analytics
import Insights from './Insights'; // assuming you have a component for Insights

function App1({ firstName, showPopup }) {
  const [isPopupVisible, setIsPopupVisible] = useState(showPopup);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <Router>
      {isPopupVisible && (
        <div className="overlay">
          <div className="enhancedContainer1">
            <div style={{ textAlign: "center" }}>
              
            </div>
            <h2 style={{ textAlign: "center" }}>Congratulations, {firstName}!</h2>
            <div style={{ textAlign: "center", margin: '20px 0' }}>
              <p>You've just taken a big step into the future with Power2Peer!</p>
              <p>Unlocking the gateway to decentralized carbon market has never been easier.</p>
            </div>
            <p>Your Power2Peer ID : 0x12DCfE5FF6b13974fE6822A331488d4c32b6C625</p>
            <div style={{ textAlign: "center", marginTop: '30px' }}>
              <button onClick={closePopup} style={{ fontSize: '18px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div className="dashboardContainer">
        <aside className="sidebar">
          <div className="logoContainer">
            <h1>Power2Peer</h1>
          </div>
          <nav className="sidebarNav">
            <NavLink to="/" end activeClassName="active">Marketplace</NavLink>
          </nav>
          <div className="premiumContainer">
            <p>Have problems navigating?</p>
            <button>Come to Discord</button>
          </div>
        </aside>
        <div className="dashboardMain">
          <header className="dashboardHeader">
            <p>Hello {firstName || 'Baibhav'}</p>
          </header>
          <main className="dashboardContent">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/insights" element={<Insights />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App1;
