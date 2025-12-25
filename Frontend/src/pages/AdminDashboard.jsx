import AdminSidebar from '@/components/AdminSideBar'
import React from 'react'
import { Outlet } from 'react-router'

const AdminDashboard = () => {
  return (
    <div className='flex min-h-screen'>
      <AdminSidebar/>
      <div className='flex-1 lg:ml-2 overflow-y-auto  overflow-x-hidden'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard
