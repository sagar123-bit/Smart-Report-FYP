import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const About = () => {
  const navigate = useNavigate();

  const provinces = [
    { number: "1", name: "Koshi" },
    { number: "2", name: "Madhesh" },
    { number: "3", name: "Bagmati" },
    { number: "4", name: "Gandaki" },
    { number: "5", name: "Lumbini" },
    { number: "6", name: "Karnali" },
    { number: "7", name: "Sudurpashchim" },
  ];

  const features = [
    {
      title: "For Citizens",
      items: [
        "File crime reports with evidence",
        "Track case status in real-time",
        "Chat with assigned police officers",
        "Receive notifications on updates",
        "SOS emergency reporting"
      ]
    },
    {
      title: "For Police",
      items: [
        "View province-specific cases",
        "Accept and assign cases",
        "Update case status and notes",
        "Request additional information",
        "Close resolved cases"
      ]
    },
    {
      title: "For Administrators",
      items: [
        "View all cases nationwide",
        "Manage user accounts",
        "Detect fake/duplicate reports",
        "View analytics and statistics",
        "Monitor system activity"
      ]
    }
  ];

  const aboutStats = [
    { title: "Secure & Confidential", description: "All reports are encrypted and handled with utmost confidentiality" },
    { title: "Fast Response", description: "Quick assignment and response from local police authorities" },
    { title: "Transparent Process", description: "Track every step of your case from filing to resolution" },
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
              About SmartReport
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90">
              Nepal's first comprehensive online crime reporting and management system
            </p>
            <Button
              onClick={() => navigate("/register")}
              className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
              size="lg"
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Mission</h2>
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="text-lg mb-6">
              SmartReport is dedicated to creating a safer Nepal by providing an accessible, transparent, and efficient platform for crime reporting and management. We bridge the gap between citizens and law enforcement agencies through technology.
            </p>
            <p className="text-lg mb-6">
              Our platform empowers citizens to report crimes easily, track case progress in real-time, and communicate directly with police officers. We ensure that every voice is heard and every case receives the attention it deserves.
            </p>
            <p className="text-lg">
              By leveraging modern technology, we aim to reduce response times, improve case resolution rates, and build trust between communities and law enforcement.
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Platform Features</h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Comprehensive tools for citizens, police, and administrators
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Serving All 7 Provinces</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Province-based access control ensures relevant case visibility
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
            <h3 className="text-2xl font-bold text-center mb-8">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">Emergency</div>
                <div className="text-2xl font-bold text-gray-700">100</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">Email</div>
                <div className="text-lg font-medium text-gray-700">support@smartreport.gov.np</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">Helpline</div>
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