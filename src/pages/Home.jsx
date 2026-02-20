import React, { useContext } from 'react'
import { NoteContext } from '../context/NoteContext'
import Notecard from '../components/Notecard'
import Loader from '../components/Loader'
import { Search, X } from 'lucide-react'

function Home() {
  const { notes, loading, searchTerm, setSearchTerm, filterDate, setFilterDate } = useContext(NoteContext)

  const handleClearFilters = () => {
    setSearchTerm("")
    setFilterDate("")
  }

  if (loading) {
    return <Loader />
  }

  if (notes.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <p className='text-lg text-gray-400 mb-6'>
          {searchTerm || filterDate ? "No notes match your filters." : "No notes available."}
        </p>
        {(searchTerm || filterDate) && (
          <button
            onClick={handleClearFilters}
            className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white'
          >
            Clear Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className='mb-6 space-y-4'>
        {/* Search Bar */}
        <div className='flex gap-2'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-3 text-gray-400' size={20} />
            <input
              type='text'
              placeholder='Search notes by title...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className='px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300'
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div className='flex gap-2 items-center'>
          <label className='text-gray-300'>Filter by date:</label>
          <input
            type='date'
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className='px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className='px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300'
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filterDate) && (
          <div className='flex gap-2 items-center text-sm text-gray-400'>
            <span>Active filters:</span>
            {searchTerm && <span className='bg-blue-600 px-2 py-1 rounded'>Title: "{searchTerm}"</span>}
            {filterDate && <span className='bg-blue-600 px-2 py-1 rounded'>Date: {filterDate}</span>}
            <button
              onClick={handleClearFilters}
              className='text-blue-400 hover:text-blue-300 underline'
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
        {notes.map((note) => (
          <Notecard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}

export default Home