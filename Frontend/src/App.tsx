import { useEffect } from 'react';
import { NativeWebSocket } from './core/socket/NativeWebSocket';
import { SovereignHUD } from './components/SovereignHUD';

// Initialize Neural Link
// new NativeWebSocket();

function App() {
  useEffect(() => {
    // Initialize Neural Link (Singleton)
    NativeWebSocket.getInstance();
  }, []);

  return (
    <SovereignHUD />
  );
}

export default App;
