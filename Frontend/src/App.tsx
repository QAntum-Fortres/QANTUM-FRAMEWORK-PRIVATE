import { useEffect, useState } from 'react';
import { NativeWebSocket } from './core/socket/NativeWebSocket';
import { SovereignHUD } from './components/SovereignHUD';
import { HeliosMaster } from './pages/HeliosMaster';

// Initialize Neural Link
// new NativeWebSocket();

function App() {
  const [view, setView] = useState<'helios' | 'hud'>('helios');

  useEffect(() => {
    // Initialize Neural Link (Singleton)
    NativeWebSocket.getInstance();
  }, []);

  return (
    <>
      {view === 'helios' ? (
        <div onDoubleClick={() => setView('hud')}>
          <HeliosMaster />
        </div>
      ) : (
        <div onDoubleClick={() => setView('helios')}>
          <SovereignHUD />
        </div>
      )}
    </>
  );
}

export default App;
