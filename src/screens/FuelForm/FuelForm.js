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
        cabNumber : 'Adfd',
        amount : 0,
        date: moment(new Date().getTime()).format('DD-MM-YYYY')
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
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
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
                                onDateChange={(date) => {this.setState({date: date})}}
                            />
                        </View>
                        <KeyboardAvoidingView behavior = "padding">
                            <Text style={styles.labelText}>Cab Number</Text>
                            <TextInput  placeholder="Cab Number" 
                                        style= {styles.inputText} 
                                        value = {this.state.cabNumber}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.setState({cabNumber:text})}/>
                            <Text style={styles.labelText}>Total Amount (Rs.)</Text>
                            <TextInput  placeholder="Total Amount" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        keyboardType = 'numeric'
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

export default FuelFormScreen;