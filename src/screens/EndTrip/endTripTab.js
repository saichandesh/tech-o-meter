import { Navigation } from 'react-native-navigation';

const startEndTrip = () => {

    Navigation.showModal({
        screen: "tripOmeter.EndTripScreen",
        animationType: 'slide-up' 
    });
}

export default startEndTrip;