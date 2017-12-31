import { Navigation } from 'react-native-navigation';

import LoginScreen from './src/screens/Login/Login';
import HomeScreen from './src/screens/Home/Home';
import FuelFormScreen from './src/screens/FuelForm/FuelForm';
import SideDrawerScreen from './src/screens/SideDrawer/SideDrawer';

// Register Screens
Navigation.registerComponent("tripOmeter.LoginScreen" , () => LoginScreen);
Navigation.registerComponent("tripOmeter.HomeScreen" , () => HomeScreen);
Navigation.registerComponent("tripOmeter.FuelFormScreen" , () => FuelFormScreen);
Navigation.registerComponent("tripOmeter.SideDrawerScreen" , () => SideDrawerScreen);

//Start App
Navigation.startSingleScreenApp({
  screen: {
    screen: 'tripOmeter.LoginScreen',
    title: '',
    navigatorStyle: {
      navBarHidden: true
    }
  }
});