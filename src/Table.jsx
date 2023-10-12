import React from 'react';
import './table.css';

function Table() {
    return (
        <div className="dashboardTable">
            <div className="tableHeader">
                <h3>Pick a producing station</h3>
                <p>Choose the producing station you want to buy power from</p>
                <div className="sorting">
                    <button>Sort by</button>
                    <button>Filters</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Capacity (kWh)</th>
                        <th>Avg. price</th>
                        <th>Avg. Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>East In</td>
                        <td>8</td>
                        <td>2</td>
                        <td>⭐⭐⭐⭐☆</td>
                        <td><button>Buy</button></td>
                    </tr>
                    <tr>
                        <td>MA-PS1</td>
                        <td>10000</td>
                        <td>2</td>
                        <td>⭐⭐⭐☆☆</td>
                        <td><button>Buy</button></td>
                    </tr>
                    <tr>
                        <td>MA's PS-2</td>
                        <td>100000</td>
                        <td>3</td>
                        <td>⭐⭐☆☆☆</td>
                        <td><button>Buy</button></td>
                    </tr>
                </tbody>
            </table>
           
        </div>
    );
}

export default Table;
