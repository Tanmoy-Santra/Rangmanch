// import React, { createContext, useContext, useReducer } from 'react';

// const CartContext = createContext();

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       return [...state, action.payload];
//     case 'REMOVE_FROM_CART':
//       return state.filter(item => item.product_id !== action.payload.product_id);
//     default:
//       return state;
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [cart, dispatch] = useReducer(cartReducer, []);

//   return (
//     <CartContext.Provider value={{ cart, dispatch }}>
//       {children}
//     </CartContext.Provider>
    
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.product_id !== action.payload.product_id);
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  const updateCartInDatabase = async (updatedCart) => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, {
        cart_items: updatedCart
      });
    }
  };

  const loadCartFromDatabase = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch({ type: 'SET_CART', payload: data.cart_items || [] });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCartFromDatabase();
  }, []);

  useEffect(() => {
    if (!loading) {
      updateCartInDatabase(cart);
    }
  }, [cart, loading]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
