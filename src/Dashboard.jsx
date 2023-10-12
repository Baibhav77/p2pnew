import React, { useEffect, useState } from 'react';
import './dashboard.css';
import './App1.css'
import Table from './Table'
import Web3 from 'web3';

function Dashboard() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!web3) return;
      const balance = await web3.eth.getBalance('0x12DCfE5FF6b13974fE6822A331488d4c32b6C625');
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }
    fetchBalance();
  }, [web3]);

  const connectMetaMask = async () => {
    if (!web3) return;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  }

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
      to: '0x12DCfE5FF6b13974fE6822A331488d4c32b6C625',
      value: web3.utils.toWei('0.001', 'ether')
    });
  }

  return (
    <div>
      <p>Account Details</p>
      <div className="ltvOverview">
        <div className="ltvCards">
          <div className="ltvCard">
            <p>Account Balance</p>
            <h3>{balance} ETH</h3>
            <p className="positiveChange">+ 81%</p>
            <button onClick={addFunds}>Add Funds</button>
          </div>

          <div className="ltvCard">
            <p>Carbon Credits</p>
            <h3>43CP</h3>
            <p className="positiveChange">+ 68%</p>
            <button>Transfer</button>
          </div>
        </div>
      </div>
      <Table />
    </div>
  );
}

export default Dashboard;
