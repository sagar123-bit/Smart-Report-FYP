import { cn } from '@/lib/utils';
import {
  clearAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead
} from '@/store/slices/getAllNotifications';
import { logoutUser } from '@/store/slices/userSlice';
import {
  Bell,
  CheckCheck,
  CheckCircle,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router';

const PoliceSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  
  const { user } = useSelector(state => state.user);
  const { notifications: allNotifications, loading } = useSelector(state => state.allNotifications);
  
  const userNotifications = allNotifications.filter(notification => 
    notification.userId?._id === user?._id
  );
  
  const unreadCount = userNotifications.filter(notification => !notification.read).length;
  
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  
  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsRead());
      setIsNotificationOpen(false);
    }
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  const isActive = (itemPath, exact = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath || 
           location.pathname.startsWith(itemPath + '/');
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
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/policedashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'All Reports',
      path: '/policedashboard/allreports',
      icon: FileText,
    },
    {
      name: 'Accepted Reports',
      path: '/policedashboard/acceptedreports',
      icon: CheckCircle,
    },
    {
      name: 'Chats',
      path: '/policedashboard/chats',
      icon: MessageSquare,
    },
    {
      name: 'Profile Settings',
      path: '/policedashboard/profile-setting',
      icon: Settings,
    },
  ];

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-white border border-gray-200 shadow-md"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 z-40 transition-transform duration-300 ease-in-out flex flex-col",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 px-1 rounded-lg">
              <img src="/images/logo.png" alt="Police Logo" className="h-12 w-12" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Police Portal</h1>
              <p className="text-sm text-gray-600">Smart Report</p>
            </div>
          </div>
          
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {isNotificationOpen && (
              <div className="fixed lg:absolute top-16 left-0 lg:top-auto lg:mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
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
                                onClick={(e) => handleDeleteNotification(notification._id, e)}
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
                    <p className="text-gray-600">No notifications</p>
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
                      Mark All as Read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      active 
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5",
                      active ? "text-blue-600" : "text-gray-500"
                    )} />
                    <span className="font-medium">{item.name}</span>
                    {active && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200">
          <div className="p-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Need Help?</p>
                <p className="text-sm text-gray-600 mt-1">
                  Contact support for assistance
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-3 w-full p-4 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-t border-gray-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default PoliceSidebar;
