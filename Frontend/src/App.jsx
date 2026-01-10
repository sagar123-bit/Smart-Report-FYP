
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { fetchAuthUser } from './store/slices/userSlice'

const App = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state=>state?.user);

  useEffect(()=>{
       const fetchData=async()=>{
        if(!userData?.user){
          await dispatch(fetchAuthUser());
        }
       }
       fetchData();
  },[]);

  return (
    <div>
      <ToastContainer position="top-right"/>
     <Outlet/>
    </div>
  )
}

export default App
