import React, { useEffect, useState } from 'react';
import './dashboard.css';
import './App1.css'
import Table from './Table'
import Web3 from 'web3';
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Swal from 'sweetalert2';

import Modal from 'react-modal';


function Dashboard() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');

  // New state for toggling between ETH and USD
  const [displayInUSD, setDisplayInUSD] = useState(false);

  const toggleCurrency = () => {
    setDisplayInUSD(!displayInUSD);
  };

  const displayBalance = displayInUSD ? balance * 1900 : balance;
  const currencyLabel = displayInUSD ? 'USD' : 'ETH';

 

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      console.log("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!web3) return;
      const balance = await web3.eth.getBalance(user.wallet.address);
      const formattedBalance = parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(3);
      setBalance(formattedBalance);
    }
    fetchBalance();
  }, [web3]);


  const connectMetaMask = async () => {
    if (!web3) return;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }

  const showAddFundsPopup = async () => {
    const { value: enteredAmount } = await Swal.fire({
      title: 'Add Funds',
      input: 'text',
      inputLabel: 'Amount in ETH',
      inputPlaceholder: 'Enter the amount'
    });

    if (enteredAmount) {
      setAmount(enteredAmount);
      addFunds();
    }
  };

  const addFunds = async () => {
    await connectMetaMask();
    if (!account) {
      alert("Please connect your MetaMask first!");
      return;
    }
    const networkId = await web3.eth.net.getId();
    if (String(networkId) !== "420") {
      alert("Please switch to Optimism testnet on Goerli!");
      return;
    }

    web3.eth.sendTransaction({
      from: account,
      to: String(user.wallet.address),
      value: web3.utils.toWei(amount, 'ether')
    })
      .then(receipt => {
        console.log('Transaction successful', receipt);
      })
      .catch(err => {
        console.error('Error sending transaction', err);
      });
  };


  return (
    <div>
      <p> </p>
      <div className="ltvOverview">
        <div className="ltvCards">
          <div className="ltvCard">
            <p>Account Balance</p>
            <h3 onClick={toggleCurrency}>
              {displayBalance} {currencyLabel}
            </h3>
            <p className="positiveChange">+ 0%</p>
            <button onClick={showAddFundsPopup}>Add Funds</button>
          </div>

          <div className="ltvCard">
            <p>Carbon Credits</p>
            <h3>0CP</h3>
            <p className="positiveChange">+ 0%</p>
            <button onClick={() => setIsModalOpen(true)}>Add Funds</button>
          </div>
        </div>
      </div>
      <Table />
      {isModalOpen && (
        <div className="overlay">
          <div className="enhancedContainer1">
            <h2>Add Funds</h2>
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button className="butt1" onClick={addFunds}>Confirm</button>
            <button className="butt1" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
