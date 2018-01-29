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
import { logOut, validatedLogin, settingsSubmit, onSettingsSubmitted } from '../../store/actions/index';
import { Navigation } from 'react-native-navigation';

class SettingsScreen extends Component{

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
        currentPassword : null,
        isSubmiting : false,
        newPassWord: null,
        reNewPassword: null
    }
    
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.settingsSubmitState){
            this.setState({
                currentPassword : null,
                isSubmiting : false,
                newPassWord: null,
                reNewPassword: null
            });
            if(nextProps.successSettingsSubmit){
                Toast.show(`Password Changed Succesfully`);
            }else{
                Toast.show(`Error in changing the password. Please try again`);
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


    onSubmit = () =>{
        if(this.state.currentPassword === null || this.state.newPassWord === null || this.state.reNewPassword === null){
            this.setState({
                isSubmiting : false
            });
            
            Toast.show(`Fields can't be null`);
        }else if(this.state.newPassWord !== this.state.reNewPassword){
            this.setState({
                isSubmiting : false,
                currentPassword: null,
                newPassWord: null,
                reNewPassword: null
            });
            
            Toast.show(`Passwords don't match`);
        }else{
            this.props.onSettingsSubmitted(false, false, false);

            this.setState({
                isSubmiting : true
            });
    
            AsyncStorage.multiGet(['loginid', 'userid'], (errors, res) => {
                if(errors === null){
                    
                    let settings = {
                        newPassword: this.state.newPassWord,
                        currentPassword: this.state.currentPassword,
                        loginID : parseInt(res[0][1]),
                        userID : parseInt(res[1][1])
                    }
    
                    this.props.settingsSubmit(settings);
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
                    <KeyboardAvoidingView behavior = "padding">
                        <View>
                            <Text style={styles.text}>Change Password</Text>
                            <TextInput  placeholder="Current Password" 
                                        style= {styles.inputText} 
                                        underlineColorAndroid='transparent'
                                        autoCapitalize = "none"
                                        secureTextEntry = {true}
                                        onSubmitEditing={(event) => { 
                                            this.refs.SecondInput.focus(); 
                                        }}
                                        value = {this.state.currentPassword}
                                        onChangeText={(text) => this.setState({currentPassword:text})}/>
                            <TextInput  ref='SecondInput'
                                        placeholder="New Password" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        autoCapitalize = "none"
                                        secureTextEntry = {true}
                                        onSubmitEditing={(event) => { 
                                            this.refs.ThirdInput.focus(); 
                                        }}
                                        value = {this.state.newPassWord}
                                        onChangeText={(text) => this.setState({newPassWord:text})}/>
                            <TextInput  ref='ThirdInput'
                                        placeholder="Re-type Password" 
                                        style= {styles.inputText} 
                                        autoCorrect = {false} 
                                        underlineColorAndroid='transparent'
                                        autoCapitalize = "none"
                                        secureTextEntry = {true}
                                        onSubmitEditing={(event) => { 
                                            this.onSubmit() 
                                        }}
                                        value = {this.state.reNewPassword}
                                        onChangeText={(text) => this.setState({reNewPassword:text})}/>
                        </View>
                    </KeyboardAvoidingView>
                        <Button     buttonStyle={styles.button}
                                    textStyle={{textAlign: 'center'}}
                                    title={`SUBMIT`}
                                    onPress = {this.onSubmit}
                        />
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        padding : '5%'
    },
    inputText: {
        fontSize : 16,
        color: 'black',
        borderBottomWidth : 1,
        borderColor : '#04724b',
        marginBottom : '5%'
    },
    button : {
        backgroundColor: '#04724b',
        marginTop : 30
    },
    labelText: {
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginBottom : '-3%'

    },
    text: {
        textAlign : 'center',
        color : '#04724b',
        fontSize : 17,
        marginBottom : '10%'

    }
}

const mapStateToProps = state => {
    return {
        alreadyExists : state.user.alreadyExists,
        settingsSubmitState: state.user.settingsSubmit,
        successSettingsSubmit : state.user.successSettingsSubmit
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout : () => dispatch(logOut()),
        onLogOut : logout => dispatch(validatedLogin(logout)),
        settingsSubmit : (settings) => dispatch(settingsSubmit(settings)),
        onSettingsSubmitted : (alreadyExists, successSettingsSubmit, settingsSubmit) => dispatch(onSettingsSubmitted(alreadyExists, successSettingsSubmit, settingsSubmit)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);