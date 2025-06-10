import { useState } from 'react';
import { Header } from '../components/layout/Header';
import './Settings.css'; // ربط ملف الـ CSS

export function Settings() {
  const [name, setName] = useState('Olivia Williams');
  const [email, setEmail] = useState('olivia.williams@example.com');
  const [phone, setPhone] = useState('+1-234-567-8900');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings updated');
    setPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted');
    }
  };

  return (
    <div className="settings-page">
      <Header title="Settings" />

      <div className="settings-container">
        <h2 className="settings-title">Personal Information</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-field">
            <label htmlFor="name" className="settings-label">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="settings-input"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="email" className="settings-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="settings-input"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="phone" className="settings-label">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="settings-input"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="password" className="settings-label">Change Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="settings-input"
            />
          </div>

          <div className="settings-actions">
            <button type="button" className="btn-savee">Save Changes</button>
            <button type="button" onClick={handleDeleteAccount} className="btn-delete">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
