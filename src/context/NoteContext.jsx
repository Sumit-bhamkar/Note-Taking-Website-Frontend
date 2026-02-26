// import { createContext, useEffect, useState } from "react";
// import BACKEND_URL from "../api/url";
// import { useContext } from "react";
// import { AuthContext } from "./AuthContext";

// export const NoteContext = createContext();

// export const NoteProvider = ({ children }) => {
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD

//   /* =========================
//      GET ALL NOTES
//   ========================= */
//   const getNotes = async () => {
//     setLoading(true);
//     try {
//       const response = await BACKEND_URL.get("/get-notes");
//       setNotes(response.data);
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const { token } = useContext(AuthContext);

//   useEffect(() => {
//     if (token) getNotes();
//     else {
//       setNotes([]);
//       setLoading(false);
//     }
//   }, [token]);

//   /* =========================
//      CREATE NOTE
//   ========================= */
//   const createNote = async (note) => {
//     try {
//       const res = await BACKEND_URL.post("/create-note", note);
//       setNotes((prev) => [res.data, ...prev]);
//       return { success: true };
//     } catch (error) {
//       if (error.response?.status === 400) {
//         return {
//           success: false,
//           errors: error.response.data.errors,
//         };
//       }

//       return {
//         success: false,
//         errors: [{ message: "Something went wrong" }],
//       };
//     }
//   };

//   /* =========================
//      UPDATE NOTE
//   ========================= */
//   const updateNote = async (id, updatedData) => {
//     try {
//       const res = await BACKEND_URL.put(`/update-note/${id}`, updatedData);
//       setNotes((prev) =>
//         prev.map((note) => (note.id === id ? res.data : note))
//       );
//       return { success: true };
//     } catch (error) {
//       if (error.response?.status === 400) {
//         return {
//           success: false,
//           errors: error.response.data.errors,
//         };
//       }

//       return {
//         success: false,
//         errors: [{ message: "Something went wrong" }],
//       };
//     }
//   };

//   /* =========================
//      DELETE NOTE
//   ========================= */
//   const deleteNote = async (id) => {
//     try {
//       await BACKEND_URL.delete(`/delete-note/${id}`);
//       setNotes((prev) => prev.filter((note) => note.id !== id));
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   /* =========================
//      TOGGLE FAVORITE
//   ========================= */
//   const toggleFavorite = async (id) => {
//     try {
//       const res = await BACKEND_URL.put(`/toggle-favorite/${id}`);
//       setNotes((prev) =>
//         prev.map((note) => (note.id === id ? res.data : note))
//       );
//     } catch (error) {
//       console.error("Favorite error:", error);
//     }
//   };

//   /* =========================
//      FILTER AND SEARCH
//   ========================= */
//   const getFilteredNotes = () => {
//     let filtered = [...notes];

//     // Search by title
//     if (searchTerm.trim()) {
//       filtered = filtered.filter((note) =>
//         note.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by date
//     if (filterDate) {
//       filtered = filtered.filter((note) => {
//         const noteDate = new Date(note.createdAt).toISOString().split("T")[0];
//         return noteDate === filterDate;
//       });
//     }

//     // Sort: favorites first, then by creation date
//     return filtered.sort((a, b) => {
//       if (a.favorite !== b.favorite) {
//         return b.favorite ? 1 : -1;
//       }
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
//   };

//   return (
//     <NoteContext.Provider
//       value={{
//         notes: getFilteredNotes(),
//         allNotes: notes,
//         loading,
//         searchTerm,
//         setSearchTerm,
//         filterDate,
//         setFilterDate,
//         createNote,
//         updateNote,
//         deleteNote,
//         toggleFavorite,
//       }}
//     >
//       {children}
//     </NoteContext.Provider>
//   );
// };

import { createContext, useContext, useState } from "react";
import BACKEND_URL from "../api/url";
import { AuthContext } from "./AuthContext";
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  /* =========================
     GET ALL NOTES
  ========================= */

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await BACKEND_URL.get("/get-notes");
      return response.data;
    },
    enabled: !!token, // only fetch when logged in
  });

  /* =========================
     CREATE NOTE
  ========================= */

  const createMutation = useMutation({
    mutationFn: async (note) => {
      const res = await BACKEND_URL.post("/create-note", note);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  const createNote = async (note) => {
    try {
      await createMutation.mutateAsync(note);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || [
          { message: "Something went wrong" },
        ],
      };
    }
  };

  /* =========================
     UPDATE NOTE
  ========================= */

  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await BACKEND_URL.put(`/update-note/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  const updateNote = async (id, updatedData) => {
    try {
      await updateMutation.mutateAsync({ id, updatedData });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || [
          { message: "Something went wrong" },
        ],
      };
    }
  };

  /* =========================
     DELETE NOTE
  ========================= */

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await BACKEND_URL.delete(`/delete-note/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  const deleteNote = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     TOGGLE FAVORITE
  ========================= */

  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await BACKEND_URL.put(`/toggle-favorite/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
    },
  });

  const toggleFavorite = async (id) => {
    try {
      await toggleMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     FILTER AND SEARCH (UNCHANGED)
  ========================= */

  const getFilteredNotes = () => {
    let filtered = [...notes];

    if (searchTerm.trim()) {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.createdAt)
          .toISOString()
          .split("T")[0];
        return noteDate === filterDate;
      });
    }

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
        loading: isLoading,
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