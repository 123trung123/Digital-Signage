// DashboardPage.js

import React, { useState, useEffect } from 'react';
import { getDatabase, ref as dbRef, onValue, off } from 'firebase/database';

function DashboardPage() {
  const [logs, setLogs] = useState([]);
  const [userStatus, setUserStatus] = useState({});
  
  useEffect(() => {
    const database = getDatabase();
    const logsRef = dbRef(database, '/logs');
    const userStatusRef = dbRef(database, '/status');

    const fetchLogs = () => {
      onValue(logsRef, (snapshot) => {
        setLogs(snapshot.val() || []);
      });
    };

    const fetchUserStatus = () => {
      onValue(userStatusRef, (snapshot) => {
        setUserStatus(snapshot.val() || {});
      });
    };

    fetchLogs();
    fetchUserStatus();

    return () => {
      // Unsubscribe from Firebase listeners when component unmounts
      // This prevents memory leaks and unexpected behavior
      off(logsRef);
      off(userStatusRef);
    };
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}

export default DashboardPage;
