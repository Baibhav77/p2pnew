import React from 'react';
import "./App1.css"

const UnauthenticatedView = ({ login }) => {
  return (
    <div className="enhancedContainer">
      <header>
        <div className="logo">Power2 Peer</div>
        <nav>
          <a href="#">P2PCONNECT</a>
          <a href="#">OUR TECHNOLOGY</a>
          <a href="#">ABOUT US</a>
        </nav>
        <div className="authButtons">
          <button className="signUpBtn">Sign in</button>
          <button className="loginBtn">Register</button>
        </div>
      </header>
      <main>
        <div className="mainContent">
          <h1>Virtual Clean Power Network</h1>
          <p>
            P2PConnect is a mobile app that’s opening up entirely new
            opportunities in the renewable energy sector...
          </p>
          <button onClick={login} className="getStartedBtn">
            Get App Now
          </button>
        </div>
        <div className="illustration">
          <img src="po.png" alt="Power2Peer Illustration" />
        </div>
      </main>
    </div>
  );
};

export default UnauthenticatedView;
