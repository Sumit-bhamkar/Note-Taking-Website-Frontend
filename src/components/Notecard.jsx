import React, { useContext, useState } from 'react'
import { NoteContext } from '../context/NoteContext'
import { Star } from 'lucide-react'

function Notecard({note}) {
    const {deleteNote, updateNote, toggleFavorite}=useContext(NoteContext)
    const [isEditing,setIsEditing]=useState(false)
    const [editData,setEditData]=useState({
        title:note.title,
        content:note.content
    })

    const handleUpdate=()=>{
      updateNote(note.id,editData)
      setIsEditing(false)
    }
  return (
     <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col relative">
      {/* Favorite Star Icon */}
      <button 
        onClick={() => toggleFavorite(note.id)}
        className="absolute top-3 right-3 hover:scale-110 transition"
        aria-label={note.favorite ? "Unmark favorite" : "Mark favorite"}
      >
        <Star
          size={24}
          style={{ fill: note.favorite ? 'currentColor' : 'none' }}
          className={note.favorite ? 'text-yellow-400' : 'text-gray-400'}
        />
      </button>
      
      {isEditing ? (
        <>
          {/* Edit Mode */}
          <input
            type="text"
            className="border rounded-lg p-2 w-full mb-3 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <textarea
            className="border rounded-lg p-2 w-full mb-3 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-white"
            rows="3"
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* View Mode */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white pr-8">
            {note.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 flex-1">
            {note.content}
          </p>

          {/* Footer: date + actions */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              {new Date(note.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Notecard