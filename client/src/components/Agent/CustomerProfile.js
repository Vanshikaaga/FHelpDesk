import React from 'react';
import './CustomerProfile.css';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = ({ customer,customerId }) => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
  console.log("Clicked Profile Button");
  console.log("Customer ID:", customer?.id);
  if (customerId) {
      // Open Facebook profile in a new tab
      window.open(`https://facebook.com/${customerId}`, '_blank');
    } else {
      console.warn('Customer ID not provided');
    }
  };



  if (!customer) {
    return (
      <div className="profile-panel empty">
        <p>Select a conversation to view customer details.</p>
      </div>
    );
  }


  console.log(customer)
  const fullName = customer.name || 'N/A';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || 'N/A';
  const lastName = nameParts.slice(1).join(' ') || 'N/A';

  return (
    <div className="profile-panel">
      <div className="profile-photo-wrapper">
        <img
          src={customer.picture || '/default-avatar.png'}
          alt="Customer"
          className="profile-photo"
        />
      </div>
      <h3 className="profile-name">{fullName}</h3>
      <p className="profile-status">● Offline</p>

      <div className="profile-buttons">
        <button className="profile-btn">📞 Call</button>
        <button className="profile-btn" onClick={handleProfileClick}>
  👤 Profile
</button>

      </div>

      <div className="profile-card">
        <div className="profile-info-row">
          <strong>Email</strong>
          <span>{customer.email || 'Not available'}</span>
        </div>
        <div className="profile-info-row">
          <strong>First Name</strong>
          <span>{firstName}</span>
        </div>
        <div className="profile-info-row">
          <strong>Last Name</strong>
          <span>{lastName}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
