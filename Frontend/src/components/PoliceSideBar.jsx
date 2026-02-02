import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import { 
  LayoutDashboard,
  FileText,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PoliceSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
  ];

  const handleLogout = () => {
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
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 px-1 rounded-lg">
              <img src="/images/logo.png" alt="Police Logo" className="h-12 w-12" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Police Portal</h1>
              <p className="text-sm text-gray-600">Smart Report</p>
            </div>
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