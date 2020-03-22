# ChatMeApp

## Summary:
A deep dive into _React Native_, learning about its advantages and comparing it to _React_. 
Using a CLI tool called [Expo](https://expo.io/) to set up the _React Native_ project. 
Use Android emulators and iOS simulators to see how the app looks and behaves in different environments.

## Key Features
1. A page where users can enter their name and choose a background color for the chat screen before joining the chat.
2. A page displaying the conversation, as well as an input field and submit button.
3. The chat must provide users with two additional communication features: sending images and location data.
4. Data gets stored online and offline.

## Installation instructions

To run the app, you must first install [expo](https://expo.io/). You can do this by running **npm install expo-cli -g**

### Required Libraries

To install all dependencies, you can run **expo install react-navigation react-native-gesture-handler react-native-reanimated react-native-screens npm install react-navigation-stack --save**

Next, you can start app by running **npm start** . This will launch _DevTools_ on **port 19002**. 
Now you can run the app on a physical device or emulator by either scanning the _QR code_ or by creating and signing in an expo account. 
To run the app on your device, you can download and install the expo app from the app store or play store.
For information on how to set up an emulator for testing, you can visit the _documentation_ [page](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/). 

## Design Specifications
 1. Vertical and horizontal spacing evenly distributed
 2. App title: font size 45, font weight 600, font color #FFFFFF
 3. “Your name”: font size 16, font weight 300, font color #757083, 50% opacity
 4. “Choose background color”: font size 16, font weight 300, font color #757083, 100% opacity
 5. Color options HEX codes: #090C08; #474056; #8A95A5; #B9C6AE
 6. Start chatting button: font size 16, font weight 600, font color #FFFFFF, button color#757083

 ## Technical Requirements
 1. The app must be written in React Native.
 2. The app must be developed using Expo.io.
 3. The app must be styled according to the given screen design.
 4. Chat conversations must be stored in Google Firestore Database.
 5. The app must authenticate users anonymously via Google Firebase authentication.
 6. Chat conversations must be stored locally.
 7. The app must let users pick and send images from the phone’s image library.
 8. The app must let users take pictures with the device’s camera app, and send them.
 9. The app must store images in Firebase Cloud Storage.
 10. The app must be able to read the user’s location data.
 11. Location data must be sent via the chat in a map view.
 12. The chat interface and functionality must be created using the Gifted Chat library.
 13. The app’s codebase must contain comments.
 14. The project must include technical documentation.
 15. All React Native code must be valid and linted according to given requirements.