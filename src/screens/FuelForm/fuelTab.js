import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const startFuelForm = () => {

    Icon.getImageSource('md-menu', 30, 'white')
        .then(res => {
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'tripOmeter.FuelFormScreen',
                    title: 'Fuel Form',
                    navigatorButtons: {
                        leftButtons : [
                            {
                                icon : res,
                                title : "menu",
                                id : 'toggleMenu'
                            }
                        ]
                    }
                },
                drawer: {
                    left: { 
                        screen: 'tripOmeter.SideDrawerScreen'
                    }
                },
                animationType: 'none'
            });
        });
}

export default startFuelForm;