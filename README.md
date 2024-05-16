Project Setup Guide

Prerequisites
Node.js
npm (Node Package Manager)
Firebase account
Step-by-Step Instructions
1. Clone the Repository
First, clone the repository to your local machine:

sh
Copy code
git clone <repository-url>
cd <repository-directory>
2. Install Dependencies
Install all the dependencies listed in the package.json file:

sh
Copy code
npm install
3. Configure Firebase
a. Download firebaseConfig
Go to your Firebase console.
Navigate to Project Settings.
Scroll down to the Your Apps section.
Find the code snippet for firebaseConfig and copy it.
Paste the firebaseConfig code into your project file where you initialize Firebase.
b. Configure Admin SDK
In the Firebase console, go to Project Settings > Service Accounts.
Copy the code for the Admin SDK.
Replace the existing Admin SDK code in your project with the copied code.
Click on Generate new private key and download the key file.
Place the downloaded key file in the same directory as your Admin SDK code.
4. Update Admin SDK Path
Open your Admin SDK file.
Find the line:
javascript
Copy code
var serviceAccount = require("path/to/serviceAccountKey.json");
Replace it with:
javascript
Copy code
var serviceAccount = require("YOUR_KEY_FILE.json");
5. Update ROOT.js
Open ROOT.js.
Change the line:
javascript
Copy code
const serviceAccount = require('./src/YOUR_FILE.json');
Ensure you keep ./src in the path.
6. Firebase Authentication
Go to the Firebase console and navigate to Authentication.
Create an account using email and password.
Copy the UID of the created account.
7. Update ROOT.js with UID
Open ROOT.js.
Paste the UID you copied into the appropriate location in the code.
8. Run ROOT.js
Run ROOT.js using Node.js in the terminal:

sh
Copy code
node ROOT.js
9. Start the Server
Start the server by running:

sh
Copy code
node server.js
10. Run the App
Finally, start the application by running:

sh
Copy code
npm start
Project Dependencies
This project uses several npm packages for various functionalities. Below is a list of the main dependencies along with their versions:

Dependencies
@emotion/react: ^11.11.4
@emotion/styled: ^11.11.5
@mui/icons-material: ^5.15.17
@mui/lab: ^5.0.0-alpha.170
@mui/material: ^5.15.17
@mui/system: ^5.15.15
body-parser: ^1.20.2
chart.js: ^4.4.2
cors: ^2.8.5
express: ^4.19.2
firebase-admin: ^12.0.0
firebase: ^10.11.0
react-chartjs-2: ^5.2.0
react-dom: ^18.2.0
react-router-dom: ^6.22.3
react-scripts: ^5.0.1
react: ^18.2.0
DevDependencies
@testing-library/jest-dom: ^5.17.0
@testing-library/react: ^13.4.0
@testing-library/user-event: ^13.5.0
web-vitals: ^2.1.4
To install all dependencies, you can run:

sh
Copy code
npm install @emotion/react@11.11.4 @emotion/styled@11.11.5 @mui/icons-material@5.15.17 @mui/lab@5.0.0-alpha.170 @mui/material@5.15.17 @mui/system@5.15.15 body-parser@1.20.2 chart.js@4.4.2 cors@2.8.5 express@4.19.2 firebase-admin@12.0.0 firebase@10.11.0 react-chartjs-2@5.2.0 react-dom@18.2.0 react-router-dom@6.22.3 react-scripts@5.0.1 react@18.2.0 @testing-library/jest-dom@5.17.0 @testing-library/react@13.4.0 @testing-library/user-event@13.5.0 web-vitals@2.1.4
