import React, { Component } from 'react';
import { View, 
        Text, 
        StatusBar,
        Picker,
        TextInput,
        KeyboardAvoidingView,
        Platform,
        AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { logOut, validatedLogin, tripHistorySubmit, onTripHistorySubmitted} from '../../store/actions/index';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

class TripHistoryScreen extends Component{

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

    state = {
        isSubmiting : false,
        cabNumber : null,
        cashAmount : null,
        totalAmount : null,
        startDate: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
        endDate: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
        tripDistance: null
    }
    
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentWillMount(){
        AsyncStorage.getItem('cabnumber', (err, res) => {
            if(!err){
                this.setState({
                    cabNumber : res
                })
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.tripHistorySubmitState){
            this.setState({
                isSubmiting : false,
                cashAmount : null,
                totalAmount : null,
                startDate: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
                endDate: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
                tripDistance: null
            });
            if(nextProps.successTripHistorySubmit){
                Toast.show(`Trip History Submitted Succesfully`);
            }else{
                Toast.show(`Error in submitting trip history. Check the details and try again`);
            }
        }
        
        if(nextProps.alreadyExists){
            Toast.show(`User logged in another device`);
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
    }

    onSubmit = () => {

        if(this.state.cabNumber === null || this.state.cashAmount === null || this.state.totalAmount === null
        || this.state.tripDistance === null){
            this.setState({
                isSubmiting : false
            });
            
            Toast.show(`Fields can't be null`);
            
        }else if(this.state.endDate === this.state.startDate){
            this.setState({
                isSubmiting : false
            });
            Toast.show(`Start and End date for a trip can't be same`);
        }else if(parseInt(this.state.cashAmount) > parseInt(this.state.totalAmount)){
            this.setState({
                isSubmiting : false
            });
            Toast.show(`Cash amount can't be greater than total trip amount`);
        }else{
            this.props.onTripHistorySubmitted(false, false, false);
            this.setState({
                isSubmiting : true
            });
    
            AsyncStorage.multiGet(['loginid', 'userid'], (errors, res) => {
                if(errors === null){
                    
                    let tripHistoryDetails = {
                        cabNumber : this.state.cabNumber,
                        cashAmount : this.state.cashAmount,
                        totalAmount : this.state.totalAmount,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        totalDistance: parseInt(this.state.tripDistance),
                        loginID : parseInt(res[0][1]),
                        userID : parseInt(res[1][1])
                    }
    
                    this.props.tripHistorySubmit(tripHistoryDetails);
                }else{
                    this.setState({
                        isSubmiting : false
                    });
                    Toast.show(`Error, Try again..`);
                }
            });
        }
    }

    render(){
        return(
            <View>
                <StatusBar backgroundColor="#04724b" 
                           barStyle="dark-content"/>
                <View style={styles.container}>
                    <Spinner visible={this.state.isSubmiting} 
                            textContent={''} 
                            extStyle={{color: 'black'}} />
                    <View>
                        <Text style={styles.datepickertext}>Start Time</Text>
                        <View style = {styles.datepickercontainer}>
                            <DatePicker
                                style={styles.datepicker}
                                date={this.state.startDate}
                                mode="datetime"
                                placeholder="select date"
                                format="DD-MM-YYYY   hh:mm:ss a"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 10
                                    },
                                    dateInput: {
                                        marginLeft: '5%',
                                        borderWidth : 0
                                    }
                                }}
                                maxDate = {this.state.startDate}
                                onDateChange={(date) => {
                                    if(date > this.state.startDate){
                                        Toast.show(`Time can't be in future`);
                                    }else{
                                        this.setState({
                                            startDate : date
                                        })
                                    }
                                }}
                            />
                        </View>
                        <Text style={styles.datepickertext}>End Time</Text>
                        <View style = {styles.endDatePickerContainer}>
                            <DatePicker
                                style={styles.datepicker}
                                date={this.state.endDate}
                                mode="datetime"
                                placeholder="select date"
                                format="DD-MM-YYYY   hh:mm:ss a"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 10
                                    },
                                    dateInput: {
                                        marginLeft: '5%',
                                        borderWidth : 0
                                    }
                                }}
                                maxDate = {this.state.endDate}
                                onDateChange={(date) => {
                                    if(date > this.state.endDate){
                                        Toast.show(`Time can't be in future`);
                                    }else if(this.state.startDate === date){
                                        Toast.show(`start and end trip times can't be same`);
                                    }else{
                                        this.setState({
                                            endDate : date
                                        })
                                    }
                                }}
                            />
                        </View>
                        <KeyboardAvoidingView behavior = "padding">
                            <Text style={styles.labelText}>Cab Number</Text>
                            <TextInput  placeholder="Cab Number" 
                                        style= {styles.inputText} 
                                        value = {this.state.cabNumber}
                                        underlineColorAndroid='transparent'
                                        onSubmitEditing={(event) => { 
                                            this.refs.SecondInput.focus(); 
                                        }}
                                        onChangeText={(text) => this.setState({cabNumber:text})}/>
                            <Text style={styles.labelText}>Trip Distance (Kms)</Text>
                            <TextInput  ref='SecondInput'
                                        placeholder="Trip Distance" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        keyboardType = 'numeric'
                                        onSubmitEditing={(event) => { 
                                            this.refs.ThirdInput.focus(); 
                                        }}
                                        value = {this.state.tripDistance}
                                        onChangeText={(text) => this.setState({tripDistance:text})}/>
                            <Text style={styles.labelText}>Total Trip Amount (Rs.)</Text>
                            <TextInput  ref='ThirdInput'
                                        placeholder="Total Trip Amount" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        keyboardType = 'numeric'
                                        onSubmitEditing={(event) => { 
                                            this.refs.FourthTrip.focus(); 
                                        }}
                                        value = {this.state.totalAmount}
                                        onChangeText={(text) => this.setState({totalAmount:text})}/>
                            <Text style={styles.labelText}>Cash Amount (Rs.)</Text>
                            <TextInput  ref='FourthTrip'
                                        placeholder="Cash Amount" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        keyboardType = 'numeric'
                                        onSubmitEditing={(event) => { 
                                            this.onSubmit() 
                                        }}
                                        value = {this.state.cashAmount}
                                        onChangeText={(text) => this.setState({cashAmount:text})}/>
                        </KeyboardAvoidingView>
                        <Button     buttonStyle={styles.button}
                                    textStyle={{textAlign: 'center'}}
                                    title={`SUBMIT`}
                                    onPress = {this.onSubmit}
                        /> 
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        padding : '3%'
    },
    inputText: {
        fontSize : 16,
        color: 'black',
        borderBottomWidth : 1,
        borderColor : '#04724b',
        marginBottom : '1%'
    },
    button : {
        backgroundColor: '#04724b',
        marginTop : 8
    },
    datepickercontainer: {
        borderColor : '#04724b',
        borderWidth: 1, 
        borderRadius : 50,
        padding : '1%'
    },
    endDatePickerContainer: {
        borderColor : '#04724b',
        borderWidth: 1, 
        borderRadius : 50,
        padding : '1%',
        marginBottom : '1%'
    },
    datepicker : {
        width : '100%',
    },
    datepickertext: {
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginTop : '2%',
        marginBottom: '2%'
    },
    labelText: {
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginBottom : '-3%'

    }
}

const mapStateToProps = state => {
    return {
        alreadyExists : state.user.alreadyExists,
        tripHistorySubmitState : state.user.tripHistorySubmit,
        successTripHistorySubmit : state.user.successTripHistorySubmit
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout : () => dispatch(logOut()),
        onLogOut : logout => dispatch(validatedLogin(logout)),
        tripHistorySubmit : (tripHistoryDetails) => dispatch(tripHistorySubmit(tripHistoryDetails)),
        onTripHistorySubmitted : (alreadyExists, successTripHistorySubmit, tripHistorySubmit) => dispatch(onTripHistorySubmitted(alreadyExists, successTripHistorySubmit, tripHistorySubmit)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripHistoryScreen);