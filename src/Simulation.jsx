import Loadingbar from './Loadingbar'
import './load.css'
import React, { useState, useEffect } from 'react';
function Simulation() {
  return (
    <div className='divy'>
      <img src="solar.png" className='image1'></img>
      <Loadingbar />
      <img src="house.png" className='image2'></img>
    </div>
  );
}
export default Simulation;

