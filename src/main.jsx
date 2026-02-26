import { BrowserRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NoteProvider } from "./context/NoteContext.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <NoteProvider>
               <App />
            </NoteProvider>
         </AuthProvider>
      </QueryClientProvider>
   </BrowserRouter>
);