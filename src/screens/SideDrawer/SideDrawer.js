import React, { Component } from 'react';
import { View, 
        Dimensions, 
        Text, 
        StyleSheet, 
        FlatList,
        TouchableNativeFeedback,
        TouchableOpacity,
        Platform,
        AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import startHome from '../Home/homeTab';
import startFuelForm from '../FuelForm/fuelTab';
import startTripTab from '../TripHistory/tripTab';
import startSettingsTab from '../Settings/settingsTab';

import { validatedLogin, logOut } from '../../store/actions/index';

class SideDrawerScreen extends Component{

    state = {
        drawerTabs : [
            {
                key : 'Home',
                icon : 'md-home'
            },
            {
                key : 'Fuel Form',
                icon : 'ios-beer'
            },
            {
                key : 'Trip History',
                icon : 'md-car'
            },
            {
                key : 'Settings',
                icon : 'md-settings'
            },
            {
                key : 'Sign Out',
                icon : 'md-exit'
            }

    ]};

    constructor(props){
        super(props);
    }

    onPressHandler = (key) => {
        switch(key){
            case 'Home' :
                startHome();
                break;
            case 'Fuel Form' :
                startFuelForm();
                break;
            case 'Trip History' :
                startTripTab();
                break;
            case 'Settings' :
                startSettingsTab();
                break;
            case 'Sign Out':

                this.props.logout();

                let keys = ['tripStarted', 'username', 'cabnumber', 'loginid'];
                AsyncStorage.multiRemove(keys, (err) => {
                    if(err === null ){
                        this.props.onLogOut(false);
                        this.props.navigator.toggleDrawer({
                            side: 'left',
                            animated: true,
                            to: 'closed'
                        });
                        AsyncStorage.removeItem('userLogged', (err) => {
                            if(!err){
                                if(Platform.OS == 'ios'){
                                    Navigation.startSingleScreenApp({
                                        screen: {
                                            screen: 'tripOmeter.LoginScreen',
                                            title: '',
                                            navigatorStyle: {
                                            navBarHidden: true
                                            }
                                        }
                                        });
                                }else{
                                    this.props.navigator.resetTo({
                                        screen: 'tripOmeter.LoginScreen',
                                        title: ''
                                    });
                                }
                            }else{
                                alert(err);
                            }
                        });
                    }else{
                        alert(err);
                    }
                });
                break;
        }
    }

    render(){
        return(
            <View style={styles.drawerContainer} >
                <View style={styles.infoContainer}>
                    <Text style={styles.inputText}>Hari Haran</Text>
                </View>
                <View style={styles.drawerIconContainer}>
                    <FlatList
                        data = {this.state.drawerTabs} 
                        renderItem = { ({item}) => {
                            if(Platform.OS ==='ios'){
                                return(
                                    <TouchableOpacity
                                        onPress= {() => this.onPressHandler(item.key)}>
                                        <View style={styles.drawerIcons}>
                                                <Icon name={item.icon} size={30} color='black' />
                                                <Text style={styles.item}>{item.key}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                            return(
                                <TouchableNativeFeedback
                                    onPress= {() => this.onPressHandler(item.key)} >
                                    <View style={styles.drawerIcons} >
                                            <Icon name={item.icon} size={30} color='black' />
                                            <Text style={styles.item}>{item.key}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            )
                        }}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    drawerContainer : {
        width : 300,
        backgroundColor : 'white',
        flex : 1
    },
    infoContainer: {
        width : '100%',
        height : '25%',
        backgroundColor : '#33be89'
    },
    inputText: {
        color : 'white',
        fontSize : 17,
        fontWeight : 'bold',
        marginLeft : '5%',
        marginTop: '35%'
    },
    drawerIconContainer : {
        flex : 1
    },
    drawerIcons : {
        flexDirection : 'row',
        alignItems : 'center',
        backgroundColor: 'white',
        paddingLeft : 30,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth : 1,
        borderColor : '#EFF0F1'
    },
    item: {
        marginLeft : 20,
        color: 'black'
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogOut : logout => dispatch(validatedLogin(logout)),
        logout : () => dispatch(logOut())
    }
}

export default connect(null, mapDispatchToProps)(SideDrawerScreen);