import { createContext, useEffect, useState } from "react";
import BACKEND_URL from "../api/url";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD

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

  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) getNotes();
    else {
      setNotes([]);
      setLoading(false);
    }
  }, [token]);

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

  /* =========================
     TOGGLE FAVORITE
  ========================= */
  const toggleFavorite = async (id) => {
    try {
      const res = await BACKEND_URL.put(`/toggle-favorite/${id}`);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? res.data : note))
      );
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  /* =========================
     FILTER AND SEARCH
  ========================= */
  const getFilteredNotes = () => {
    let filtered = [...notes];

    // Search by title
    if (searchTerm.trim()) {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.createdAt).toISOString().split("T")[0];
        return noteDate === filterDate;
      });
    }

    // Sort: favorites first, then by creation date
    return filtered.sort((a, b) => {
      if (a.favorite !== b.favorite) {
        return b.favorite ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  return (
    <NoteContext.Provider
      value={{
        notes: getFilteredNotes(),
        allNotes: notes,
        loading,
        searchTerm,
        setSearchTerm,
        filterDate,
        setFilterDate,
        createNote,
        updateNote,
        deleteNote,
        toggleFavorite,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
