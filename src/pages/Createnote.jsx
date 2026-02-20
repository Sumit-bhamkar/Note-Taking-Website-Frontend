import React, { useContext } from 'react'
import Noteform from '../components/Noteform'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Createnote() {
  const { token } = useContext(AuthContext)

  if (!token) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900'>
        <div className='bg-gray-800 rounded-lg p-8 text-center'>
          <h2 className='text-2xl font-semibold text-blue-300 mb-4'>Login Required</h2>
          <p className='text-gray-300 mb-6'>You must be logged in to create notes.</p>
          <Link to="/login" className='bg-blue-600 px-6 py-2 rounded text-white hover:bg-blue-700'>
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-900'><Noteform/></div>
  )
}

export default Createnote