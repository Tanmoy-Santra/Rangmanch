import React, { useState, useEffect } from 'react';
import { db, storage } from './Firebase'; // Import storage from Firebase
import { collection, addDoc, deleteDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import LocalLoader from '../Loders/LocalLoader';

export default function AdminUseOnly() {
  const [activeTab, setActiveTab] = useState('add');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [removeProductId, setRemoveProductId] = useState('');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [newDeliveryStatus, setNewDeliveryStatus] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
      fetchProducts();
    }
  }, [activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setSelectedImage(file.name);
    } else {
      setProductImage(null);
      setSelectedImage(null);
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    try {
        let imageUrl = '';
        if (productImage) {
            const imageRef = ref(storage, `images/${productImage.name}`);
            await uploadBytes(imageRef, productImage);
            imageUrl = await getDownloadURL(imageRef);
        }
        
        console.log({
            product_id: productId,
            product_name: productName,
            description: productDescription,
            old_price: parseFloat(oldPrice),
            new_price: parseFloat(newPrice),
            image: imageUrl,
            addedOn:  new Date().toLocaleString(),
        });

        await addDoc(collection(db, 'Products'), {
            product_id: productId,
            product_name: productName,
            description: productDescription,
            old_price: parseFloat(oldPrice),
            new_price: parseFloat(newPrice),
            image: imageUrl,
            product_ref_id: doc(collection(db, 'Products')).id,
            addedOn:  new Date().toLocaleString(),
        });
        
        toast.success('Product added successfully');
        setProductId('');
        setProductName('');
        setProductDescription('');
        setOldPrice('');
        setNewPrice('');
        setProductImage(null);        
    } catch (error) {
        console.error('Error adding product:', error.message);
        toast.error('Error adding product: ' + error.message);
    } finally {
        setLoading(false);
    }
};


  const handleRemoveProduct = async () => {
    setLoading(true);
    try {
      if (!removeProductId) {
        toast.error('Please provide Product ID');
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'Products'), where('product_ref_id', '==', removeProductId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error('Product not found');
        setLoading(false);
        return;
      }

      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, 'Products', docSnapshot.id));
        toast.success('Product removed successfully');
      });

      setRemoveProductId('');
    } catch (error) {
      console.error('Error removing product:', error.message);
      toast.error('Error removing product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'Orders'));
      const ordersList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Order date from Firestore:', data.order_date);
        return {
          id: doc.id,
          ...data,
          order_date: data.order_date || null,
          delivery_date: data.delivery_date || null
        };
      });
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      toast.error('Error fetching orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'Products'));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      toast.error('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  

//   const formatDate = (date, includeTime = false) => {
//     if (!date) {
//         console.error('No date provided.');
//         return 'Invalid Date';
//     }

//     try {
//         let parsedDate;

//         // Handle Firebase Timestamp
//         if (date.seconds && date.nanoseconds) {
//             parsedDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
//         } else if (date.toDate && typeof date.toDate === 'function') {
//             parsedDate = new Date(date.toDate());
//         } else if (date instanceof Date && !isNaN(date.getTime())) {
//             parsedDate = date;
//         } else if (typeof date === 'string') {
//             parsedDate = new Date(date);
//         }

//         if (parsedDate && !isNaN(parsedDate.getTime())) {
//             const options = {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit',
//             };
//             if (includeTime) {
//                 options.hour = '2-digit';
//                 options.minute = '2-digit';
//                 options.second = '2-digit';
//             }
//             return parsedDate.toLocaleDateString(undefined, options);
//         }
//     } catch (error) {
//         console.error('Error formatting date:', error);
//     }

//     console.error('Unrecognized date format:', date);
//     return 'Invalid Date';
// };


  
  

const handleUpdateDeliveryStatus = async () => {
  setLoading(true);
  try {
      if (!selectedOrderId || !newDeliveryStatus) {
          toast.error('Please provide Order ID and Delivery Status');
          setLoading(false);
          return;
      }

      // Query the Orders collection to find the document with the matching order_ref_id
      const q = query(collection(db, 'Orders'), where('order_ref_id', '==', selectedOrderId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
          toast.error('Order not found');
          setLoading(false);
          return;
      }

      // Update the delivery status and set delivery date if status is "done"
      querySnapshot.forEach(async (docSnapshot) => {
          const orderDocRef = doc(db, 'Orders', docSnapshot.id);
          const updateData = {
              delivery_status: newDeliveryStatus,
          };
          if (newDeliveryStatus.toLowerCase() === 'done') {
              updateData.delivery_date =  new Date().toLocaleString(); // Set current date as delivery date
          }

          await updateDoc(orderDocRef, updateData);
          toast.success('Delivery status updated successfully');
      });

      setSelectedOrderId('');
      setNewDeliveryStatus('');
      fetchOrders(); // Refresh the orders list
  } catch (error) {
      console.error('Error updating delivery status:', error.message);
      toast.error('Error updating delivery status: ' + error.message);
  } finally {
      setLoading(false);
  }
};



  const getProductDetails = (productId) => {
    const product = products.find(product => product.product_ref_id === productId);
    return product || {};
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-2 py-6 max-w-2xl text-white mt-20">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Admin Panel</h1>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 text-white font-bold rounded-l ${activeTab === 'add' ? 'bg-blue-500' : 'bg-gray-600'}`}
            onClick={() => setActiveTab('add')}
          >
            Add Product
          </button>
          <button
            className={`px-4 py-2 text-white font-bold rounded-r ${activeTab === 'remove' ? 'bg-red-500' : 'bg-gray-600'}`}
            onClick={() => setActiveTab('remove')}
          >
            Remove Product
          </button>
          <button
            className={`px-4 py-2 text-white font-bold rounded-r ${activeTab === 'orders' ? 'bg-green-500' : 'bg-gray-600'}`}
            onClick={() => setActiveTab('orders')}
          >
            Order Details
          </button>
          <button
            className={`px-4 py-2 text-white font-bold rounded-r ${activeTab === 'showAll' ? 'bg-purple-500' : 'bg-gray-600'}`}
            onClick={() => setActiveTab('showAll')}
          >
            Show All Products
          </button>
        </div>

        {activeTab === 'add' && (          
          <div className="space-y-4 text-white">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="productId">
                Product ID
              </label>
              <input
                id="productId"
                type="number"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="productName">
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="productDescription">
                Product Description
              </label>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="oldPrice">
                Old Price
              </label>
              <input
                id="oldPrice"
                type="number"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="newPrice">
                New Price
              </label>
              <input
                id="newPrice"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="productImage">
                Product Image
              </label>
              <input
                id="productImage"
                type="file"
                onChange={handleImageChange}
                className="block w-full text-white"
              />
              {selectedImage && <p className="text-white mt-2">{selectedImage}</p>}
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleAddProduct}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'remove' && (
          <div className="space-y-4 text-white">
            <h2 className="text-xl font-bold mb-4">Remove Product</h2>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="removeProductId">
                Product Ref ID
              </label>
              <input
                id="removeProductId"
                type="text"
                value={removeProductId}
                onChange={(e) => setRemoveProductId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleRemoveProduct}
                disabled={loading}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Removing...' : 'Remove Product'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
  <div className="space-y-4 text-white">
    <h2 className="text-xl font-bold mb-4">Order Details</h2>
    {loading ? (
      <LocalLoader />
    ) : (
      <>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="orderId">
            Select Order ID
          </label>
          <select
            id="orderId"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Order</option>
            {orders.map((order) => (
              <option key={order.order_ref_id} value={order.order_ref_id}>
                {order.order_ref_id}
              </option>
            ))}
          </select>
        </div>
        {selectedOrderId && (
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-white" htmlFor="deliveryStatus">
              Delivery Status
            </label>
            <input
              id="deliveryStatus"
              type="text"
              value={newDeliveryStatus}
              onChange={(e) => setNewDeliveryStatus(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleUpdateDeliveryStatus}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
        {orders.length > 0 && (
          <div className=" bg-transparent">
            {orders.map((order) => {
              const product = getProductDetails(order.product_id);
              const isCanceled = order.delivery_status === 'canceled';
              const isDone = order.delivery_status === 'Done';
              const statusStyle = isCanceled
                ? 'text-red-600 '
                : isDone
                ? 'text-green-300 '
                : 'text-white';

              return (
                <div
                  key={order.id}
                  className={`border p-4 rounded mb-4 ${statusStyle}`}
                  
                >
                  <h3 className={`text-lg font-bold ${statusStyle}`}>Order ID: {order.order_ref_id}</h3>
                  <img src={order.product_image} alt={order.product_name} className="w-32 h-32 object-cover mt-2" />
                  <p className={statusStyle}><strong>User Email:</strong> {order.user_email}</p>
                  <p className={statusStyle}><strong>Order Date:</strong> {order.order_date}</p>
                  <p className={statusStyle}><strong>Product ID:</strong> {order.product_id}</p>
                  <p className={statusStyle}><strong>Product Ref ID:</strong> {order.product_ref_id}</p>
                  <p className={statusStyle}><strong>Product Name:</strong> {order.product_name}</p>
                  <p className={statusStyle}><strong>Product Quantity:</strong> {order.quantity}</p>
                  <p className={statusStyle}><strong>Total Price:</strong> ₹ {order.total_price}</p>
                  <p className={statusStyle}><strong>Delivery Status:</strong> {order.delivery_status}</p>
                  <p className={statusStyle}><strong>Delivery Date:</strong> {order.delivery_date}</p>
                  {isCanceled && (
                    <p className="text-red-500"><strong>Cancellation Date:</strong> {order.cancellation_date}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
)}

        {activeTab === 'showAll' && (
  <div className="bg-transparent w-full max-w-4xl mx-auto p-6 rounded-lg">
    <h2 className="text-xl font-bold mb-4 text-center">All Products</h2>
    {loading ? (
              <LocalLoader />
            ) : (
    <>
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.product_name} className="w-32 h-32 object-cover rounded-lg" />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-700">No image</span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">Product Ref ID: {product.product_ref_id}</h3>
            <p><strong>Added On:</strong> {product.addedOn}</p>
            <p><strong>Product ID:</strong> {product.product_id}</p>
            <p><strong>Product Name:</strong> {product.product_name}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Old Price:</strong> ₹{product.old_price}</p>
            <p><strong>New Price:</strong> ₹{product.new_price}</p>
          </div>
        </div>
            ))}
    </div></>)}
            
  </div>
)}


      </div>
    </>
  );
}




