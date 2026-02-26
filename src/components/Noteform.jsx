import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { NoteContext } from "../context/NoteContext";

function Noteform() {
  const { createNote } = useContext(NoteContext);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [backendError, setBackendError] = useState("");

  const onSubmit = async (data) => {
    setBackendError("");

    const result = await createNote(data);

    if (!result.success) {
      // Map backend Zod errors into React Hook Form
      result.errors?.forEach((err) => {
        if (err.path) {
          setError(err.path[0], {
            type: "server",
            message: err.message,
          });
        } else {
          setBackendError(err.message);
        }
      });
      return;
    }

    reset(); // Clear form on success
  };

  return (
    <div className="max-w-xl mx-auto mt-20 bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
        Create a New Note
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Enter title..."
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            {...register("title", {
              required: "Title is required",
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
        <textarea
  placeholder="Write your note here..."
  rows="5"
  className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
  {...register("content", {
    required: "Content is required",
  })}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();          // stop new line
      handleSubmit(onSubmit)();   // manually trigger submit
    }
  }}
/>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Backend General Error */}
        {backendError && (
          <p className="text-red-500 text-sm text-center">
            {backendError}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg shadow-md disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Note"}
        </button>
      </form>
    </div>
  );
}

export default Noteform;
