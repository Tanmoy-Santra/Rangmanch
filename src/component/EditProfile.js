import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from './Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/outline'; // Import the edit icon

const EditProfile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [userPhotoUrl, setUserPhotoUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
          setAddress(userData.address || '');
          setPhone(userData.phone || '');
          setUserPhotoUrl(userData.photo || user.photoURL || '/default-profile.jpg');
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        let photoUrl = userPhotoUrl;
        if (photo) {
          const photoRef = ref(storage, `profile_photos/${photo.name}`);
          await uploadBytes(photoRef, photo);
          photoUrl = await getDownloadURL(photoRef);
        }

        const userRef = doc(db, 'Users', user.uid);
        await updateDoc(userRef, {
          firstName: firstName,
          lastName: lastName,
          photo: photoUrl,
          address: address,
          phone: phone,
        });
        toast.success('Profile updated successfully');
        navigate('/product');                
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen ">
        <div className="p-6 rounded-lg shadow-lg max-w-md w-full text-white mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 text-white">Edit Profile</h2>
          <form className="space-y-4 text-white">
            <div className="relative mb-4 flex justify-center items-center">
              <img
                src={photo ? URL.createObjectURL(photo) : userPhotoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              <label
                htmlFor="photo"
                className="absolute bottom-0 right-13 bg-purple-500 text-white p-2 rounded-full cursor-pointer"
                style={{ transform: 'translate(50%, 50%)' }}
              >
                <PencilIcon className="w-4 h-4" />
                <input
                  id="photo"
                  type="file"
                  onChange={handleImageChange}
                  accept=".jpg, .jpeg, .png"
                  className="hidden"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-800 text-white" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-800"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-800 text-white" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-800"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-800 text-white" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-800"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-800 text-white" htmlFor="phone">
                Mobile Number
              </label>
              <input
                id="phone"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-800"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="text-white font-bold py-2 w-full px-4 rounded focus:outline-none btn-custom-color"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
