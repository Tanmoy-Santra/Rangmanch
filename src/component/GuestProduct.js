import React, { useState, useEffect } from 'react';
import GuestNavbar from './GuestNavbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import ProductPopup from './ProductPopup';
import { toast } from 'react-toastify';
import { db } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';

const GuestProduct = () => {
  const [popupProduct, setPopupProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loginPopup, setLoginPopup] = useState(false);
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

  const handleRestrictedAction = () => {
    setLoginPopup(true);
  };

  const openEnlargedImage = (imageSrc) => {
    setEnlargedImage(imageSrc);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  return (
    <div>
      <GuestNavbar />

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
                  className="w-10 h-10 text-base text-white bg-purple-500  hover:bg-purple-700 rounded-full flex items-center justify-center"
                  onClick={handleRestrictedAction} // Show login popup
                >
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="w-24 h-10 text-base font-medium text-white bg-purple-500 rounded-full hover:bg-purple-700 flex items-center justify-center"
                  onClick={handleRestrictedAction} // Show login popup
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Login Popup */}
      {loginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="mb-4 text-lg">Please log in to continue.</p>
            <Link
              to="/login"
              className="px-4 py-2  text-white bg-purple-500 rounded-lg hover:bg-purple-700"
            >
              Login
            </Link>
            <button
              className="ml-4 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              onClick={() => setLoginPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
      {enlargedImage && (
        <div className="enlarged-image-popup" onClick={closeEnlargedImage}>
          <img src={enlargedImage} alt="Enlarged" />
        </div>
      )}
    </div>
  );
};

export default GuestProduct;
