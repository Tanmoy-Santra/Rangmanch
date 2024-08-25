import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import emailjs from 'emailjs-com'; // Import emailjs-com library
import logoIcon from './Assets/logo-rangmanch.png';
import { toast } from 'react-toastify';
import { db, storage } from './Firebase'; // Import Firebase Firestore and Storage
import { auth} from './Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import phonePay from './Assets/phonepe-icon.webp'
import googlePay from './Assets/google pay.png'
import upi from './Assets/upi.png'
import LocalLoader from '../Loders/LocalLoader';
import payment_qr from './Assets/payment_qr.png';
const BillPopup = ({ product, quantity, totalPrice, user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  // Validation state
  const [locationDetailsError, setLocationDetailsError] = useState('');
  const [mobileNoError, setMobileNoError] = useState('');
  const [transactionDetailsError, setTransactionDetailsError] = useState('');
  
  const [upiId, setUpiId] = useState('');
  const [upiIdError, setUpiIdError] = useState('');

  // Effect to validate fields on input change

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true); // Show loader
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setLocationDetails(docSnap.data().address);
            setMobileNo(docSnap.data().phone);
          }
        }
      } catch (error) {
        console.log('Error fetching user information !!', error.message);
        toast.error(`Error fetching user information !!`, { position: 'top-center' });
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    validateFields();
  }, [locationDetails, mobileNo, transactionId, showPaymentSection]);

  // Function to validate fields
  const validateFields = () => {
    const regexMobile = /^[6-9]\d{9}$/;
    const regexLocation = /^[#.0-9a-zA-Z\s,-]+$/;
    const regexTransaction = /^[A-Z0-9]{11}((\w|[:-]){0,30}[A-Z0-9])?$/;
    const regexUpiId = /^[\w.-]+@[\w.-]+$/; // Basic UPI ID regex validation
    let isValid = true;

    if (!regexLocation.test(locationDetails)) {
      setLocationDetailsError('Location details cannot be empty or invalid location details');
      isValid = false;
    } else {
      setLocationDetailsError('');
    }

    if (showPaymentSection && upiId && !regexUpiId.test(upiId)) {
      setUpiIdError('Enter a valid UPI ID');
      isValid = false;
    } else {
      setUpiIdError('');
    }

    if (showPaymentSection && transactionId && !regexTransaction.test(transactionId)) {
      setTransactionDetailsError('Enter valid Transaction ID');
      isValid = false;
    } else {
      setTransactionDetailsError('');
    }

    if (!regexMobile.test(mobileNo)) {
      setMobileNoError('Mobile number is invalid');
      isValid = false;
    } else {
      setMobileNoError('');
    }

    return isValid;
  };

  // Handle make payment button click
  const handleMakePayment = () => {
    setShowPaymentSection(true);
  };

  // Handle confirm order button click
  // const handleConfirmOrder = async () => {
  //   if (validateFields()) {
  //     setLoading(true);
  //     try {
  //       const imageUrl = await uploadImageToStorage(product.image);
  //       await saveOrderToFirestore(imageUrl);
  //       sendEmail(); // Send email when order is confirmed
  //       toast.success('Order confirmed!', { position: 'top-center' });
  //       downloadBill();
  //       onClose();
  //     } catch (error) {
  //       console.error('Error saving order:', error);
  //       toast.error('Failed to confirm order. Please try again.', { position: 'top-center' });
  //     } finally {
  //       setLoading(false); // Hide loader
  //     }
  //   } else {
  //     toast.error('Please fill in all required fields correctly.', { position: 'top-center' });
  //   }
  // };
  const handleConfirmOrder = async () => {
    if (!locationDetails || !mobileNo || (showPaymentSection && !transactionId && !upiId)) {
      toast.error("Please fill in all required fields correctly.", { position: 'top-center' });
      return;
    }
    if (validateFields()) {
      setLoading(true);
      try {
        let imageUrl;
        // Check if the product image is a URL
        if (typeof product.image === 'string' && product.image.startsWith('http')) {
          imageUrl = product.image;
        } else {
          // Upload the image file to storage and get the URL
          imageUrl = await uploadImageToStorage(product.image);
        }
        await saveOrderToFirestore(imageUrl);
        sendEmail(); // Send email when order is confirmed
        toast.success('Order confirmed!', { position: 'top-center' });
        downloadBill();
        onClose();
      } catch (error) {
        console.error('Error saving order:', error);
        toast.error('Failed to confirm order. Please try again.', { position: 'top-center' });
      } finally {
        setLoading(false); // Hide loader
      }
    } else {
      toast.error('Please fill in all required fields correctly.', { position: 'top-center' });
    }
  };
  

  // Function to upload image to Firebase Storage
  const uploadImageToStorage = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${product.product_id}`);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  const  order_ref_id=Date.now().toString()

  // Function to save order details to Firestore
  const saveOrderToFirestore = async (imageUrl) => {
    try {
      setLoading(true);
      const ordersCollection = collection(db, 'Orders');
      const orderData = {
        product_ref_id: product.product_ref_id,
        order_ref_id: order_ref_id,
        product_id: product.product_id,
        product_name: product.product_name,
        product_image: imageUrl, // Use the image URL from storage
        quantity,
        total_price: totalPrice,
        user_name: user.name,
        user_email: user.email,
        phone: mobileNo,
        location: locationDetails,
        payment_method: showPaymentSection ? 'Online' : 'Manual',
        transaction_id: showPaymentSection && transactionId ? transactionId : 'NA',
        upi_id: showPaymentSection && upiId ? upiId : 'NA', // Add UPI ID
        order_date: new Date().toLocaleString(),
      };

      await addDoc(ordersCollection, orderData);
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      toast.error('Error saving order to Firestore !!', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Function to send email using emailJS
  const sendEmail = async () => {
    setLoading(true);
    try {
      // Configure emailJS parameters (replace with your own IDs)
      const SERVICE_ID = process.env.REACT_APP_SERVICE_ID;
      const TEMPLATE_ID = process.env.REACT_APP_TEMPLATE_ID;
      const USER_ID = process.env.REACT_APP_USER_ID;

      // Prepare template parameters
      const currentDate = new Date().toLocaleString();
      const templateParams = {
        currentDate: currentDate,
        user_name: user.name,
        user_email: user.email, // Replace with your recipient email address
        message: `
          Order Details 
          --------------------------------- 
          Product ID : ${product.product_id} 
          Product Ref ID : ${product.product_ref_id} 
          Order Ref ID : ${order_ref_id} 
          Product Name : ${product.product_name}         
          Total Quantity : ${quantity} 
          Total Price : ${totalPrice.toFixed(2)} 
          Customer Name : ${user.name}
          Customer EmailId : ${user.email}
          Mobile No.: ${mobileNo}
          Location Details : ${locationDetails} 
          Payment Method : ${showPaymentSection ? 'Online' : 'Manual'}
          Transaction ID : ${showPaymentSection && transactionId ? transactionId : 'NA'}
          Upi ID: ${showPaymentSection && upiId ? upiId : 'NA'} // Add UPI ID
          Order Date : ${currentDate}
        `
      };

      // Send email
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Email send error:', error);
      toast.error('Email send error !!', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Function to download bill as PDF
  const downloadBill = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      // Add watermark
      doc.setFontSize(30);
      doc.setTextColor(150);
      doc.text('Rangmanch', 35, 200, { angle: -45 });

      // Add logo (assuming logoIcon is a base64 string)
      const logo = logoIcon;
      doc.addImage(logo, 'PNG', 150, 10, 40, 40);

      // Order Summary
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Order Summary', 20, 60);

      // Add details
      const currentDate = new Date().toLocaleString();
      const details = [
        { key: 'Product ID', value: product.product_id },
        { key: 'Product Ref ID', value: product.product_ref_id },
        { key: 'Order Ref ID', value: order_ref_id },
        { key: 'Product Name', value: product.product_name },
        { key: 'Total Quantity', value: quantity },
        { key: 'Total Price', value: `Rs.${totalPrice.toFixed(2)}` },
        { key: 'User', value: user.name },
        { key: 'Email', value: user.email },
        { key: 'Order Date', value: currentDate },
        { key: 'Mobile No.', value: mobileNo },
        { key: 'Location Details', value: locationDetails },
      ];

      if (showPaymentSection) {
        details.push({ key: 'Payment Method', value: 'Online' });
        if (transactionId) {
          details.push({ key: 'Transaction ID', value: transactionId });
        }
      } else {
        details.push({ key: 'Payment Method', value: 'Manual' });
      }

      doc.autoTable({
        startY: 70,
        body: details.map((item) => [item.key, item.value]),
        theme: 'grid',
        styles: {
          cellPadding: 3,
          fontSize: 12,
          valign: 'middle',
        },
        headStyles: {
          fillColor: [220, 220, 220],
        },
      });

      // QR Code
      const qrCode = document.getElementById('qrCode');
      if (qrCode) {
        const qrImageData = qrCode.toDataURL('image/png');
        doc.addImage(qrImageData, 'PNG', 160, 60, 40, 40);
      }

      // Save the PDF
      doc.save(`${product.product_name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF !!', { position: 'top-center' });
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 pt-20 mt-20 mb-20 rounded-lg max-w-md w-full relative overflow-y-auto max-h-screen">
        <button className="absolute top-15 right-3 bg-gray-500 text-white p-2 rounded-full" onClick={onClose}>
          &times;
        </button>
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex items-center mb-4">
              <img src={product.image} alt={product.product_name} className="h-20 w-20 rounded-lg mr-4" />
              <div>
                <p className="text-sm">Product ID: {product.product_id}</p>
                <p className="text-sm">Product Ref ID: {product.product_ref_id}</p>
                <p className="text-sm">Order Ref ID: {order_ref_id }</p>
                <p className="text-sm">Product Name: {product.product_name}</p>
                <p className="text-sm">Total Quantity: {quantity}</p>
                <p className="text-sm">Total Price: ₹ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            {/* User and email details */}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Your current location details:</label>
          <textarea
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg mb-4 ${locationDetailsError ? 'border-red-500' : ''}`}
            placeholder="Enter your current location details"
            value={locationDetails}
            onChange={(e) => setLocationDetails(e.target.value)}
          />
          {locationDetailsError && <p className="text-red-500 text-xs">{locationDetailsError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Mobile No:</label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded-lg mb-4 ${mobileNoError ? 'border-red-500' : ''}`}
            placeholder="Enter your mobile number"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
          />
          {mobileNoError && <p className="text-red-500 text-xs">{mobileNoError}</p>}
        </div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 btn-custom-color ${showPaymentSection ? 'hidden' : ''}`}
          onClick={handleMakePayment}
        >
          Make Payment
        </button>
        {showPaymentSection && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-lg font-bold mb-2">Payment Section</h3>
            <img width={200} src={payment_qr} value="payment-info" className="mb-4" />
            <div className="flex justify-between mb-4">
              <img src={upi} alt="UPI" className="h-10" />
              <img src={phonePay} alt="PhonePe" className="h-6" />
              <img src={googlePay} alt="Google Pay" className="h-6" />
            </div>
            <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg mb-4"
          />
          {upiIdError && <p className="text-red-500 text-xs">{upiIdError}</p>}

            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            {transactionDetailsError && <p className="text-red-500 text-xs">{transactionDetailsError}</p>}
            <button className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 btn-custom-color" onClick={() => setShowPaymentSection(false)}>
              Close Payment
            </button>
          </div>
        )}
        <button
          // disabled={!locationDetails || !mobileNo || (showPaymentSection && !transactionId)}
          // className={`mt-4 mx-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 btn-custom-color`}
          // onClick={handleConfirmOrder}
          disabled={!locationDetails || !mobileNo || (showPaymentSection && !transactionId)}
  className={`mt-4 mx-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 btn-custom-color ${(!locationDetails || !mobileNo || (showPaymentSection && !transactionId)) && 'opacity-50 cursor-not-allowed'}`}
  onClick={handleConfirmOrder}
        >
          Confirm Order
        </button>
      </div>{loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-60">
    <LocalLoader />
  </div>
)}
</div>  
   
  );
};

export default BillPopup;
