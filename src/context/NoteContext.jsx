import { createContext, useEffect, useState } from "react";
import BACKEND_URL from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET ALL NOTES
  ========================= */
  const getNotes = async () => {
    setLoading(true);
    try {
      const response = await BACKEND_URL.get("/get-notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  /* =========================
     CREATE NOTE
  ========================= */
  const createNote = async (note) => {
    try {
      const res = await BACKEND_URL.post("/create-note", note);
      setNotes((prev) => [res.data, ...prev]);
      return { success: true };
    } catch (error) {
      if (error.response?.status === 400) {
        return {
          success: false,
          errors: error.response.data.errors,
        };
      }

      return {
        success: false,
        errors: [{ message: "Something went wrong" }],
      };
    }
  };

  /* =========================
     UPDATE NOTE
  ========================= */
  const updateNote = async (id, updatedData) => {
    try {
      const res = await BACKEND_URL.put(`/update-note/${id}`, updatedData);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? res.data : note))
      );
      return { success: true };
    } catch (error) {
      if (error.response?.status === 400) {
        return {
          success: false,
          errors: error.response.data.errors,
        };
      }

      return {
        success: false,
        errors: [{ message: "Something went wrong" }],
      };
    }
  };

  /* =========================
     DELETE NOTE
  ========================= */
  const deleteNote = async (id) => {
    try {
      await BACKEND_URL.delete(`/delete-note/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
