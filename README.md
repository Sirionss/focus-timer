# Focus-timer
Step 1: Install Node.js
Download and install Node.js LTS version from nodejs.org. 
Verify installation by running: node --version

Step 2: Clone the Repository
git clone [REPOSITORY_URL]
cd FocusTimer

Step 3: Install Dependencies
npm install

Step 4: Run the Application
•	For web browser: npm run web
•	For mobile (Expo Go): npx expo start, then scan QR code
# How to Use the Application
1. Setup Screen:
•	Adjust the Total Time slider (15-240 minutes)
•	Set the number of breaks (0-8)
•	Select an activity from the dropdown
•	Press 'Start Session' to begin
2. Timer Screen:
•	Timer starts automatically
•	Use Pause button to temporarily stop
•	Use Reset button to restart current session
•	Use Skip button to move to next session
•	Timer auto-transitions between work (purple) and break (green)
3. Completion:
•	When all sessions complete, a completion screen appears
•	Press 'Start Again' to restart or 'Back to Setup' to reconfigure
