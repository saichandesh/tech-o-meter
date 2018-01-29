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
import { connect } from 'react-redux';
import { expenseSubmit, onExpenseSubmitted, logOut, validatedLogin} from '../../store/actions/index';
import { Navigation } from 'react-native-navigation';

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

    state = {
        expenseType : 'fuel',
        isSubmiting : false,
        cabNumber : null,
        amount : null,
        date: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a')
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
        if(nextProps.expenseSubmitState){
            this.setState({
                expenseType : 'fuel',
                isSubmiting : false,
                amount : null,
                date: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
            });
            if(nextProps.successExpenseSubmit){
                Toast.show(`Expense Submitted Succesfully`);
            }else{
                Toast.show(`Error in submitting expense. Check the details and try again`);
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
        if(this.state.expenseType === 'maintenance'){
            this.setState({
                isSubmiting : false
            });
            Toast.show(`Maintenance is not supported yet..`);
        }else{
            if(this.state.amount === null || this.state.cabNumber === null){
                Toast.show(`Fields can't be null`);
                this.setState({
                    isSubmiting : false
                });
            }else{
                this.props.onExpenseSubmitted(false, false, false);
                this.setState({
                    isSubmiting : true
                });
    
                AsyncStorage.multiGet(['loginid', 'userid'], (errors, res) => {
                    if(errors === null){
                        
                        let expense = {
                            expenseType : this.state.expenseType,
                            cabNumber : this.state.cabNumber,
                            amount : this.state.amount,
                            date : this.state.date,
                            loginID : parseInt(res[0][1]),
                            userID : parseInt(res[1][1])
                        }
    
                        this.props.onExpenseSubmit(expense);
                    }else{
                        this.setState({
                            isSubmiting : false
                        });
                        Toast.show(`Error, Try again..`);
                    }
                });
            }
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
                        <Text style={styles.text}>Expense Type</Text>
                        <View style = {styles.picker}>
                            <Picker
                                    selectedValue={this.state.expenseType}
                                    onValueChange={(itemValue, itemIndex) => this.setState({expenseType: itemValue})}>
                                <Picker.Item label="Fuel" value="fuel" />
                                <Picker.Item label="Maintenance" value="maintenance" />
                            </Picker>
                        </View>
                        <Text style={styles.datepickertext}>Expense Date</Text>
                        <View style = {styles.datepickercontainer}>
                            <DatePicker
                                style={styles.datepicker}
                                date={this.state.date}
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
                                maxDate = {this.state.date}
                                onDateChange={(date) => {
                                        if(date > this.state.date){
                                            Toast.show(`Time can't be in future`);
                                        }else{
                                            this.setState({
                                                date : date
                                            })
                                        }
                                    }
                                }
                            />
                        </View>
                        <KeyboardAvoidingView behavior = "padding">
                            <Text style={styles.labelText}>Cab Number</Text>
                            <TextInput  placeholder="Cab Number" 
                                        style= {styles.inputText} 
                                        value = {this.state.cabNumber}
                                        underlineColorAndroid='transparent'
                                        onSubmitEditing={(event) => { 
                                            this.refs.FirstRef.focus(); 
                                        }}
                                        onChangeText={(text) => this.setState({cabNumber:text})}/>
                            <Text style={styles.labelText}>Total Amount (Rs.)</Text>
                            <TextInput  ref='FirstRef'
                                        placeholder="Total Amount" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        keyboardType = 'numeric'
                                        value = {this.state.amount}
                                        onSubmitEditing={(event) => { 
                                            this.onSubmit() 
                                        }}
                                        onChangeText={(text) => this.setState({amount:text})}/>
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
        padding : '5%'
    },
    picker: {
        borderColor : '#04724b',
        borderWidth: 1, 
        borderRadius : 50,
        paddingLeft : '2%'
    },
    inputText: {
        fontSize : 16,
        color: 'black',
        borderBottomWidth : 1,
        borderColor : '#04724b',
        marginBottom: '5%'
    },
    text:{
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginBottom : '2%'
    },
    button : {
        backgroundColor: '#04724b',
        marginTop : 30
    },
    datepickercontainer: {
        borderColor : '#04724b',
        borderWidth: 1, 
        borderRadius : 50,
        padding : '1%',
        marginTop : '5%',
        marginBottom : '5%'
    },
    datepicker : {
        width : '100%'
    },
    datepickertext: {
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginTop : '5%'
    },
    labelText: {
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17
    }
}

const mapStateToProps = state => {
    return {
        alreadyExists : state.user.alreadyExists,
        expenseSubmitState : state.user.expenseSubmit,
        successExpenseSubmit: state.user.successExpenseSubmit
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onExpenseSubmit : (expense) => dispatch(expenseSubmit(expense)),
        onExpenseSubmitted : (alreadyExists, successExpenseSubmit, expenseSubmit) => dispatch(onExpenseSubmitted(alreadyExists, successExpenseSubmit, expenseSubmit)),
        logout : () => dispatch(logOut()),
        onLogOut : logout => dispatch(validatedLogin(logout)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FuelFormScreen);