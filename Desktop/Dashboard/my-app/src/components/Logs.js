import React from 'react';

const Logs = ({ otherMachineStatus }) => {
  return (
    <div className="logs-container">
      <div className="other-machine-status">
      <h2>Logs</h2>
      <ul>
        {Object.entries(otherMachineStatus).map(([machineId, status]) => (
          <li key={machineId}>
            Machine {machineId}: <span className="status-indicator" style={{ backgroundColor: status.state === 'online' ? 'green' : 'red' }} /> {status.state} (Last Changed: {status.last_changed})
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default Logs;
