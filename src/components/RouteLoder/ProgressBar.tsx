import React, { useState, useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setProgress(30); // Start loading

    const timer = setTimeout(() => {
      setProgress(100); // Finish loading
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div style={{ marginTop: '60px' }}>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={4}
      />
    </div>
  );
};

export default ProgressBar;
