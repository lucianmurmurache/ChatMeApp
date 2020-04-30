# ChatMeApp


## Summary:
* A chat application using _React Native_ and [Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat). 
* Using [Expo-cli](https://expo.io/)   to set up the project. 
* Use _Android_ emulators and _iOS_ simulators to see how the app looks and behaves in different environments.

## Key Features
1. Data gets stored online and offline.
2. A page displaying the conversation, as well as an input field and submit button.
3. The chat must provide users with two additional communication features: sending images and location data.
4. A page where users can enter their name and choose a background color for the chat screen before joining the chat.

### Installation instructions

* To run the app, you must first install [expo-cli](https://expo.io/tools#cli).
* Once Expo is installed, navigate to the root directory and run **npm i**. 
* Next, you can start the app by running **expo start** . This will launch _DevTools_ on **port 19002**. 
* You can either scan the barcode using a mobile device (expo app required:  [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en)  or  [iOS](https://apps.apple.com/de/app/expo-client/id982107779)) or use a [simulator](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/iOS_Simulator_Guide/GettingStartedwithiOSSimulator/GettingStartedwithiOSSimulator.html) or [emulator](https://developer.android.com/studio/run/emulator).

### Required Dependencies

* To install all dependencies, you can simmply run **npm i** from the root directory.

* Used dependencies: 
    * @react-native-community/masked-view,
    * @react-native-community/netinfo,
    * react-native-safe-area-context,
    * react-native-keyboard-spacer,
    * react-native-gesture-handler,
    * react-native-gifted-chat,
    * react-native-reanimated,
    * react-navigation-stack,
    * react-native-screens,
    * expo-image-picker,
    * react-native-maps,
    * expo-permissions,
    * react-native-web,
    * react-navigation,
    * expo-location,
    * react-native,
    * react-dom,
    * firebase,
    * react,
    * expo,

### Design Specifications
 * Vertical and horizontal spacing evenly distributed
 * App title: font size 45, font weight 600, font color #FFFFFF
 * Color options HEX codes: #090C08; #474056; #8A95A5; #B9C6AE
 * “Your name”: font size 16, font weight 300, font color #757083, 50% opacity
 * “Choose background color”: font size 16, font weight 300, font color #757083, 100% opacity
 * Start chatting button: font size 16, font weight 600, font color #FFFFFF, button color#757083

 ### Technical Requirements
 * The app must be written in _React Native_.
 * The app must be developed using _Expo.io_.
 * Chat conversations must be stored locally.
 * The app must store images in _Firebase Cloud Storage_.
 * The app must be able to read the user’s location data.
 * Location data must be sent via the chat in a map view.
 * The app must be styled according to specific screen design.
 * Chat conversations must be stored in _Google Firestore Database_.
 * The app must let users pick and send images from the phone’s image library.
 * All _React Native_ code must be valid and linted according to given requirements.
 * The app must authenticate users anonymously via _Google Firebase authentication_.
 * The chat interface and functionality must be created using the _Gifted Chat library_.
 * The app must let users take pictures with the device’s camera app, and send them.
