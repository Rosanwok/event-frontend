import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import logo from './assets/logo.png';

const AdminPanel = () => {
    // --- Authentication State ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    // --- Dashboard State ---
    const [participants, setParticipants] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    // Fetch participants ONLY if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchParticipants();
        }
    }, [isAuthenticated]);

    const fetchParticipants = async () => {
        try {
            const response = await fetch('https://event-backend-eyqg.onrender.com/api/admin/participants');
            const data = await response.json();
            setParticipants(data);
        } catch (error) {
            console.error('Failed to fetch participants:', error);
        }
    };

    // --- Login Handler ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await fetch('https://event-backend-eyqg.onrender.com/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
            } else {
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('Server error. Please try again.');
        }
    };

    // --- QR Scanner Handler ---
    useEffect(() => {
        if (isScanning && isAuthenticated) {
            const scanner = new Html5QrcodeScanner('reader', { 
                qrbox: { width: 250, height: 250 }, 
                fps: 5 
            });

            scanner.render(onScanSuccess, onScanFailure);

            async function onScanSuccess(decodedText) {
                scanner.clear();
                setIsScanning(false);
                
                try {
                    const response = await fetch('https://event-backend-eyqg.onrender.com/api/admin/validate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ticketId: decodedText })
                    });
                    const result = await response.json();
                    
                    setScanResult(result);
                    fetchParticipants(); 
                } catch (error) {
                    setScanResult({ success: false, message: 'Network error during validation.' });
                }
            }

            function onScanFailure(error) { /* Ignore background errors */ }

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            };
        }
    }, [isScanning, isAuthenticated]);

    // ==========================================
    // RENDER: Login Screen
    // ==========================================
    if (!isAuthenticated) {
        return (
            <div style={styles.loginContainer}>
                          <img src={logo} alt="HUST Logo" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                
                <div style={styles.loginBox}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Login</h2>
                    {loginError && <p style={styles.error}>{loginError}</p>}
                    
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={styles.label}>Username</label>
                            <input 
                                type="text" 
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                required 
                                style={styles.input}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Password</label>
                            <input 
                                type="password" 
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required 
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.button}>Secure Login</button>
                    </form>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER: Admin Dashboard (Protected)
    // ==========================================
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Admin Control Center</h2>
                <button onClick={() => setIsAuthenticated(false)} style={{...styles.button, backgroundColor: '#d9534f', padding: '8px 12px'}}>Logout</button>
                    <img src={logo} alt="HUST Logo" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
          
            </div>
            
            {/* Scanner Controls */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3>Entry Validation</h3>
                {!isScanning && (
                    <button onClick={() => { setIsScanning(true); setScanResult(null); }} style={styles.button}>
                        📷 Open QR Scanner
                    </button>
                )}

                {isScanning && <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: '15px 0' }}></div>}

                {scanResult && (
                    <div style={{ 
                        marginTop: '15px', padding: '15px', borderRadius: '5px',
                        backgroundColor: scanResult.success ? '#d4edda' : '#f8d7da',
                        color: scanResult.success ? '#155724' : '#721c24',
                        border: `1px solid ${scanResult.success ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>{scanResult.message}</h4>
                        {scanResult.participant && (
                            <p style={{ margin: 0 }}><strong>Attendee:</strong> {scanResult.participant.fullName} | {scanResult.participant.matricNo}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Participants Table */}
            <h3>Registered Participants ({participants.length})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Matric No</th>
                            <th style={styles.th}>Dept</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(p => (
                            <tr key={p.id}>
                                <td style={styles.td}>{p.fullName}</td>
                                <td style={styles.td}>{p.matricNo}</td>
                                <td style={styles.td}>{p.department}</td>
                                <td style={styles.td}>
                                    {p.isValidated 
                                        ? <span style={{color: 'green', fontWeight: 'bold'}}>✅ Validated at {p.scannedAt}</span> 
                                        : <span style={{color: '#d9534f'}}>Pending</span>}
                                </td>
                            </tr>
                        ))}
                        {participants.length === 0 && (
                            <tr><td colSpan="4" style={{...styles.td, textAlign: 'center'}}>No participants registered yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
    loginBox: { width: '100%', maxWidth: '350px', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #ddd' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' },
    input: { width: '100%', padding: '10px', fontSize: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { padding: '12px 15px', fontSize: '16px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' },
    error: { color: '#d9534f', fontSize: '14px', marginBottom: '15px', backgroundColor: '#fdf7f7', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #d9534f' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { padding: '12px', border: '1px solid #ddd', textAlign: 'left' },
    td: { padding: '10px', border: '1px solid #ddd' }
};

export default AdminPanel;