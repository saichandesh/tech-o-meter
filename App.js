import { Navigation } from 'react-native-navigation';

import LoginScreen from './src/screens/Login/Login';

// Register Screens
Navigation.registerComponent("tech-o-meter.LoginScreen" , () => LoginScreen);

//Start App
Navigation.startSingleScreenApp({
  screen: {
    screen: 'tech-o-meter.LoginScreen',
    title: '',
    navigatorStyle: {
      navBarHidden: true
    }
  }
});