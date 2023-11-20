import React, { useState } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import './App1.css';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import Insights from './Insights';
import Simulation from './Simulation';
import { UserRecordsProvider } from './UserRecordsContext';
import { usePrivy, useWallets } from "@privy-io/react-auth";

function App1({ firstName, showPopup }) {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const [isPopupVisible, setIsPopupVisible] = useState(showPopup);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <UserRecordsProvider>
      <Router>
        <div className="dashboardContainer">
          <aside className="sidebar">
            <div className="logoContainer">
              <h1>Power2Peer</h1>
            </div>
            <nav className="sidebarNav">
              <NavLink to="/" end activeClassName="active">Marketplace</NavLink>
              <NavLink to="/analytics" activeClassName="active">Consuming Stations</NavLink>
              <NavLink to="/insights" activeClassName="active">Producing Stations</NavLink>

              

            </nav>
            <button onClick={logout} className="butt1">Logout</button>
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
    </UserRecordsProvider>
  );
}

export default App1;
