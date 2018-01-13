import React, { Component } from 'react';
import { View,
         Text,
         TextInput,
         StyleSheet,
         KeyboardAvoidingView,
         TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {endTrip, newTrip, dismissModal} from '../../store/actions/index';

class EndTripScreen extends Component{

    static navigatorStyle = {
        statusBarTextColorScheme: 'dark',
        statusBarColor: 'transparent',
        navBarHidden : true
    }

    state = {
        isSubmiting : false,
        totalFare : null,
        cardAmount : null,
        cashAmount: null
    }

    constructor(props){
        super(props);
        this.props.newTrip();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.endTripComplete){
            this.dismissModal();
        }
    }

    dismissModal = () => {
        this.setState({
            isSubmiting : false
        });
        Navigation.dismissAllModals({
            animationType: 'slide-down'
        });
        this.props.dismissModal(true);
    }
    onEndTrip = () => {
        this.setState({
            isSubmiting : true
        });
        this.props.endTripSubmit(this.state.totalFare,this.state.cardAmount, this.state.cardAmount, '', '');
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.form}>
                    <Spinner visible={this.state.isSubmiting} 
                                textContent={''} 
                                textStyle={{color: 'black'}} />
                    <KeyboardAvoidingView behavior = "padding">
                        <Text style={styles.text}>Total Fare (Rs.)</Text>
                        <TextInput  placeholder="Total Fare" 
                                    style= {styles.inputText} 
                                    underlineColorAndroid='transparent'
                                    autoCorrect = {false} 
                                    keyboardType = 'numeric'
                                    onSubmitEditing = {(event) => { 
                                        this.refs.SecondInput.focus(); 
                                    }} 
                                    onChangeText={(text) => this.setState({totalFare:text})}/>
                        <Text style={styles.text}>Cash Amount (Rs.)</Text>
                        <TextInput  placeholder="Cash Amount"
                                    style= {styles.inputText} 
                                    underlineColorAndroid='transparent'
                                    autoCorrect = {false} 
                                    keyboardType = 'numeric'
                                    ref='SecondInput' 
                                    onChangeText={(text) => this.setState({cashAmount:text})}/>
                    </KeyboardAvoidingView>
                    <View style={styles.buttonContainer}>
                        <Button buttonStyle={styles.button}
                                textStyle={{textAlign: 'center'}}
                                title={`SUBMIT`}
                                onPress = {this.onEndTrip}
                        /> 
                        <Button buttonStyle={styles.cancelButton}
                                textStyle={{textAlign: 'center'}}
                                title={`CANCEL`}
                                onPress = {this.dismissModal}
                        /> 
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    form: {
        backgroundColor : 'white',
        width : '90%',
        paddingTop : '5%',
        paddingBottom: '5%',
        paddingLeft : '5%',
        paddingRight : '5%'
    },
    text:{
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginTop: '3%'
    },
    inputText: {
        fontSize : 16,
        color: 'black',
        borderBottomWidth : 1,
        borderColor : '#04724b',
    },
    button : {
        backgroundColor: '#04724b',
        marginTop : 30,
    },
    cancelButton : {
        backgroundColor: '#D75452',
        marginTop : 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const mapDispatchToProps = dispatch => {
    return{
        endTripSubmit : (totalFare, cardAmount, cashAmount, destLat, destLong ) => dispatch(endTrip(totalFare, cardAmount, cashAmount, destLat, destLong )),
        newTrip : () => dispatch(newTrip()),
        dismissModal: (dismissModalValue) => dispatch(dismissModal(dismissModalValue))
    }
}

const maptStateToProps = state => {
    return{
        endTripComplete : state.trip.endTripComplete
    }
}


export default connect(maptStateToProps, mapDispatchToProps)(EndTripScreen);