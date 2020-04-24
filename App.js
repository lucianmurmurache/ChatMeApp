//Import screens
import Chat from './components/Chat';
import Start from './components/Start';

//Import navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//Timer warning workaround - issue due to Firebase
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

// Create Navigator
const navigator = createStackNavigator({
  Start: {
    screen: Start, navigationOptions: {
      //hide navigation bar on Start screen
      headerShown: false,
    },
  },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;
