import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';
import { collection, query, onSnapshot, getFirestore } from 'firebase/firestore';
import '../../components/Style/Home.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const firestore = getFirestore();

const Log = ({ otherMachineStatus }) => {
  const [pictures, setPictures] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [onlineAdmins, setOnlineAdmins] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  useEffect(() => {
    const fetchPicturesMetadata = async () => {
      try {
        const storage = getStorage();
        const imagesRefs = {
          images1: ref(storage, 'images'),
          images2: ref(storage, 'videos')
        };
  
        const pictureMetadata = [];
  
        for (const imagesRefKey in imagesRefs) {
          const imagesRef = imagesRefs[imagesRefKey];
          const imagesList = await listAll(imagesRef);
          const metadataPromises = imagesList.items.map(async (imageRef) => {
            const metadata = await getMetadata(imageRef);
            return {
              name: metadata.name,
              size: metadata.size,
            };
          });
          const metadata = await Promise.all(metadataPromises);
          pictureMetadata.push(...metadata);
        }
  
        const totalSize = pictureMetadata.reduce((acc, picture) => acc + picture.size, 0);
  
        setPictures(pictureMetadata);
        setTotalSize(totalSize);
      } catch (error) {
        console.error('Error fetching pictures metadata:', error);
      }
    };
  
    fetchPicturesMetadata();
  }, []);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsRef = collection(firestore, 'accounts');
        const q = query(accountsRef);
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const accountsData = querySnapshot.docs.map(doc => doc.data());
          setAccounts(accountsData);

          const onlineAdminsCount = accountsData.filter(account => account.type === 'ADMIN' && otherMachineStatus[account.uid]?.state === 'online').length;
          const onlinePlayersCount = accountsData.filter(account => account.type === 'PLAYER' && otherMachineStatus[account.uid]?.state === 'online').length;
          setOnlineAdmins(onlineAdminsCount);
          setOnlinePlayers(onlinePlayersCount);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [otherMachineStatus]);

  const totalPictures = pictures.length;
  const totalAdmins = accounts.filter(account => account.type === 'ADMIN').length;
  const totalPlayers = accounts.filter(account => account.type === 'PLAYER').length;
  const totalAccounts = accounts.length;
  const onlineDevices = onlineAdmins + onlinePlayers;
  const onlinePercentage = (onlineDevices / totalAccounts) * 100;
  const formattedTotalSize = calculateFileSize(totalSize);

  const deviceData = {
    labels: ['Online Devices', 'Offline Devices'],
    datasets: [
      {
        data: [onlineDevices, totalAccounts - onlineDevices],
        backgroundColor: ['#3498db', '#FF6384'],
        hoverBackgroundColor: ['#3498db', '#FF6384'],
      },
    ],
  };

  const adminData = {
    labels: ['Admins Online', 'Admins Offline'],
    datasets: [
      {
        data: [onlineAdmins, totalAdmins - onlineAdmins],
        backgroundColor: ['#3498db', '#FF6384'],
        hoverBackgroundColor: ['#3498db', '#FF6384'],
      },
    ],
  };

  const playerData = {
    labels: ['Players Online', 'Players Offline'],
    datasets: [
      {
        data: [onlinePlayers, totalPlayers - onlinePlayers],
        backgroundColor: ['#3498db', '#FF6384'],
        hoverBackgroundColor: ['#3498db', '#FF6384'],
      },
    ],
  };

  return (
    <div className="log-container">
      <div className="log-charts-container">
        <div className="log-chart">
          <h2>All-Devices</h2>
          <Doughnut data={deviceData} />
          <div className="chart-info">
            <p style={{ color: '#3498db' }}>Online Devices: {onlineDevices} ({onlinePercentage.toFixed(1)}%)</p>
            <p style={{ color: '#FF6384' }}>Total Devices: {totalAccounts}</p>
          </div>
        </div>
        <div className="log-chart">
          <h2>Admins</h2>
          <Doughnut data={adminData} />
          <div className="chart-info">
            <p style={{ color: '#3498db' }}>Admins Online: {onlineAdmins} ({((onlineAdmins / totalAdmins) * 100).toFixed(1)}%)</p>
            <p style={{ color: '#FF6384' }}>Total Admins: {totalAdmins}</p>
          </div>
        </div>
        <div className="log-chart">
          <h2>Players</h2>
          <Doughnut data={playerData} />
          <div className="chart-info">
            <p style={{ color: '#3498db' }}>Players Online: {onlinePlayers} ({((onlinePlayers / totalPlayers) * 100).toFixed(1)}%)</p>
            <p style={{ color: '#FF6384' }}>Total Players: {totalPlayers}</p>
          </div>
        </div>
        <div className="log-chart">
          <h2>Assets</h2>
          <ul className= "Size-Asset-Info">
            {pictures.map((picture, index) => (
              <li key={index}>
                <div className='Assets-padding'><strong>Name:</strong> {picture.name}</div>
                <div><strong>Size:</strong> {calculateFileSize(picture.size)}</div>
              </li>
            ))}
          </ul>
          <div className="chart-info">
            <p>Total Assets: {totalPictures}</p>
            <p>Total Storage Used: {formattedTotalSize}</p>
          </div>
        </div>
      </div>
      {/* <div className="home-container">
        <h2>Online Status</h2>
        <ul>
          {accounts.map(account => (
            <li key={account.uid}>
              {account.type === 'ADMIN' ? 'Admin' : 'Player'} {account.uid}: {otherMachineStatus[account.uid]?.state === 'online' ? 'Online' : 'Offline'}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

function calculateFileSize(bytes) {
  const units = ['B', 'KB', 'MB'];
  let i = 0;
  while (bytes > 1024 && i < units.length - 1) {
    bytes /= 1024;
    ++i;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

export default Log;
