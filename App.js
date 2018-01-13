import { Navigation } from 'react-native-navigation';

import LoginScreen from './src/screens/Login/Login';
import HomeScreen from './src/screens/Home/Home';
import FuelFormScreen from './src/screens/FuelForm/FuelForm';
import SideDrawerScreen from './src/screens/SideDrawer/SideDrawer';
import EndTripScreen from './src/screens/EndTrip/EndTrip';
import TripHistoryScreen from './src/screens/TripHistory/TripHistory';
import SettingsScreen from './src/screens/Settings/Settings';

import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';

const store = configureStore();

// Register Screens
Navigation.registerComponent("tripOmeter.LoginScreen" , () => LoginScreen, store, Provider);
Navigation.registerComponent("tripOmeter.HomeScreen" , () => HomeScreen, store, Provider);
Navigation.registerComponent("tripOmeter.FuelFormScreen" , () => FuelFormScreen, store, Provider);
Navigation.registerComponent("tripOmeter.SideDrawerScreen" , () => SideDrawerScreen, store, Provider);
Navigation.registerComponent("tripOmeter.EndTripScreen" , () => EndTripScreen, store, Provider);
Navigation.registerComponent("tripOmeter.TripHistoryScreen" , () => TripHistoryScreen, store, Provider);
Navigation.registerComponent("tripOmeter.SettingsScreen" , () => SettingsScreen, store, Provider);

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