//Import screens
import Chat from './components/Chat';
import Start from './components/Start';

//Import navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//hide navigation bar on Start screen
const navigator = createStackNavigator({
  Start: {
    screen: Start, navigationOptions: {
      headerShown: false,
    },
  },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;
