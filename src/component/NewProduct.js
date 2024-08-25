// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import { useCart } from './CartContext'; // Import the Cart Context
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom for routing
// import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // Import cart icon from Heroicons
// import ProductPopup from './ProductPopup'; // Import ProductPopup component
// import { toast } from 'react-toastify';
// import { db } from './Firebase'; // Import Firestore
// import { collection, getDocs } from 'firebase/firestore'; // Import collection and getDocs

// const NewProduct = () => {
//   const { dispatch } = useCart();
//   const [popupProduct, setPopupProduct] = useState(null);
//   const [products, setProducts] = useState([]);
  
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'Products'));
//         const fetchedProducts = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setProducts(fetchedProducts);
//       } catch (error) {
//         console.error('Error fetching products:', error.message);
//       }
//     };
    
//     fetchProducts();
//   }, []);

//   const handleAddToCart = (product) => {
//     dispatch({ type: 'ADD_TO_CART', payload: product });
//     toast.success('One Item added into the Cart .. ');
//   };

//   const openPopup = (product) => {
//     setPopupProduct(product);
//   };

//   const closePopup = () => {
//     setPopupProduct(null);
//   };

//   return (
//     <div>     
//       <div className="flex flex-wrap justify-center my-20">
//         {products.map(product => (
//           <div key={product.id} className="w-64 p-2 m-4 bg-white shadow-lg rounded-2xl">
//             <img src={product.image} alt={product.product_name} className="w-32 p-4 m-auto h-36" />
//             <div className="p-4 m-3 bg-pink-200 rounded-lg bg-color-model">
//               <p className="text-xl font-bold text-white">{product.product_name}</p>
//               <p className="text-xs text-gray-50">{product.description}</p>
//               <div className="flex justify-between items-center mt-4">
//                 <p className="text-white">₹ {product.new_price.toFixed(2)}</p>
//                 <button
//                   type="button"
//                   className="w-10 h-10 text-base text-white bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-700 addto-cart-color mr-2"
//                   onClick={() => handleAddToCart(product)} // Add onClick handler
//                 >
//                   <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
//                 </button>
//               </div>
//               <div className="flex justify-center mt-4">
//                 <Link
//                   to={`/product/${product.id}`} // Ensure this path is correct based on your routing setup
//                   className="w-24 h-10 text-base font-medium text-white bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-700 btn-custom-color"
//                   onClick={() => openPopup(product)} // Open popup on link click
//                 >
//                   Shop Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
    

//       {/* Render ProductPopup if popupProduct is not null */}
//       {popupProduct && <ProductPopup product={popupProduct} onClose={closePopup} />}
//     </div>
//   );
// };

// export default NewProduct;

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from './CartContext'; 
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import ProductPopup from './ProductPopup'; 
import { toast } from 'react-toastify';
import { db } from './Firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 

const NewProduct = () => {
  const { dispatch } = useCart();
  const [popupProduct, setPopupProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Products'));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success('One Item added into the Cart .. ');
  };

  const openPopup = (product) => {
    setPopupProduct(product);
  };

  const closePopup = () => {
    setPopupProduct(null);
  };

  const openEnlargedImage = (imageSrc) => {
    setEnlargedImage(imageSrc);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center my-20">
        {products.map(product => (
          <div key={product.id} className="w-64 p-2 m-4 bg-white shadow-lg rounded-2xl">
            <div className="product-img-wrapper">
              <img 
                src={product.image} 
                alt={product.product_name} 
                className="w-32 p-4 m-auto h-36 cursor-pointer"
                onClick={() => openEnlargedImage(product.image)} // Open enlarged image on click
              />
            </div>
            <div className="p-4 m-3 bg-pink-200 rounded-lg bg-color-model">
              <p className="text-xl font-bold text-white">{product.product_name}</p>
              <p className="text-xs text-gray-50">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-white">₹ {product.new_price.toFixed(2)}</p>
                <button
                  type="button"
                  className="w-10 h-10 text-base text-white bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-700 addto-cart-color mr-2"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <Link
                  to={`/product/${product.id}`} 
                  className="w-24 h-10 text-base font-medium text-white bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-700 btn-custom-color"
                  onClick={() => openPopup(product)}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Render ProductPopup if popupProduct is not null */}
      {popupProduct && <ProductPopup product={popupProduct} onClose={closePopup} />}
      
      {/* Render enlarged image popup if enlargedImage is not null */}
      {enlargedImage && (
        <div className="enlarged-image-popup" onClick={closeEnlargedImage}>
          <img src={enlargedImage} alt="Enlarged" />
        </div>
      )}
    </div>
  );
};

export default NewProduct;
