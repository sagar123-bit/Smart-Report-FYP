import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar';
import { ChevronDown, Globe, Check, User, LogOut, Home, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuthUser, logoutUser } from '@/store/slices/userSlice';

const CitizenNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state?.user?.user);
  // console.log("User Data in Navbar:", userData);
  
  const navItems = [
    { id: 1, name: 'Home', path: '/' },
    { id: 2, name: 'About', path: '/about' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const foundLanguage = languages.find(lang => lang.code === savedLanguage);
      if (foundLanguage) {
        setSelectedLanguage(foundLanguage);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('preferredLanguage', language.code);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(fetchAuthUser());
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const getAvatarInitial = () => {
    if (userData?.userName) {
      return userData.userName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-14 w-14 rounded-lg ">
                <img 
                  src="/images/logo.png" 
                  alt="SmartReport Logo" 
                  className="h-14 w-14"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartReport</span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                className={`px-3 py-2 text-sm font-medium transition duration-150 relative group ${
                  isActivePath(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                  isActivePath(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150">
                <Globe className="h-4 w-4" />
                <span>{selectedLanguage.flag} {selectedLanguage.name}</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                    {selectedLanguage.code === language.code && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.imageUrl} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getAvatarInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{userData.userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  onClick={() => handleNavigate('/register')}
                  className="px-4 py-2 rounded-md text-sm font-medium border border-blue-200 cursor-pointer"
                >
                  Register
                </Button>

                <Button
                  onClick={() => handleNavigate('/login')}
                  className="px-4 py-2 rounded-md text-white text-sm font-medium shadow-sm hover:shadow cursor-pointer"
                >
                  Login
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition duration-150"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              onClick={closeMenu}
              className={`block px-3 py-3 rounded-md text-base font-medium transition duration-150 border-b border-gray-100 ${
                isActivePath(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </a>
          ))}

          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Select Language</p>
            <div className="space-y-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    handleLanguageChange(language);
                    closeMenu();
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-left ${
                    selectedLanguage.code === language.code
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{language.flag}</span>
                    <span>{language.name}</span>
                  </div>
                  {selectedLanguage.code === language.code && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {userData ? (
            <>
              <div className="px-3 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData?.imageUrl} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getAvatarInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{userData.userName}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => { handleProfile(); closeMenu(); }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => { handleLogout(); closeMenu(); }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <a
                href="/register"
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition duration-150 border-b border-gray-100"
              >
                Register
              </a>

              <a
                href="/login"
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition duration-150 mt-2"
              >
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CitizenNavbar;