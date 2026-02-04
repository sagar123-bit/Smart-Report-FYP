import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);

  const provinces = [
    { number: "1", name: t('koshi') },
    { number: "2", name: t('madhesh') },
    { number: "3", name: t('bagmati') },
    { number: "4", name: t('gandaki') },
    { number: "5", name: t('lumbini') },
    { number: "6", name: t('karnali') },
    { number: "7", name: t('sudurpashchim') },
  ];

  const features = [
    {
      title: t('forCitizens'),
      items: [
        t('citizenFeature1'),
        t('citizenFeature2'),
        t('citizenFeature3'),
        t('citizenFeature4'),
        t('citizenFeature5')
      ]
    },
    {
      title: t('forPolice'),
      items: [
        t('policeFeature1'),
        t('policeFeature2'),
        t('policeFeature3'),
        t('policeFeature4'),
        t('policeFeature5')
      ]
    },
    {
      title: t('forAdministrators'),
      items: [
        t('adminFeature1'),
        t('adminFeature2'),
        t('adminFeature3'),
        t('adminFeature4'),
        t('adminFeature5')
      ]
    }
  ];

  const aboutStats = [
    { title: t('secureConfidential'), description: t('secureDesc') },
    { title: t('fastResponse'), description: t('fastResponseDesc') },
    { title: t('transparentProcess'), description: t('transparentDesc') },
  ];

  return (
    <div className="min-h-screen">
      <div 
        className="relative h-[60vh] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/about.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative h-full mx-auto px-4 flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {t('aboutTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90">
              {t('aboutSubtitle')}
            </p>
            {user ? (
              <Button
                onClick={() => navigate("/reportcrime")}
                className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
                size="lg"
              >
                {t('reportCrime')}
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/register")}
                className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
                size="lg"
              >
                {t('joinNow')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('ourMission')}</h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="text-lg mb-6">
              {t('missionPara1')}
            </p>
            <p className="text-lg mb-6">
              {t('missionPara2')}
            </p>
            <p className="text-lg">
              {t('missionPara3')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutStats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-4 text-green-900">{stat.title}</h3>
                  <p className="text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('platformFeatures')}</h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          {t('platformFeaturesDesc')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-green-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-green-900 border-b pb-4">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-3">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('servingAllProvinces')}</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {t('provincesDesc')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-16">
            {provinces.map((province) => (
              <Card key={province.number} className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-900 mb-2">{province.number}</div>
                  <div className="text-lg font-medium text-gray-700">{province.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t pt-12 mt-12">
            <h3 className="text-2xl font-bold text-center mb-8">{t('needHelp')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">{t('emergency')}</div>
                <div className="text-2xl font-bold text-gray-700">100</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">{t('email')}</div>
                <div className="text-lg font-medium text-gray-700">support@smartreport.gov.np</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">{t('helpline')}</div>
                <div className="text-2xl font-bold text-gray-700">+977-1-4200000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;