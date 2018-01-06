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
import {endTrip, newTrip} from '../../store/actions/index';

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
    }
    onEndTrip = () => {
        this.setState({
            isSubmiting : true
        });
        this.props.endTripSubmit(this.state.totalFare,this.state.cardAmount, this.state.cardAmount, '', '');
    }

    render() {
        return(
                <TouchableWithoutFeedback onPress={this.dismissModal}>
                    <View style={styles.container}>
                        <View style={styles.form}>
                            <Spinner visible={this.state.isSubmiting} 
                                     textContent={''} 
                                     textStyle={{color: 'black'}} />
                            <KeyboardAvoidingView behavior = "padding">
                                <Text style={styles.text}>Total Fare</Text>
                                <TextInput  placeholder="Total Fare" 
                                            style= {styles.inputText} 
                                            underlineColorAndroid='transparent'
                                            autoCorrect = {false} 
                                            keyboardType = 'numeric'
                                            onSubmitEditing = {(event) => { 
                                                this.refs.SecondInput.focus(); 
                                            }} 
                                            onChangeText={(text) => this.setState({totalFare:text})}/>
                                <Text style={styles.text}>Card Amount</Text>
                                <TextInput  placeholder="Card Amount" 
                                            style= {styles.inputText} 
                                            underlineColorAndroid='transparent'
                                            autoCorrect = {false} 
                                            keyboardType = 'numeric' 
                                            onSubmitEditing = {(event) => { 
                                                    this.refs.ThirdInput.focus(); 
                                            }}
                                           ref='SecondInput' 
                                           onChangeText={(text) => this.setState({cardAmount:text})}/>
                                <Text style={styles.text}>Cash Amount</Text>
                                <TextInput  placeholder="Cash Amount"
                                            style= {styles.inputText} 
                                            underlineColorAndroid='transparent'
                                            autoCorrect = {false} 
                                            keyboardType = 'numeric'
                                            ref='ThirdInput' 
                                            onChangeText={(text) => this.setState({cashAmount:text})}/>
                            </KeyboardAvoidingView>
                            <Button buttonStyle={styles.button}
                                    textStyle={{textAlign: 'center'}}
                                    title={`SUBMIT`}
                                    onPress = {this.onEndTrip}
                            /> 
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            
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
    },
    inputText: {
        fontSize : 16,
        color: 'black',
        borderBottomWidth : 1,
        borderColor : '#04724b',
    },
    button : {
        backgroundColor: '#04724b',
        marginTop : 30
    }

});

const mapDispatchToProps = dispatch => {
    return{
        endTripSubmit : (totalFare, cardAmount, cashAmount, destLat, destLong ) => dispatch(endTrip(totalFare, cardAmount, cashAmount, destLat, destLong )),
        newTrip : () => dispatch(newTrip())
    }
}

const maptStateToProps = state => {
    return{
        endTripComplete : state.trip.endTripComplete
    }
}


export default connect(maptStateToProps, mapDispatchToProps)(EndTripScreen);