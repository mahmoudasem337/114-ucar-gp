import React, { useEffect, useState } from 'react';
import './profile.css'; // Import CSS file

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear email and password fields
    setEmail('');
    setPassword('');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-email">{email}</p>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Enter your name" value={''} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" value={''} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" placeholder="Enter your phone number" value={''} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" value={''} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" className="save-button">Save Changes</button>
        {/* <button type="button" className="view-ads-button">View Your Advertisements</button> */}
      </form>
    </div>
  );
}

export default App;