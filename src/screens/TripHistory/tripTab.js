import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const startTripTab = () => {

    Icon.getImageSource('md-menu', 30, 'white')
        .then(res => {
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'tripOmeter.TripHistoryScreen',
                    title: 'Trip History',
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

export default startTripTab;