import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar';

const Dashboard = () => {
  return (
    <div className="flex z-50 bg-white-50">
        <div className='absolute md:static top-0 left-0 z-50'>

        <Sidebar/>
        </div>

        <div className=" w-full z-0 relative max-sm:left-0">
            <Navbar/>
        </div>
    </div>
  )
}

export default Dashboard;