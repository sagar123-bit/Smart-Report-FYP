import CitizenFooter from "@/components/CitizenFooter";
import CitizenNavbar from "@/components/CitizenNavbar";
import LoadingScreen from "@/components/CommonSkeleton";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";


const MainHome = () => {
  const userState = useSelector(state=>state?.user);
  const {user:userData,loading}=userState||{};
  if(loading && !userData){
    return <LoadingScreen/>
  }
  return (
    <div>
    <CitizenNavbar/>
      <Outlet/>
      <CitizenFooter/>
    </div>
  )
}

export default MainHome
