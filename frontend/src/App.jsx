import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import AddProperty from './pages/AddProperty';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-center" element={<AdminDashboard />} />
          <Route path="/chat" element={<ChatRoom />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
