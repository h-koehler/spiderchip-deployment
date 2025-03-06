import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Public Route: Blocks access if the user IS authenticated
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game' element={<ProtectedRoute><Game /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
