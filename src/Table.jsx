import React, { useState, useEffect } from 'react';
import './table.css';
import Web3 from 'web3';
import Modal from 'react-modal';
import { usePrivy } from "@privy-io/react-auth";
import styled from 'styled-components';
import TableDashboard from './tableDashboard'
const web3 = new Web3('https://rpc.public.zkevm-test.net');
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
            "name": "avgConsumption",
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
        "name": "avgConsumption",
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
            "name": "avgConsumption",
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
        "name": "avgConsumption",
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
const contractAddress = '0x6c6f92dA249723A0805568E353cbd6bF74561274';  // replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

function Table() {
  const { user } = usePrivy();
  const [stationNames, setStationNames] = useState([]);
  const email = user.email.address; // Replace with the email you have

  useEffect(() => {
    const fetchStationNames = async () => {
      const allStationNames = [];
      const count = await contract.methods.getFormCountForEmail(user.email.address).call();

      for (let i = 0; i < count; i++) {
        const formData = await contract.methods.getFormForEmailAtIndex(user.email.address, i).call();
        allStationNames.push(formData.stationName);
      }

      setStationNames(allStationNames);
    };

    fetchStationNames().catch(console.error);
  }, []);

  const handleStationChange = (e) => {
    const selected = e.target.value;
    // Do something with the selected station
  };
  return (
    <div className="dashboardTable">
      <div className="tableHeader">
        <h3>Choose the station you want to power</h3>
        <div className="consume">
          <div class="select-wrapper">
            <select onChange={handleStationChange}>
              <option value="">Select Station</option>
              {stationNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}

            </select>
            
          </div>
        </div>


        <p>Pick your power station</p>

      </div>
      <TableDashboard />

    </div>
  );
}

export default Table;
