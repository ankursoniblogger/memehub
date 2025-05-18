import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Navbar from './components/Navbar.jsx';
import UploadMemePage from "./pages/UploadMemePage.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CreateMemePage from './pages/CreateMemePage.jsx';


function App() {
  return (
    <div className="container">
     <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/upload" element={<UploadMemePage />} />
        <Route path="/create" element={<ProtectedRoute><CreateMemePage /> </ProtectedRoute>}/>
      </Routes>
    </div>
  );
}

export default App;
