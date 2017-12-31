import React, { Component } from 'react';
import { View, Text , StatusBar} from 'react-native';

class FuelFormScreen extends Component{

    static navigatorStyle = {
        statusBarTextColorScheme: 'dark',
        statusBarColor: '#04724b',
        navBarBackgroundColor : '#33be89',
        navBarTitleTextCentered: true,
        navBarTextColor : 'white',
        navBarNoBorder: true,
        navBarButtonColor: 'white'
    }

    onNavigatorEvent = event => {
        if(event.type === 'NavBarButtonPress'){
            if(event.id === 'toggleMenu'){
                this.props.navigator.toggleDrawer({
                    side: 'left'
                });
            }
        }
    }
    
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    render(){
        return(
            <View>
                <StatusBar backgroundColor="#04724b" 
                           barStyle="dark-content"/>
                <Text>Fuel Form</Text>
            </View>
        );
    }
}

export default FuelFormScreen;