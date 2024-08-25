import React from 'react';

const UniversalLoader = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
       <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin text-white"></div>
       <p className="mt-5 text-lg text-white">Loading...</p>
    </div>
  );
};

export default UniversalLoader;
