import React, { useEffect, useState } from 'react';
import './load.css';

function Loadingbar() {
  const [width, setWidth] = useState(0);
  const [checkpointReached, setCheckpointReached] = useState(false);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(loadingInterval);
      } else {
        setWidth(prevWidth => {
          const newWidth = prevWidth + 1;
          if (newWidth >= 50) {
            setCheckpointReached(true);
          }
          return newWidth;
        });
      }
    }, 50);

    return () => clearInterval(loadingInterval);
  }, [width]);

  return (
    <div className="container">
      <div className="loading-bar">
        <img src="house.png" className='image2'></img>
        <div className="loading" style={{ width: `${width}%` }}></div>
        <div className={`checkpoint ${checkpointReached ? 'active' : ''}`}></div>
      </div>
    </div>
  );
}

export default Loadingbar;
