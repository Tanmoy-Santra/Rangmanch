import React from 'react';
import logo from '../component/Assets/logo2.png'

const SkeletonLoader = () => {
  return (
    <div className='w-full h-full' style={{ background: "#5A189A", width: '100%', height: "100vh" }}>
    <div className='w-full h-full flex items-center justify-center'>
      <img className='mx-auto' src={logo} alt="Logo" width={'200px'} style={{ margin: 'auto' }} />
    </div>
  </div>
  );
};

export default SkeletonLoader;
