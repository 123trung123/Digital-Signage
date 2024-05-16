Prerequisites
Node.js
npm (Node Package Manager)
Firebase account
Step-by-Step Instructions
1. Clone the Repository
sh
Copy code
git clone <repository-url>
cd <repository-directory>
2. Configure Firebase
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
3. Update Admin SDK Path
Open your Admin SDK file.
Find the line:
javascript
Copy code
var serviceAccount = require("path/to/serviceAccountKey.json");
Replace it with:
javascript
Copy code
var serviceAccount = require("YOUR_KEY_FILE.json");
4. Update ROOT.js
Open ROOT.js.
Change the line:
javascript
Copy code
const serviceAccount = require('./src/YOUR_FILE.json');
Ensure you keep ./src in the path.
5. Firebase Authentication
Go to the Firebase console and navigate to Authentication.
Create an account using email and password.
Copy the UID of the created account.
6. Update ROOT.js with UID
Open ROOT.js.
Paste the UID you copied into the appropriate location in the code.
7. Run ROOT.js
Run ROOT.js using Python or in the VSCode terminal:

sh
Copy code
python ROOT.js
# or
node ROOT.js
8. Start the Server
sh
Copy code
node server.js
9. Run the App
sh
Copy code
npm start
Your application should now be up and running. If you encounter any issues, refer to the documentation or open an issue in the repository.
