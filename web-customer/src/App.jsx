import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

export default function App() {
  const [form, setForm] = useState({
    customer_name: '',
    location: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(`${API_BASE_URL}/requests`, form);
      setSuccess(true);
      setForm({ customer_name: '', location: '', note: '' });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: '#0f172a', border: '1px solid #334155',
    borderRadius: '8px', color: '#f1f5f9', fontSize: '15px',
    boxSizing: 'border-box', outline: 'none',
  };

  const labelStyle = {
    display: 'block', color: '#cbd5e1',
    fontSize: '14px', marginBottom: '6px', fontWeight: '500',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#1e293b', borderRadius: '16px',
        padding: '40px', width: '100%', maxWidth: '480px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '52px' }}>🚗</div>
          <h1 style={{ color: '#f8fafc', fontSize: '26px', fontWeight: '800', margin: '8px 0 4px' }}>
            Tareeqk
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Car Recovery & Towing Services</p>
        </div>

        {/* Success */}
        {success && (
          <div style={{
            background: '#064e3b', border: '1px solid #059669',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
            color: '#6ee7b7', fontSize: '14px'
          }}>
            ✅ <strong>Request submitted!</strong> A driver will reach you shortly.
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#450a0a', border: '1px solid #dc2626',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
            color: '#fca5a5', fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Your Name *</label>
            <input
              type="text" name="customer_name"
              value={form.customer_name} onChange={handleChange}
              placeholder="Ahmed Al-Rashidi" required style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Your Location *</label>
            <input
              type="text" name="location"
              value={form.location} onChange={handleChange}
              placeholder="King Fahd Road, Riyadh" required style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Note (optional)</label>
            <textarea
              name="note" value={form.note} onChange={handleChange}
              placeholder="Describe your issue..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#475569' : 'linear-gradient(135deg, #f97316, #ef4444)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '16px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? '⏳ Submitting...' : '🚨 Request Towing Now'}
          </button>
        </form>
      </div>
    </div>
  );
}