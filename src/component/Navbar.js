import React, { useState, useEffect } from 'react';
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, ShoppingCartIcon, XMarkIcon, ArrowLeftOnRectangleIcon, HomeIcon, ShoppingBagIcon, DocumentTextIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import logo from './Assets/logo-rangmanch.png';
import { auth, db } from './Firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import usericon from './Assets/user-icon.png';
import { toast } from 'react-toastify';
import Cart from './Cart';
import { useCart } from './CartContext';
import LocalLoader from '../Loders/LocalLoader';
import OrderHistory from './OrderHistory';

const navigation = [
  { name: 'HOME', to: '/home', current: false, icon: HomeIcon },
  { name: 'PRODUCT', to: '/product', current: false, icon: ShoppingBagIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // Added useNavigate
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserFirstName(docSnap.data().firstName);
            setUserLastName(docSnap.data().lastName);
            setUserEmail(docSnap.data().email);
            setUserPhoto(docSnap.data().photo);

            // Check if user is admin
            const adminEmail = process.env.REACT_APP_ADMIN_ID; // Replace with your admin email
            if (docSnap.data().email === adminEmail) {
              setIsAdmin(true);
              console.log('admin is here');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user information:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      toast.success('Successfully signed out');
      navigate('/login'); // Use navigate instead of window.location.href
    } catch (error) {
      console.error('Error signing out:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Disclosure as="nav" className="custom-nav-bg fixed top-0 w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-nav-text hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img className="h-10 w-auto" src={logo} alt="Your Company" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          item.current || location.pathname === item.to ? 'bg-nav-text-current text-white' : 'text-gray-300 hover:bg-nav-text hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <item.icon className="h-4 w-4 mr-1 pb-1 inline" aria-hidden="true" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-600 text-white text-xs leading-tight text-center">
                      {cart.length}
                    </span>
                  )}
                </button>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img className="flex items-center justify-center w-8 h-8  text-white font-xl font-bold rounded-full"
                        src={userPhoto}/>                      
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-55 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in "
                  >
                    <MenuItem>
                      {({ active }) => (
                        <div
                  className={classNames(
                    active ? 'bg-gray-100' : '',
                    'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                  )}
                >
                  <div className="flex items-center relative">
                    <img
                      className="h-20 w-20 rounded-full object-cover mx-auto"
                      src={userPhoto}
                      alt="User avatar"
                    />
                    <button
                      className="absolute top-0 right-0 m-1 p-2 text-white bg-purple-500 rounded-full hover:bg-purple-700"
                      onClick={() => navigate('/edit-profile')}
                      aria-label="Edit profile"
                    >
                      <PencilIcon className="h-5 w-5 bg-transparent" />
                    </button>
                  </div>
                  <div className="ml-2 mt-2 text-xl font-medium text-gray-900 mx-auto">
                    {userFirstName} {userLastName}
                  </div>
                  <div className="ml-2 mt-2 text-sm font-small text-gray-900 mx-auto">
                    {userEmail}
                  </div>
                </div>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => setIsOrderPopupOpen(true)}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-white w-fit text-left btn-custom-color relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white  focus:ring-offset-2 focus:ring-offset-gray-800 mx-auto my-5 flex items-center px-4 py-2 text-sm text-gray-700 w-fit'
                          )}
                        >
                          <ShoppingCartIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                          Orders
                        </button>
                      )}
                    </MenuItem>
                    {isAdmin && ( // Conditionally render the admin button
                      <MenuItem>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => navigate('/admin-use-only')} // Navigate to AdminUseOnly page
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-white w-fit text-left btn-custom-color relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white  focus:ring-offset-2 focus:ring-offset-gray-800 mx-auto my-5 flex items-center px-4 py-2 text-sm text-gray-700 w-fit'
                            )}
                          >
                            <DocumentTextIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                            Admin Panel
                          </button>
                        )}
                      </MenuItem>
                    )}
                    <MenuItem>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-white w-fit text-left btn-custom-color relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white  focus:ring-offset-2 focus:ring-offset-gray-800 mx-auto my-5 flex items-center px-4 py-2 text-sm text-gray-700 w-fit'
                          )}
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.to}
                  className={classNames(
                    item.current || location.pathname === item.to ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>

          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <OrderHistory isOpen={isOrderPopupOpen} onClose={() => setIsOrderPopupOpen(false)} userEmail={userEmail} />
          {loading && <LocalLoader />}
        </>
      )}
    </Disclosure>
  );
}
