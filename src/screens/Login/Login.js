import React, {Component} from 'react';
import { View, 
         Text, 
         StyleSheet, 
         ImageBackground, 
         StatusBar, 
         TextInput,
         TouchableNativeFeedback,
         KeyboardAvoidingView,
         TouchableWithoutFeedback,
         Keyboard,
         ActivityIndicator,
         Modal,
         AsyncStorage } from 'react-native';

import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import { Navigation } from 'react-native-navigation';

import backgroundImage from '../../assests/login_screen_no_icon.png';
import startHome from '../Home/homeTab';
import {loginUser, validatedLogin} from '../../store/actions/index';

class LoginScreen extends Component{

    state = {
        userName: null,
        password : null,
        cabNumber: null,
        isLogging: false
    }

    static navigatorStyle = {
        statusBarTextColorScheme: 'dark',
        statusBarColor: '#04724b',
        navBarHidden : true
    }

    constructor(props){
        super(props);
        AsyncStorage.getItem('userLogged', (err, res) => {
            if(res === 'true'){
                startHome();
            }
        });
    }
    
    componentWillUpdate(nextProps, nextState){
        if(nextProps.isLoggedIn){
            AsyncStorage.setItem('userLogged', 'true', (err) => {
                if(!err){
                    startHome();
                }else{
                    Toast.show('Error in Signing In');
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
                }
            });
        }
    }

    onPressHandler = () => {

        this.props.setLoggin(false);

        this.setState(prevState => {
            return{
                ...prevState,
                isLogging : true
            }
        });
        
        if( this.state.userName == null || this.state.userName == '' 
            || this.state.password == null || this.state.password == ''
            || this.state.cabNumber == null || this.state.cabNumber == ''){
                this.setState(prevState => {
                    return{
                        ...prevState,
                        isLogging : false
                    }
                });
                Toast.show('All Fields are required');
        }else{
            this.props.onLogin(this.state.userName, this.state.password, this.state.cabNumber);
        }
    }

    render(){
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground source={backgroundImage} 
                                 style={styles.backgroundImage}>                  
                    <Spinner visible={this.state.isLogging} textContent={'Signing In'} textStyle={{color: '#FFF'}} />
                    <KeyboardAvoidingView behavior = "padding">
                            <StatusBar backgroundColor="#04724b" 
                                    barStyle="dark-content" 
                                    translucent={true} />
                                <View >
                                    <TextInput placeholder="Username" 
                                            style={styles.inputText} 
                                            underlineColorAndroid='transparent'
                                            autoCapitalize = "none"
                                            onSubmitEditing={(event) => { 
                                                this.refs.SecondInput.focus(); 
                                            }}
                                            onChangeText={(text) => this.setState({userName:text})}/>
                                    <TextInput ref='SecondInput'
                                            placeholder="Password" 
                                            style={styles.inputText}
                                            underlineColorAndroid='transparent'
                                            autoCapitalize = "none"
                                            secureTextEntry = {true}
                                            onSubmitEditing={(event) => { 
                                                this.refs.ThirdInput.focus(); 
                                            }}
                                            onChangeText={(text) => this.setState({password:text})}/>
                                    <TextInput ref='ThirdInput'
                                            placeholder="Cab Number" 
                                            style={styles.inputText}
                                            underlineColorAndroid='transparent'
                                            autoCapitalize = "none"
                                            onChangeText={(text) => this.setState({cabNumber:text})}/>
                                </View>
                                <Button onPress={this.onPressHandler}
                                        buttonStyle={styles.button}
                                        textStyle={{textAlign: 'center'}}
                                        title={`SIGN IN`}
                                /> 
                    </KeyboardAvoidingView>   
                </ImageBackground>
              </TouchableWithoutFeedback> 
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage : {
        flex : 1,
        width : "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer:{
        flex : 1,
        justifyContent : "center",
        alignItems : "center"
    },
    inputText:{
        width: 300,
        marginTop : 20,
        borderWidth : 1,
        borderRadius : 30,
        height : 45,
        borderColor : '#a2f2d1',
        backgroundColor : '#a2f2d1',
        paddingLeft : 20

    },
    button : {
        backgroundColor: '#04724b', 
        borderRadius: 10, 
        marginTop : 30,
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogin : (UserName, password, cabNumber) => dispatch(loginUser(UserName, password, cabNumber)),
        setLoggin : (loggedIn) => dispatch(validatedLogin(loggedIn))
    };
}

const mapStateToProps = state => {
    return {
        isLoggedIn : state.user.isLoggedIn
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);