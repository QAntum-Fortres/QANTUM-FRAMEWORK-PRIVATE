import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NativeWebSocket } from './core/socket/NativeWebSocket';
import { SovereignHUD } from './components/SovereignHUD';
import { HeliosMaster } from './pages/HeliosMaster';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PricingCards } from './components/PricingCards/PricingCards';

// Initialize Neural Link
// new NativeWebSocket();

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    // Initialize Neural Link (Singleton)
    NativeWebSocket.getInstance();
  }, []);

  return (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <HeliosMaster />
                    </PrivateRoute>
                }
            />
            <Route
                path="/hud"
                element={
                    <PrivateRoute>
                        <SovereignHUD />
                    </PrivateRoute>
                }
            />
            <Route
                path="/pricing"
                element={
                    <PrivateRoute>
                         <div className="min-h-screen bg-[#020205] p-8">
                            <PricingCards />
                         </div>
                    </PrivateRoute>
                }
            />
        </Routes>
    </Router>
  );
}

export default App;
