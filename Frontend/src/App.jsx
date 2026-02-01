import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { fetchAuthUser } from './store/slices/userSlice'
import { fetchAllUsers } from './store/slices/getAllUsers'
import { fetchAllCrimeReports } from './store/slices/getAllReports'
import LoadingScreen from './components/CommonSkeleton'

const App = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(state=>state?.allUsers);
  const allReportsState = useSelector(state=>state?.allReports);
  const {reports: allReports = [], loading: allReportsLoading} = allReportsState || {};
   const userState = useSelector(state=>state?.user);
  const {user:userData,loading}=userState||{};
  
  useEffect(()=>{
       const fetchData=async()=>{
        if(!userData){
          await dispatch(fetchAuthUser());
        }
        if(allUsers?.users?.length===0)
        {
          await dispatch(fetchAllUsers());
        }
        if(allReports?.length===0){
          await dispatch(fetchAllCrimeReports());
        }
      }
      fetchData();
    },[]);
    
    if((loading  && !userData) || (allReportsLoading && allReports?.length===0)){
      return <LoadingScreen/>
    }
  return (
    <div>
      <ToastContainer position="top-right"/>
     <Outlet/>
    </div>
  )
}

export default App
