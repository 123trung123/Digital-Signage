import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getFirestore, where } from 'firebase/firestore';
import './Style/Home.css';

const firestore = getFirestore();

const AdminHome = ({ otherMachineStatus }) => {
  const [machineIds, setMachineIds] = useState([]);
  const [machineIsOpen, setMachineIsOpen] = useState({});

  const toggleMachineBox = (machineId) => {
    setMachineIsOpen({ ...machineIsOpen, [machineId]: !machineIsOpen[machineId] });
  };

  useEffect(() => {
    const fetchAdminIds = async () => {
      try {
        const accountsRef = collection(firestore, 'accounts');
        const q = query(accountsRef, where('type', '==', 'ADMIN'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const uniqueMachineIds = new Set();
          querySnapshot.forEach(doc => uniqueMachineIds.add(doc.data().uid));
          setMachineIds(Array.from(uniqueMachineIds));
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching admin IDs:', error);
      }
    };

    fetchAdminIds();
  }, []);

  return (
    <div className="home-container">
      <h2>Admin Dashboard</h2>
      <ul>
        {machineIds.map(machineId => (
          <li key={machineId}>
            Admin: {machineId}: <span className="status-indicator" style={{ backgroundColor: otherMachineStatus[machineId]?.state === 'online' ? 'green' : 'red' }} /> {otherMachineStatus[machineId]?.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHome;
