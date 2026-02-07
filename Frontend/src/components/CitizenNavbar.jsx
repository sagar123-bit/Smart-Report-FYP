import {
  clearAllNotifications,
  deleteNotification,
  markAllNotificationsRead
} from '@/store/slices/getAllNotifications';
import { logoutUser } from '@/store/slices/userSlice';
import { Bell, Check, CheckCheck, ChevronDown, FileText, Globe, LogOut, Trash2, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const CitizenNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const userData = useSelector(state => state?.user?.user);
  const { notifications: allNotifications, loading } = useSelector(state => state.allNotifications);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ne', name: 'नेपाली (Nepali)', flag: '🇳🇵' },
  ];
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  
  const userNotifications = allNotifications?.filter(notification => 
    notification.userId?._id === userData?._id
  );
  
  const unreadCount = userNotifications?.filter(notification => !notification.read).length;
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !event.target.closest('[data-notification-button]')
      ) {
        if(isNotificationOpen){
          setIsNotificationOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);
=======
  const unreadCount = userNotifications.filter(notification => !notification.read).length;

>>>>>>> 3d05f35083cd759a40d61a2bfbbc22321c93ce78
  
  const baseNavItems = [
    { id: 1, name: 'home', path: '/' },
    { id: 2, name: 'about', path: '/about' },
  ];

  const authNavItems = [
    { id: 3, name: 'reportCrime', path: '/reportcrime', icon: <FileText className="h-4 w-4 mr-2" /> },
  ];

  const navItems = [
    ...baseNavItems,
    ...(userData ? authNavItems : [])
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    const foundLanguage = languages.find(lang => lang.code === savedLanguage);
    if (foundLanguage) {
      setSelectedLanguage(foundLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNotificationClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsNotificationOpen(prev => !prev);
  };

  const handleMarkAllRead = async () => {
    if (unreadCount > 0) {
      await dispatch(markAllNotificationsRead());
      setIsNotificationOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('preferredLanguage', language.code);
    i18n.changeLanguage(language.code);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
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

  const handleDeleteNotification = (notificationId, e) => {
    e.stopPropagation();
    dispatch(deleteNotification(notificationId));
    setIsNotificationOpen(false);
  };

  const handleClearAllNotifications = () => {
    const userNotificationIds = userNotifications.map(n => n._id);
    if (userNotificationIds.length > 0) {
      dispatch(clearAllNotifications());
      setIsNotificationOpen(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-14 w-14 rounded-lg ">
                <img 
                  src="/images/logo.png" 
                  alt="SmartReport Logo" 
                  className="h-14 w-14"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">{t('smartReport')}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium transition duration-150 relative group flex items-center ${
                  isActivePath(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.icon && item.icon}
                {t(item.name)}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                  isActivePath(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
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

            {userData && (
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  data-notification-button
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50" >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{t('notifications')}</h3>
                      {userNotifications.length > 0 && (
                        <button
                          onClick={handleClearAllNotifications}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading notifications...</p>
                      </div>
                    ) : userNotifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {userNotifications.map((notification) => (
                          <div 
                            key={notification._id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                            onClick={() => setIsNotificationOpen(false)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(notification.createdAt)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(notification._id, e);
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">{t('noNotifications')}</p>
                        <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                      </div>
                    )}
                    
                    {userNotifications.length > 0 && unreadCount > 0 && (
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={handleMarkAllRead}
                          className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <CheckCheck className="h-4 w-4" />
                          {t('markAllRead')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${userData.userImage}`} />
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
                    <span>{t('profile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  onClick={() => handleNavigate('/register')}
                  className="px-4 py-2 rounded-md text-sm font-medium border border-blue-200 cursor-pointer"
                >
                  {t('register')}
                </Button>

                <Button
                  onClick={() => handleNavigate('/login')}
                  className="px-4 py-2 rounded-md text-white text-sm font-medium shadow-sm hover:shadow cursor-pointer"
                >
                  {t('login')}
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            {userData && (
              <div className="relative mr-2">
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  data-notification-button
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {isNotificationOpen && (
                  <div className="fixed top-16 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50" >
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{t('notifications')}</h3>
                      {userNotifications.length > 0 && (
                        <button
                          onClick={handleClearAllNotifications}
                          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear All
                        </button>
                      )}
                    </div>
                    
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading notifications...</p>
                      </div>
                    ) : userNotifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {userNotifications.map((notification) => (
                          <div 
                            key={notification._id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                            onClick={() => setIsNotificationOpen(false)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatTimeAgo(notification.createdAt)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNotification(notification._id, e);
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">{t('noNotifications')}</p>
                        <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                      </div>
                    )}
                    
                    {userNotifications.length > 0 && unreadCount > 0 && (
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={handleMarkAllRead}
                          className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <CheckCheck className="h-4 w-4" />
                          {t('markAllRead')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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
            <Link
              key={item.id}
              to={item.path}
              onClick={closeMenu}
              className={`block px-3 py-3 rounded-md text-base font-medium transition duration-150 border-b border-gray-100 flex items-center ${
                isActivePath(item.path)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              {item.icon && item.icon}
              {t(item.name)}
            </Link>
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
                    <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${userData.userImage}`} />
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
                    <span>{t('profile')}</span>
                  </button>
                  <button
                    onClick={() => { handleLogout(); closeMenu(); }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition duration-150 border-b border-gray-100"
              >
                {t('register')}
              </Link>

              <Link
                to="/login"
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition duration-150 mt-2"
              >
                {t('login')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CitizenNavbar;