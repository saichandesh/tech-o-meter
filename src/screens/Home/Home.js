import React, { Component } from 'react';
import { View, 
         Text,
         StatusBar,
         Image,
         StyleSheet,
         Alert,
         PermissionsAndroid,
         Platform,
         AsyncStorage,
         AppState,
         DeviceEventEmitter,
         NativeAppEventEmitter,
         NativeModules } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import moment from "moment";
import { Button } from 'react-native-elements';
import { connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import avatar from '../../assests/avatar.png';
import startEndTrip from '../EndTrip/endTripTab';
import {newTrip, dismissModal} from '../../store/actions/index';
import BackgroundTimer from 'react-native-background-timer';
import Toast from 'react-native-simple-toast';
import { logOut, validatedLogin, startTrip, onStartTrip,setAlreadyExistsState } from '../../store/actions/index';
import { Navigation } from 'react-native-navigation';


const intervalId = BackgroundTimer.setInterval(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`${position.coords.latitude} \n ${position.coords.longitude}`);
        }, (error) => {
           console.log(error)
        });
}, 5000);

class HomeScreen extends Component{

    static navigatorStyle = {
        statusBarTextColorScheme: 'dark',
        statusBarColor: '#205180',
        navBarBackgroundColor : '#266287',
        navBarTitleTextCentered: true,
        navBarTextColor : 'white',
        navBarNoBorder: true,
        navBarButtonColor: 'white'
    }

