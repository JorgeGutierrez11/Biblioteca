import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Importa el proveedor del contexto
import BarNav from './components/BarNav';
import Reservations from './components/Reservations';
// import Show from './components/Show';
import FormPQR from './components/FormPQR';
import FormSdC from './components/FormSdC';
import Login from './components/Login';
import BooksList from './components/BooksList.jsx';
import FormPago from './components/FormPago.jsx';

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <BarNav />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/show" element={<BooksList />} />
        <Route path="/prestamos" element={<Reservations />} />
        <Route path="/multas" element={<FormPago />} />
        <Route path="/solicitudes" element={<FormSdC />} />
        <Route path="/pqr" element={<FormPQR />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
