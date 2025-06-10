import React, { useState, useEffect } from 'react';
import './Advertisements.css';
import { Sidebar } from '../components/layout/Sidebar';
import axios from 'axios';
import Navbar from "../components/Navbarreview";


export const Advertisements: React.FC = () => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get('http://localhost:8187/api/advertisements');
      const fetchedAds = response.data.map((ad: any) => ({
        id: ad.advertisementId, // Map id to id
        advertisementId: ad.advertisementId, // Map advertisementId to advertisementId
        user: ad.ownerName,
        advertisement: `${ad.carMake} ${ad.carModel}`,
      }));
      console.log('Fetched advertisements:', fetchedAds); // Log the fetched advertisements
      setAdvertisements(fetchedAds);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const handleDelete = async (advertisementId: number) => {
    try {
      await axios.delete(`http://localhost:8187/api/advertisements/${advertisementId}`);
      setAdvertisements(advertisements.filter(ad => ad.advertisementId !== advertisementId));
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null); // إلغاء الحذف
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId !== null) {
      handleDelete(confirmDeleteId).then(() => {
        window.location.reload(); // Refresh the page after confirming delete
      });
      setConfirmDeleteId(null); // Reset the confirm delete ID
    }
  };

  return (
    <div className="page-layout">
      <Sidebar></Sidebar>

      {/* محتوى الصفحة */}
      <div className="main-wrapper">
        <h1 className="page-heading">Advertisements</h1>

        <div className="ad-list-wrapper">
          <h2 className="list-heading">Advertisements List</h2>
          <table className="ad-table">
            <thead>
              <tr>
                <th className="table-header">Advertisement ID</th>
                <th className="table-header">User</th>
                <th className="table-header">Advertisement</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {advertisements.map((ad) => (
                <tr key={ad.advertisementId}> {/* Ensure each item has a unique key based on its advertisementId */}
                  <td className="table-cell">{ad.advertisementId}</td> {/* Display the id */}
                  <td className="table-cell">{ad.user}</td>
                  <td className="table-cell">{ad.advertisement}</td>
                  <td className="table-cell actions-wrapper">
                    <button onClick={() => setConfirmDeleteId(ad.id)} className="delete-action">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* نافذة تأكيد الحذف */}
        {confirmDeleteId !== null && (
          <div className="overlay-wrapper">
            <div className="modal-wrapper">
              <h2 className="modal-heading">Are you sure you want to delete this advertisement?</h2>
              <div className="modal-actions-wrapper">
                <button 
                  onClick={handleCancelDelete} 
                  className="cancel-action"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete} 
                  className="confirm-action"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
