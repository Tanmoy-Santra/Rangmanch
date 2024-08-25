// import React, { useState } from 'react';
// import { useCart } from './CartContext';
// import ProductPopup from './ProductPopup'; // Import ProductPopup component

// const Cart = ({ isOpen, onClose }) => {
//   const { cart, dispatch } = useCart();
//   const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product

//   const handleRemoveFromCart = (product) => {
//     dispatch({ type: 'REMOVE_FROM_CART', payload: product });
//   };

//   const handleShopNow = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleClosePopup = () => {
//     setSelectedProduct(null);
//   };

//   if (!isOpen) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
//       <div className="relative bg-white p-6 rounded-lg w-full sm:w-2/3 max-h-96 overflow-y-auto">
//         <button 
//           onClick={onClose} 
//           className="absolute top-3 right-3 bg-gray-500 text-white p-2 rounded-full"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         <h2 className="text-2xl mb-4">Your Cart</h2>
//         {cart.length === 0 ? (
//           <p>Your cart is empty.</p>
//         ) : (
//           <div>
//             {cart.map((product) => (
//               <div key={product.product_id} className="flex flex-col sm:flex-row justify-between items-center mb-4">
//                 <div className="flex items-center mb-2 sm:mb-0">
//                   <img src={product.image} alt={product.product_name} className="h-20 w-auto sm:h-16 sm:w-auto rounded-lg" />
//                   <div className="ml-4">
//                     <p className="text-lg font-bold">{product.product_name}</p>
//                     <p className="text-sm">{product.description}</p>
//                     <p className="text-sm">₹ {product.new_price.toFixed(2)}</p>
//                   </div>
//                 </div>
//                 <div className="flex mt-2 sm:mt-0">
//                   <button 
//                     onClick={() => handleShopNow(product)} 
//                     className="bg-purple-500 text-white p-2 rounded-lg mr-2 btn-custom-color"
//                   >
//                     Shop Now
//                   </button>
//                   <button 
//                     onClick={() => handleRemoveFromCart(product)} 
//                     className="bg-red-500 text-white p-2 rounded-lg btn-custom-color"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {selectedProduct && (
//         <ProductPopup
//           product={selectedProduct}
//           onClose={handleClosePopup}
//         />
//       )}
//     </div>
//   );
// };

// export default Cart;


import React, { useState } from 'react';
import { useCart } from './CartContext';
import ProductPopup from './ProductPopup'; // Import ProductPopup component

const Cart = ({ isOpen, onClose }) => {
  const { cart, dispatch } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product

  const handleRemoveFromCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const handleShopNow = (product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg w-full sm:w-2/3 max-h-96 overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 bg-gray-500 text-white p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((product) => (
              <div key={product.product_id} className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <img src={product.image} alt={product.product_name} className="h-20 w-auto sm:h-16 sm:w-auto rounded-lg" />
                  <div className="ml-4">
                    <p className="text-lg font-bold">{product.product_name}</p>
                    <p className="text-sm">{product.description}</p>
                    <p className="text-sm">₹ {product.new_price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex mt-2 sm:mt-0">
                  <button 
                    onClick={() => handleShopNow(product)} 
                    className="bg-purple-500 text-white p-2 rounded-lg mr-2 btn-custom-color"
                  >
                    Shop Now
                  </button>
                  <button 
                    onClick={() => handleRemoveFromCart(product)} 
                    className="bg-red-500 text-white p-2 rounded-lg btn-custom-color"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Cart;
