import React, { useState, useEffect } from "react";
import UnauthenticatedView from './UnauthenticatedView';
import { usePrivy, useWallets } from "@privy-io/react-auth";
import './App.css';
import './YourStyles.css';

import App1 from "./App1";


function App() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy');

  useEffect(() => {
    if (localStorage.getItem("formSubmitted") === "true") {
      setFormSubmitted(true);
      setFirstName(localStorage.getItem("firstName"));
    }

    if (ready && authenticated && user && user.email) {
      console.log("Authenticated user:", user.email.address);
      
    }
  }, [ready, authenticated, user]);

  if (!ready) {
    return null;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("formSubmitted", "true");
    localStorage.setItem("firstName", firstName);
    setFormSubmitted(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? (
          <div>Loading...</div>
        ) : ready && authenticated ? (
          formSubmitted ? (
           <App1 firstName={firstName} showPopup={true} />
          ) : (
            <div className="enhancedContainer">
              <h2>Please Register</h2>
              <form onSubmit={handleFormSubmit} className="form">
                <div className="formGroup">
                  <label>First Name:</label>
                  <input
                    type="text"
                    className="formGroup input"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="formGroup">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    className="formGroup input"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submitBtn">Submit</button>
              </form>
            </div>
          )
        ) : (
          <UnauthenticatedView login={login} />
        )}
      </header>
    </div>
  );
}

export default App;
