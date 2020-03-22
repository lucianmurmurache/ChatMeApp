# ChatMeApp

## Summary:
* A deep dive into _React Native_, learning about its advantages. 
* Using a CLI tool called [Expo](https://expo.io/) to set up the _React Native_ project. 
* Use _Android_ emulators and _iOS_ simulators to see how the app looks and behaves in different environments.

## Key Features
1. Data gets stored online and offline.
2. A page displaying the conversation, as well as an input field and submit button.
3. The chat must provide users with two additional communication features: sending images and location data.
4. A page where users can enter their name and choose a background color for the chat screen before joining the chat.

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
 3. Color options HEX codes: #090C08; #474056; #8A95A5; #B9C6AE
 4. “Your name”: font size 16, font weight 300, font color #757083, 50% opacity
 5. “Choose background color”: font size 16, font weight 300, font color #757083, 100% opacity
 6. Start chatting button: font size 16, font weight 600, font color #FFFFFF, button color#757083

 ## Technical Requirements
 1. The app must be written in _React Native_.
 2. The app must be developed using _Expo.io_.
 3. Chat conversations must be stored locally.
 4. The app must store images in _Firebase Cloud Storage_.
 5. The app must be able to read the user’s location data.
 6. Location data must be sent via the chat in a map view.
 7. The app must be styled according to specific screen design.
 8. Chat conversations must be stored in _Google Firestore Database_.
 9. The app must let users pick and send images from the phone’s image library.
 10. The app must authenticate users anonymously via _Google Firebase authentication_.
 11. The app must let users take pictures with the device’s camera app, and send them.
 12. The chat interface and functionality must be created using the _Gifted Chat library_.
 13. All _React Native_ code must be valid and linted according to given requirements.