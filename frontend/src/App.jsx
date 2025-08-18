import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";
import { ThemeProvider } from "./context/ThemeContext";
import NoteDetail from "./pages/NoteDetail";


function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-note" element={<AddNote />} />
        <Route path="/edit-note/:id" element={<EditNote />} />
        <Route path="/note/:id" element={<NoteDetail />} />

      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
