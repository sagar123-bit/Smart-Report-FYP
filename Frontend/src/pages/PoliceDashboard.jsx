import PoliceSideBar from '@/components/PoliceSideBar'
import React from 'react'
import { Outlet } from 'react-router'

const PoliceDashboard = () => {
  return (
    <div className='flex min-h-screen'>
      <PoliceSideBar/>
      <div className='flex-1 lg:ml-2 overflow-y-auto  overflow-x-hidden'>
        <Outlet/>
      </div>
    </div>
  )
}

export default PoliceDashboard
