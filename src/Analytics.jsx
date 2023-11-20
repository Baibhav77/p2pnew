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

// Your ABI
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
const contractAddress = '0x6c6f92dA249723A0805568E353cbd6bF74561274';
const contract = new web3.eth.Contract(contractABI, contractAddress);

Modal.setAppElement('#root');  // This is required to bind the modal to the app root

function Analytics() {

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const labelStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyles = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px'
  };

  const { user } = usePrivy();  // Fetch user from usePrivy
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userRecords, setUserRecords] = useState([]);
  const [stationName, setStationName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [avgConsumption, setAvgConsumption] = useState(0);
  const [zipCode, setZipCode] = useState("");

  //const { userRecords, setUserRecords } = useUserRecords();

  useEffect(() => {
    const fetchAllRecords = async () => {
      const allRecords = [];
      const formCount = await contract.methods.getFormCountForEmail(user.email.address).call();

      for (let i = 0; i < formCount; i++) {
        const record = await contract.methods.getFormForEmailAtIndex(user.email.address, i).call();
        allRecords.push(record);
      }

      setUserRecords(allRecords);
    };

    if (userRecords.length === 0) { // Only fetch if records are empty
      fetchAllRecords().catch(error => console.error('Error fetching all records:', error));
    }
  }, []); // Added dependency to re-run if userRecords changes

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = {
        to: contractAddress,
        data: contract.methods.submitForm(user.email.address, stationName, streetAddress, city, state, avgConsumption, zipCode).encodeABI(),
        gas: await web3.eth.estimateGas({
          to: contractAddress,
          data: contract.methods.submitForm(user.email.address, stationName, streetAddress, city, state, avgConsumption, zipCode).encodeABI()
        })
      };
      const receipt = await web3.eth.sendTransaction(tx);
      if (receipt.status) {
        // Close the modal after successful submission
        setModalIsOpen(false);

        // Update userRecords state with the new record
        const newRecord = {
          stationName,
          streetAddress,
          city,
          state,
          avgConsumption,
          zipCode
        };
        setUserRecords([...userRecords, newRecord]);
      } else {
        console.error('Error registering data on the blockchain.');
        alert('Failed to register data. Please try again later.');
      }
    } catch (error) {
      console.error('Blockchain error:', error);
      alert('Failed to register data. Please try again.');
    }
  };

  return (
    <div class="mainbody">

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            padding: '20px',
            boxSizing: 'border-box'
          }
        }}
      >
        <h2>Submit Analytics Data</h2>
        <form style={formStyles} onSubmit={handleFormSubmit}>
          <div>
            <label style={labelStyles}>
              Station Name:
              <input style={inputStyles} type="text" value={stationName} onChange={(e) => setStationName(e.target.value)} required />
            </label>
          </div>
          <div>
            <label style={labelStyles}>
              Street Address:
              <input style={inputStyles} type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>
              City:
              <input style={inputStyles} type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>
              State:
              <input style={inputStyles} type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>
              Average Consumption (kWh):
              <input style={inputStyles} type="number" value={avgConsumption} onChange={(e) => setAvgConsumption(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>
              ZIP Code:
              <input style={inputStyles} type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
            </label>
          </div>
          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </div>
        </form>

      </Modal>

      <div className="records-section">
        <div className="stations-container">
          <h2>My Consuming Stations</h2>
          <p>Add new consuming stations, or view the ones previously added.</p>

          {userRecords.map((record) => (
            <div className="station-card" key={record.id}>
              <div className="station-details">
                <p><strong>ZipCode:</strong> {record.zipCode}</p>
                <p><strong>Name:</strong> {record.stationName}</p>

              </div>
            </div>
          ))}
        </div>

      </div>

      <button className="buttonAnal" onClick={() => setModalIsOpen(true)}>Add a station</button>

    </div>
  );
}

export default Analytics;
