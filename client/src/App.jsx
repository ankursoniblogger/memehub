import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import UploadMemePage from "./pages/UploadMemePage";
import ProtectedRoute from './components/ProtectedRoute';
import CreateMemePage from './pages/CreateMemePage';


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