    state = {
        time: moment().format("LTS"),
        date: moment().format("LL"),
        buttonStyle : styles.buttonStartTrip,
        buttonTitle : 'START TRIP',
        trip : null,
        tripTime : null,
        latitude: null,
        longitude: null,
        error: null,
        modalStyle: styles.dismissModal,
        intervalRefHandler : null,
        appState: AppState.currentState,
        userName : null,
        cabNumber : null,
        startTime : null,
        isSubmiting : false,
        tripLocationStatus : null,
        tripTimeStatus : null
    };

    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        this.props.newTrip();
    }

    componentWillMount(){
        this.setState({
            intervalRefHandler : null
        });
        
        AsyncStorage.multiGet(['username', 'cabnumber'], (errors, result) => {
            if(errors === null){
                this.setState({
                    userName : result[0][1],
                    cabNumber : result[1][1]
                });
            }
        });
    }

    componentDidMount() {
        let intervalRef = setInterval(() => {
            this.setState({
              time: moment().format("LTS"),
              date: moment().format("LL")
            })
          }, 1000);
        if(this.state.intervalRefHandler == null){
            this.setState({
                intervalRefHandler : intervalRef
            });
        }

        AsyncStorage.getItem('tripStarted', (err, res) => {
            if(!err && res === 'true'){
                this.startedTrip();
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.alreadyExists){
            Toast.show(`User logged in another device`);
            this.setState({
                isSubmiting : false
            });
            Navigation.dismissAllModals({
                animationType: 'slide-down'
            });
            this.props.onDismissModal(true);
            this.onAlreadyUserExistslogOut();
        }
        if(nextProps.endTripComplete){
            this.onEndTrip();
            this.setState({
                isSubmiting : false
            });
            Toast.show(`Trip ended...`);
        }
        if(nextProps.dismissModal){
            this.onModalDismiss();
        }

        if(nextProps.startTripSubmitState){
            this.setState({
                isSubmiting : false
            });

            if(nextProps.successStatTrip && !nextProps.endTripComplete){
                AsyncStorage.getItem('tripStarted', (err, res) => {
                    if(!err && res === 'true'){
                        AsyncStorage.multiGet(['tripLocation', 'tripStartTime'], (errors, res) => {
                            if(errors === null){
                                this.setState({
                                    buttonStyle : styles.buttonEndTrip,
                                    buttonTitle : 'END TRIP',
                                    trip : `${res[0][1]}`,
                                    tripTime : `${res[1][1]}`,
                                    error: null,
                                    tripLocationStatus : `Trip Start Locaion`,
                                    tripTimeStatus : `Trip Start Time`
                                });
                            }
                        });
                        Toast.show(`Trip Started...`);
                    }
                });
            }else if(!nextProps.successStatTrip){
                Toast.show(`Error in connection. Check the details and try again`);
            }
        }
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalRefHandler);
    }

    onModalDismiss = () => {
        this.setState({
            modalStyle : styles.dismissModal
        });
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

    onEndTrip = () => {
        this.setState({
            buttonStyle : styles.buttonStartTrip,
            buttonTitle : 'START TRIP',
            trip : null,
            tripTime: null,
            tripLocationStatus : null,
            tripTimeStatus : null,
            modalStyle : styles.dismissModal
        });
        AsyncStorage.setItem('tripStarted', 'false');
    }

    onEndTripOkay = () => {
        this.setState({
            modalStyle : styles.modal
        });
        this.props.onStartTrip(false, false, false);
        this.props.onDismissModal(false);
        startEndTrip();
    }

    onStratTrip = () => {
        this.setState({
            isSubmiting : true
        });
        this.props.newTrip();
        this.props.onStartTrip(false, false, false);

        AsyncStorage.multiGet(['loginid', 'userid'], (errors, res) => {
            if(errors === null){
                let tripDetails = {
                    lat : null,
                    long : null,
                    startTime : moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
                    loginID : parseInt(res[0][1]),
                    userID : parseInt(res[1][1])
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        tripDetails.lat = position.coords.latitude;
                        tripDetails.long = position.coords.longitude;
                        this.setState({
                            latitude : tripDetails.lat,
                            longitude : tripDetails.long,
                            startTime : tripDetails.startTime 
                        });
                        this.props.startTrip(tripDetails);
                    }, (error) => {
                        this.setState({
                            isSubmiting : false
                        });
                       Toast.show(`Error in starting the trip. Try again...`)
                });
            }
        });
    }

    startedTrip = () => {

        let tripName = null;
        let tripStartTime = null;

        AsyncStorage.getItem('tripLocation', (err, res) => {
            if(!err){
                tripName = res;
                AsyncStorage.multiGet(['tripLocation', 'tripStartTime'], (errors, res) => {
                    if(errors === null){
                        tripStartTime = res;
                        this.props.onDismissModal(false);
                        this.setState({
                            buttonStyle : styles.buttonEndTrip,
                            buttonTitle : 'END TRIP',
                            trip : `${res[0][1]}`,
                            tripTime : `${res[1][1]}`,
                            error: null,
                            tripLocationStatus : `Trip Start Locaion`,
                            tripTimeStatus : `Trip Start Time`
                        });
                    }else{
                        this.onEndTrip();
                    }
                });
            }else{
                this.onEndTrip();
            }
        });
    }
 
    onPressHandler = () => {
        if(this.state.buttonTitle === 'END TRIP'){
            Alert.alert(
                'Trip Confirmation',
                'Do you want to end the trip ?',
                [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: this.onEndTripOkay},
                ],
                { cancelable: false }
            )
        }else{
            this.onStratTrip();
        }
    }

    onAlreadyUserExistslogOut = () => {
        this.props.setAlreadyExistsState();
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
    }

    render(){
        return(
            <View style = {this.state.modalStyle}>
                <StatusBar backgroundColor="#205180" 
                           barStyle="dark-content"/>
                <View style={styles.imageContainer}>
                    <Image source={avatar} style={styles.image}/>
                    <Text style={styles.inputText}>Driver Name : {this.state.userName}</Text>
                    <Text style={styles.inputText}>Cab Number : {this.state.cabNumber}</Text> 
                </View>
                <View style={styles.container}>
                    <Spinner visible={this.state.isSubmiting} 
                            textContent={''} 
                            extStyle={{color: 'black'}} />
                    <Text style={styles.dateText}>
                        {this.state.date}
                    </Text>
                    <Text style={styles.timeText}>
                        {this.state.time}
                    </Text>
                    <KeepAwake />
              </View>
              <Text style={styles.tripInfoStatus}>
                        {this.state.tripLocationStatus}
              </Text>
              <Text style={styles.tripInfo}>
                  {this.state.trip}
              </Text>
              <Text style={styles.tripInfoStatus}>
                        {this.state.tripTimeStatus}
              </Text>
              <Text style={styles.tripInfo}>
                  {this.state.tripTime}
              </Text>
              <Button onPress={this.onPressHandler}
                      buttonStyle={this.state.buttonStyle}
                      textStyle={{textAlign: 'center'}}
                      title={this.state.buttonTitle}
              />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems : 'center',
        backgroundColor : '#266287',
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
    },
    container : {
        backgroundColor : 'black',
        margin : '8%',
        justifyContent : 'center',
        alignItems : 'center',
        padding : '5%',
        borderRadius : 50
    },
    timeText: {
        color: 'white',
        fontSize: 18,
    },
    dateText: {
        color: 'white',
        fontSize: 20,
    },
    buttonStartTrip : {
        backgroundColor: '#266287', 
        borderRadius: 10, 
        marginTop : '5%',
    },
    buttonEndTrip : {
        backgroundColor: '#C6252F', 
        borderRadius: 10, 
        marginTop : '2%'
    },
    tripInfo: {
        textAlign : 'center',
        color: 'black',
        padding: '1%',
        fontWeight: 'bold',
        fontSize: 17
    },
    tripInfoStatus : {
        color : '#2582bc',
        textAlign : 'center',
        padding: '1%',
        fontWeight: 'bold',
        fontSize: 17
    },
    modal: {
        opacity : 0.4, 
        backgroundColor : 'grey', 
        flex: 1
    },
    dismissModal: {
        opacity : 1
    }
});

const mapDispatchToProps = dispatch => {
    return{
        newTrip : () => dispatch(newTrip()),
        onDismissModal : (dismissModalValue) => dispatch(dismissModal(dismissModalValue)),
        startTrip : (tripDetails) => dispatch(startTrip(tripDetails)),
        onStartTrip : (alreadyExists, successStatTrip, startTripSubmit) => dispatch(onStartTrip(alreadyExists, successStatTrip, startTripSubmit)),
        logout : () => dispatch(logOut()),
        onLogOut : logout => dispatch(validatedLogin(logout)),
        setAlreadyExistsState: () => dispatch(setAlreadyExistsState(false))
    }
}

const maptStateToProps = state => {
    return{
        endTripComplete : state.trip.endTripComplete,
        dismissModal: state.trip.dismissModal,
        startTripSubmitState : state.user.startTripSubmit,
        successStatTrip: state.user.successStatTrip,
        alreadyExists: state.user.alreadyExists
    }
}

export default connect(maptStateToProps, mapDispatchToProps)(HomeScreen);
