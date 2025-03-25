// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { auth } from "./component/Firebase";
// import { CartProvider } from './component/CartContext';
// import './App.css';
// import Home from './component/Home';
// import Product from './component/Product';
// import Login from './Auth/Login';
// import FillDetails from './Auth/FillDetails';
// import Error from './Error/Error';
// import UniversalLoader from './Loders/UniversalLoader';
// import AdminUseOnly from './component/AdminUseOnly';
// import EditProfile from './component/EditProfile';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); 

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUser(user);
//       setLoading(false); // Set loading to false once auth state is determined
//     },
//     (error) => {
//       setError(error); // Handle error during authentication
//       setLoading(false); // Set loading to false on error
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <UniversalLoader></UniversalLoader>; // Placeholder for loading state
//   }

//   if (error) {
//     // Handle error state, such as showing an error message or redirecting to an error page
//     return <div><Error></Error></div>;
//   }

//   return (
//     <div className="App">
//       <CartProvider>
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={user ? <Navigate to="/product" /> : <Navigate to="/login" />}
//             />
//             <Route path="/login" element={<Login />} />
//             <Route path="/filldetails" element={<FillDetails />} />
//             <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />        
//             <Route path="/admin-use-only" element={<AdminUseOnly/>} />
//             <Route path="/edit-profile" element={<EditProfile/>} />
//             <Route path="/product" element={user ? <Product /> : <Navigate to="/login" />} />
//             <Route path="/product/:id" element={user ? <Product /> : <Navigate to="/login" />} />
//           </Routes>
//         </Router>
//       </CartProvider>
//        <ToastContainer 
//         position="top-center"
//           autoClose={2000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss={false}
//           draggable
//           pauseOnHover={false}
//           theme="light"
         
//        />
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "./component/Firebase";
import { CartProvider } from './component/CartContext';
import './App.css';
import Home from './component/Home';
import Product from './component/Product';
import GuestProduct from './component/GuestProduct';  // Import GuestProduct
import Login from './Auth/Login';
import FillDetails from './Auth/FillDetails';
import Error from './Error/Error';
import UniversalLoader from './Loders/UniversalLoader';
import AdminUseOnly from './component/AdminUseOnly';
import EditProfile from './component/EditProfile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false); 
      },
      (error) => {
        setError(error); 
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <UniversalLoader />; 
  }

  if (error) {
    return <div><Error /></div>;
  }

  return (
    <div className="App">
      <CartProvider>
        <Router>
          <Routes>
            {/* Home route redirects based on authentication */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/product" /> : <Navigate to="/login" />} 
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/filldetails" element={<FillDetails />} />

            {/* Protected Routes (Require Login) */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/admin-use-only" element={<AdminUseOnly />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/product" element={user ? <Product /> : <Navigate to="/login" />} />
            <Route path="/product/:id" element={user ? <Product /> : <Navigate to="/login" />} />

            {/* Guest Mode Route (No Login Required) */}
            <Route path="/guest-product" element={<GuestProduct />} />
          </Routes>
        </Router>
      </CartProvider>

      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}

export default App;
