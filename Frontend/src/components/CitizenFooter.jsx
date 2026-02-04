import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const CitizenFooter = () => {
  const { t } = useTranslation();
  const userData = useSelector(state => state?.user?.user);
  
  const quickLinks = [
    { name: "home", href: "/" },
    { name: "about", href: "/about" },
    ...(!userData ? [
      { name: "login", href: "/login" },
      { name: "register", href: "/register" },
    ] : []),
  ];

  const emergencyContacts = [
    { service: t('police'), number: "100" },
    { service: t('ambulance'), number: "102" },
    { service: t('fire'), number: "101" },
    { service: t('womenHelpline'), number: "1145" },
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
            <div className="flex flex-row  gap-4 items-center">
              <img src="/images/logo.png" alt="SmartReport Logo" className="h-16 w-16 mb-4" />

            <h2 className="text-3xl font-bold mb-4">{t('smartReport')}</h2>
            </div>
            <p className="text-gray-200">
              {t('footerDescription')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-200 hover:text-white transition-colors cursor-pointer hover:underline flex items-center"
                  >
                    <span className="mr-2">→</span>
                    {t(link.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">{t('emergency')}</h3>
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
          <h3 className="text-xl font-semibold mb-4">{t('contact')}</h3>
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
              {t('location')}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-green-700 text-center text-gray-300">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default CitizenFooter;