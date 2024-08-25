import React, { useState, useEffect } from 'react';
import UniversalLoader from './UniversalLoader'; // Ensure this path matches where you save UniversalLoader

const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Simulate a loading time of 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <UniversalLoader />
      ) : (
        <div className="p-4 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Content Loaded</h1>
          <p>This is the actual content that was loaded.</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
