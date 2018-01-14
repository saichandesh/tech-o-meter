import React, { Component } from 'react';
import { View, 
        Text, 
        StatusBar,
        Picker,
        TextInput,
        KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';

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
        expenseType : 'fuel',
        isSubmiting : false,
        cabNumber : 'Adfd',
        cashAmount : 0,
        totalAmount : 0,
        startDate: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
        endDate: moment(new Date().getTime()).format('DD-MM-YYYY   hh:mm:ss a'),
        tripDistance: 0
    }
    
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onSubmit = () =>{
        this.setState({
            isSubmiting : true
        });
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
                                onDateChange={(date) => {this.setState({startDate: date})}}
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
                                onDateChange={(date) => {this.setState({endDate: date})}}
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

export default TripHistoryScreen;