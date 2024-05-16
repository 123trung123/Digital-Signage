// src/firebaseUtils.js

import { auth } from './firebaseConfig'; // Assuming you have configured Firebase in firebaseConfig.js

// Function to fetch users from Firebase Authentication
export const getUsersFromFirebase = async () => {
  try {
    const userList = [];
    const userListResponse = await auth.listUsers(); // Fetch list of all users
    userListResponse.users.forEach((userRecord) => {
      // Extract relevant user information
      const user = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        // Add any other relevant user properties you need
      };
      userList.push(user);
    });
    return userList;
  } catch (error) {
    throw new Error('Error fetching users from Firebase Authentication:', error);
  }
};
