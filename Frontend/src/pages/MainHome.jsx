import CitizenFooter from "@/components/CitizenFooter";
import CitizenNavbar from "@/components/CitizenNavbar";
import { Outlet } from "react-router";


const MainHome = () => {
  return (
    <div>
    <CitizenNavbar/>
      <Outlet/>
      <CitizenFooter/>
    </div>
  )
}

export default MainHome
