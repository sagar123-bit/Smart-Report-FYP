import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Home = () => {
  const navigate = useNavigate();
  const userState = useSelector(state => state?.user);
  const { user, loading } = userState || {};

  const stats = [
    { number: "7", label: "Provinces Covered" },
    { number: "24/7", label: "Support Available" },
    { number: "100%", label: "Secure Platform" },
    { number: "Fast", label: "Response Time" },
  ];

  const howItWorks = [
    { step: "1", title: "Register", description: "Create your account as citizen or police" },
    { step: "2", title: "Report Crime", description: "File a detailed report with evidence" },
    { step: "3", title: "Track Status", description: "Monitor your case progress in real-time" },
    { step: "4", title: "Get Resolution", description: "Receive updates until case is resolved" },
  ];

  const features = [
    { title: "Easy Reporting", description: "File crime reports quickly with evidence upload support" },
    { title: "Real-time Updates", description: "Track your case status and receive notifications" },
    { title: "Location Tracking", description: "Auto-detect location or manually mark crime locations" },
    { title: "Direct Communication", description: "Chat directly with police officers handling your case" },
    { title: "Secure & Private", description: "Your data is encrypted and protected" },
    { title: "Province-based Access", description: "View cases relevant to your province" },
  ];

  return (
    <div className="min-h-screen">
      <div 
        className="relative h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative h-full mx-auto px-4 flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="/images/logo.png" 
                alt="SmartReport Logo" 
                className="h-60 w-60 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              SmartReport - Nepal's Crime Reporting System
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90">
              Report crimes online, track case status, and communicate with police officers securely
            </p>
            {user ? (
              <Button
                onClick={() => navigate("/report")}
                className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
                size="lg"
              >
                Report Crime
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
                size="lg"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-green-900 mb-2">{stat.number}</div>
                <div className="text-lg font-medium text-gray-700">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Simple steps to report and track crimes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => (
              <Card key={step.step} className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-green-900 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose SmartReport?</h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          A comprehensive platform designed to make crime reporting efficient and transparent
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-full bg-green-900 mr-4"></div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div 
        className="relative py-20"
        style={{ backgroundImage: "url('/images/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Make a Difference?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            Join thousands of citizens helping make Nepal safer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button
                onClick={() => navigate("/report")}
                className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
                size="lg"
              >
                Report Crime
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-white text-green-900 hover:bg-green-50 px-10 py-6 text-lg font-semibold cursor-pointer"
                  size="lg"
                >
                  Register Now
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold cursor-pointer"
                  size="lg"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;