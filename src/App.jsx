import React, { useState } from 'react';
// Import our two main pages
import EventRegistration from './EventRegistration'; // Ensure your registration file is named EventRegistration.jsx
import AdminPanel from './AdminPanel';               // Ensure your admin file is named AdminPanel.jsx

export default function App() {
  // This state acts as our toggle. It starts on 'registration' by default.
  const [view, setView] = useState('registration'); 

  return (
    <div>
      {/* The Navigation Bar with our Toggle Buttons */}
      <nav style={styles.navBar}>
        <button 
          onClick={() => setView('registration')} 
          style={view === 'registration' ? styles.activeButton : styles.button}
        >
          User Registration
        </button>
        <button 
          onClick={() => setView('admin')} 
          style={view === 'admin' ? styles.activeButton : styles.button}
        >
          Admin Dashboard
        </button>
      </nav>

      {/* The actual toggle logic: If view is 'registration', show the form. Otherwise, show the Admin Panel. */}
      {view === 'registration' ? <EventRegistration /> : <AdminPanel />}
    </div>
  );
}

// Simple styles for the navigation bar
const styles = {
  navBar: { padding: '15px', backgroundColor: '#333', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  button: { margin: '0 10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' },
  activeButton: { margin: '0 10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }
};