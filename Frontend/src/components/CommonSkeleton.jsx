import { Skeleton } from "@/components/ui/skeleton";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 z-50 flex flex-col items-center justify-center">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <img 
          src="/images/logo.png" 
          alt="SmartReport Logo" 
          className="relative h-32 w-32 object-contain animate-bounce"
        />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
        SmartReport
      </h1>
      
      <div className="w-full max-w-xs space-y-3">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-5/6 rounded-full mx-auto" />
        <Skeleton className="h-3 w-4/6 rounded-full mx-auto" />
      </div>
      
      <div className="mt-10 flex items-center space-x-2">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;