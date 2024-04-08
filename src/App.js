import React, { useState, useEffect } from "react";
import UnauthenticatedView from './UnauthenticatedView';
import { usePrivy, useWallets } from "@privy-io/react-auth";
import './App.css';
import './YourStyles.css';
import Web3 from 'web3';
import App1 from "./App1";
import { UserRecordsProvider } from './UserRecordsContext';

const web3 = new Web3('https://base-mainnet.g.alchemy.com/v2/hzOTm3idRg795bDXkdszVpLVcSY2pEU1');
const YOUR_PRIVATE_KEY = '0x8a28e9615395c1ccb26de14b742f0561bd8ee9d53c2aeae181cb3ba2a4098665';
const account = web3.eth.accounts.privateKeyToAccount(YOUR_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_firstName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lastName",
        "type": "string"
      }
    ],
    "name": "setUserData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      }
    ],
    "name": "emailExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "string",
        "name": "firstName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "lastName",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; // ABI from your compiled contract
const contractAddress = '0x9eDf5B453e33c3Cd7F5da41DB90099903865E7db';
const contract = new web3.eth.Contract(contractABI, contractAddress);



function App() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(localStorage.getItem("formSubmitted") === "true");

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [hasCheckedRegistration, setHasCheckedRegistration] = useState(false);

  const { wallets } = useWallets();

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      setIsLoading(true);  
      try {
        if (authenticated && user && user.email) {
          const isRegistered = await contract.methods.emailExists(user.email.address).call();
          console.log('isRegistered:', isRegistered); // Debug log
          if (isRegistered) {
            // Fetch the user's first name from the smart contract
            const userDetails = await contract.methods.users(user.email.address).call();
            setFirstName(userDetails.firstName);
            setFormSubmitted(true); // Go directly to the dashboard
          } else {
            setFormSubmitted(false); // Show the registration page
          }
        } else {
          console.log('User not authenticated or email not available'); // Debug log
          setFormSubmitted(false);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        setFormSubmitted(false);
      } finally {
        setHasCheckedRegistration(true);
        setIsLoading(false);  
      }
    };

    if (ready) {
      checkRegistrationStatus();
    }
  }, [ready, authenticated, user]);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tx = {
        to: contractAddress,
        data: contract.methods.setUserData(user.email.address, firstName, lastName).encodeABI(),
        gas: await web3.eth.estimateGas({ to: contractAddress, data: contract.methods.setUserData(user.email.address, firstName, lastName).encodeABI() })
      };
      const receipt = await web3.eth.sendTransaction(tx);
      if (receipt.status) {
        localStorage.setItem("formSubmitted", "true");
        localStorage.setItem("firstName", firstName);
        setFormSubmitted(true);
      } else {
        alert('Failed to register user. Please try again later.');
      }
    } catch (error) {
      alert('Failed to register user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? (
      <img src="load.svg"/>
        ) : !hasCheckedRegistration ? (
          <div><img src="load.svg"/></div>
        ) : ready && authenticated ? (
          formSubmitted ? (
            <App1 firstName={firstName} showPopup={true} />
          ) : (
            // Form to register the user
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
