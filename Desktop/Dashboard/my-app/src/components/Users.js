import React from 'react';

const Users = ({ isOnline, otherMachineStatus }) => {
  return (
    <div>
      <p>User Status: {isOnline ? 'Online' : 'Offline'}</p>
      <p>Other Machines:</p>
      <ul>
        {Object.keys(otherMachineStatus).map((machineId) => (
          <li key={machineId}>
            {machineId}: {otherMachineStatus[machineId].state} (Last Changed: {otherMachineStatus[machineId].last_changed})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;