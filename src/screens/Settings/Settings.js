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

export default SettingsScreen;