import React from 'react';
import '../../components/Style/Logs.css';
const SystemLogs = ({ otherMachineStatus }) => {
  return (
    <div className="logs-container">
      <h2>System Logs</h2>
      <ul className='logs-box'>
        {Object.entries(otherMachineStatus).map(([uid, status]) => (
          <li key={uid}>
            {uid}: {status.state} (Last changed: {status.last_changed})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemLogs;
