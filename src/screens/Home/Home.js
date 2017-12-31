import React, { Component } from 'react';
import { View, 
         Text,
         StatusBar,
         Image,
         StyleSheet } from 'react-native';

import avatar from '../../assests/avatar.png';

class HomeScreen extends Component{

    static navigatorStyle = {
        statusBarTextColorScheme: 'dark',
        statusBarColor: '#04724b',
        navBarBackgroundColor : '#33be89',
        navBarTitleTextCentered: true,
        navBarTextColor : 'white',
        navBarNoBorder: true,
        navBarButtonColor: 'white'
    }

    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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

    render(){
        return(
            <View>
                <StatusBar backgroundColor="#04724b" 
                           barStyle="dark-content"/>
                <View style={styles.imageContainer}>
                    <Image source={avatar} style={styles.image}/>
                    <Text style={styles.inputText}>Driver Name : Hari Haran</Text>
                    <Text style={styles.inputText}>Cab Number : 20894</Text> 
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems : 'center',
        backgroundColor : '#33be89',
        paddingBottom : 15
    },
    image : {
        width : 80,
        height : 80,
        marginTop : 20,
    },
    inputText:{
        color: 'white',
        fontSize : 15,
        marginTop : 10,
        fontWeight : 'bold'
    }
});

export default HomeScreen;
