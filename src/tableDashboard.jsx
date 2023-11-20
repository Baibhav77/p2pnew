import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import Modal from 'react-modal';
import { usePrivy } from "@privy-io/react-auth";
import styled from 'styled-components';
import './analytics.css';
const web3 = new Web3('https://rpc.public.zkevm-test.net');
const YOUR_PRIVATE_KEY = '0x8a28e9615395c1ccb26de14b742f0561bd8ee9d53c2aeae181cb3ba2a4098665';
const account = web3.eth.accounts.privateKeyToAccount(YOUR_PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;
import { useUserRecords } from './UserRecordsContext';

const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "stationName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "streetAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "state",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pricePerWatt",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "zipCode",
            "type": "string"
          }
        ],
        "indexed": false,
        "internalType": "struct AnalyticsForm.FormData",
        "name": "data",
        "type": "tuple"
      }
    ],
    "name": "FormSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "stationName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "streetAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "state",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "pricePerWatt",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "zipCode",
        "type": "string"
      }
    ],
    "name": "submitForm",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      }
    ],
    "name": "getFormCountForEmail",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getFormForEmailAtIndex",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "stationName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "streetAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "city",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "state",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pricePerWatt",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "zipCode",
            "type": "string"
          }
        ],
        "internalType": "struct AnalyticsForm.FormData",
        "name": "",
        "type": "tuple"
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
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "submissions",
    "outputs": [
      {
        "internalType": "string",
        "name": "stationName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "streetAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "city",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "state",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "pricePerWatt",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "zipCode",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


const contractAddress = '0xC69089e8182a70601bC7369E9A576895c072EA53';
const contract = new web3.eth.Contract(contractABI, contractAddress);
function TableDashboard() {
  const [selectedItem, setSelectedItem] = useState(""); // State to store the selected item

  const handleBuyClick = (itemName) => {
    setSelectedItem(itemName);
    // Further logic for buying the item
  };
  const [userRecords, setUserRecords] = useState([]);
  const { user } = usePrivy(); // Assuming user is fetched correctly from usePrivy

  useEffect(() => {
    const fetchAllRecords = async () => {
      if (user && userRecords.length === 0) { // Only fetch if user exists and records are empty
        try {
          const formCount = await contract.methods.getFormCountForEmail(user.email.address).call();
          let allRecords = [];
          for (let i = 0; i < formCount; i++) {
            const record = await contract.methods.getFormForEmailAtIndex(user.email.address, i).call();
            console.log(record);
            allRecords.push(record);
          }
          setUserRecords(allRecords);
        } catch (error) {
          console.error('Error fetching all records:', error);
        }
      }
    };

    fetchAllRecords();
  }, [user]); // Dependency on user object

  return (
    <table>
      <thead>
        <tr>
          <th>Station Name</th>
          <th>Producer</th>
          <th>ZipCode</th>
          <th>Action</th>
          {/* Add other headers if needed */}
        </tr>
      </thead>
      <tbody>
        {userRecords.map((record, index) => (
          <tr key={index}>
            <td>{record.stationName}</td>
            <td>{record.streetAddress}</td>
            <td>{record.zipCode}</td>
            <button onClick={() => handleBuyClick(record.stationName)} className="la">Buy</button>
            {/* Add other columns if needed */}
          </tr>
        ))}
      </tbody>
      {selectedItem && <p>Selected Item: {selectedItem}</p>} {/* Display the selected item */}

    </table>

  );
}

export default TableDashboard;
