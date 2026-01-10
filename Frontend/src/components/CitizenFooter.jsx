
import { Link } from "react-router";
import { useSelector } from "react-redux";

const CitizenFooter = () => {
  const userData = useSelector(state => state?.user?.user);
  
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    ...(!userData ? [
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" },
    ] : []),
  ];

  const emergencyContacts = [
    { service: "Police", number: "100" },
    { service: "Ambulance", number: "102" },
    { service: "Fire", number: "101" },
    { service: "Women Helpline", number: "1145" },
  ];

  return (
    <footer className="relative text-white py-12 mt-2">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: "url('/images/footerbg.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">SmartReport</h2>
            <p className="text-gray-200">
              Online crime reporting and management system for Nepal
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-200 hover:text-white transition-colors cursor-pointer hover:underline flex items-center"
                  >
                    <span className="mr-2">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Emergency</h3>
            <ul className="space-y-3">
              {emergencyContacts.map((contact) => (
                <li key={contact.service} className="text-gray-200 hover:text-white transition-colors">
                  <span className="font-semibold">{contact.service}: </span>
                  <span className="ml-2 font-bold text-white">{contact.number}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-green-700">
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <div className="space-y-3 text-gray-200">
            <p className="flex items-center">
              <span className="mr-3">✉️</span>
              support@smartreport.gov.np
            </p>
            <p className="flex items-center">
              <span className="mr-3">📞</span>
              +977-1-4200000
            </p>
            <p className="flex items-center">
              <span className="mr-3">📍</span>
              Ithari, Nepal
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-green-700 text-center text-gray-300">
          <p>© 2025 SmartReport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CitizenFooter;
