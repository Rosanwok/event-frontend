import React, { useState } from 'react';
import logo from './assets/logo.png';

const EventRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', gender: '', matricNo: '', department: '',
  });
  const [receipt, setReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => setReceipt(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (!receipt) {
      setErrorMessage('Please attach your payment receipt.');
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('gender', formData.gender);
    submitData.append('matricNo', formData.matricNo);
    submitData.append('department', formData.department);
    submitData.append('receipt', receipt);

    try {
      const response = await fetch('https://event-backend-eyqg.onrender.com/api/register', {
        method: 'POST',
        body: submitData, 
      });

      if (!response.ok) throw new Error('Registration failed. Please try again.');

      const data = await response.json();
      setQrCodeUrl(data.qrCodeUrl); 
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (qrCodeUrl) {
    return (
      <div style={styles.pageBackground}>
        <div style={styles.container}>
          <h2 style={{ color: '#28a745', textAlign: 'center' }}>Registration Successful! 🎉</h2>
          <p style={styles.text}>Please save this QR code. You will need to present it at the event.</p>
          <img src={qrCodeUrl} alt="Your Event Ticket QR Code" style={styles.qrImage} />
          <div style={{ textAlign: 'center' }}>
            <a href={qrCodeUrl} download="Event_Ticket_QR.png" style={styles.button}>
              Download Ticket
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.header}>
          
          <img src={logo} alt="HUST Logo" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
         
          <h1 style={styles.mainHeading}>HUST FRESHERMEN PARTY 2026</h1>
          <p style={styles.subHeading}>Participant Registration Portal</p>
        </div>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required style={styles.input}/>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={styles.input}/>
            </div>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required style={styles.input}/>
            </div>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required style={styles.input}>
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Matric. No</label>
              <input type="text" name="matricNo" value={formData.matricNo} onChange={handleInputChange} required style={styles.input}/>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleInputChange} required style={styles.input}/>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Payment Receipt (Image/PDF)</label>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required style={styles.fileInput}/>
          </div>

          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Processing...' : 'Register & Get Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageBackground: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' },
  container: { width: '100%', maxWidth: '550px', backgroundColor: '#5c0303', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
  header: { textAlign: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px' },
  logo: { maxWidth: '150px', marginBottom: '10px', borderRadius: '4px' },
  mainHeading: { margin: '0 0 5px 0', color: '#ebe3e3', fontSize: '24px' },
  subHeading: { margin: '0', color: '#eee9e9', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '16px', fontWeight: '600', color: '#06b632' },
  input: { padding: '10px', fontSize: '15px', borderRadius: '6px', border: '1px solid #dcdcdc', backgroundColor: '#fafafa', outline: 'none' },
  fileInput: { padding: '8px', fontSize: '14px', borderRadius: '6px', border: '1px dashed #aaa', backgroundColor: '#fafafa', cursor: 'pointer' },
  button: { padding: '12px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#082b03', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', marginTop: '10px' },
  error: { color: '#d9534f', fontSize: '14px', marginBottom: '15px', backgroundColor: '#fdf7f7', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #d9534f' },
  text: { textAlign: 'center', color: '#555' },
  qrImage: { width: '220px', height: '220px', margin: '20px auto', display: 'block', border: '10px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
};

export default EventRegistration;