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
         Keyboard } from 'react-native';

import { Button } from 'react-native-elements';

import backgroundImage from '../../assests/background.png';

class LoginScreen extends Component{
    constructor(props){
        super(props);
    }

    onPressHandler() {

    }

    render(){
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ImageBackground source={backgroundImage} 
                                style={styles.backgroundImage}>
                    <KeyboardAvoidingView behavior = "padding">
                            <StatusBar backgroundColor="#04724b" 
                                    barStyle="dark-content" 
                                    translucent={true} />           
                                <View>
                                    <TextInput placeholder="Username" 
                                            style={styles.inputText} 
                                            underlineColorAndroid='transparent'
                                            autoCapitalize = "none"
                                            onSubmitEditing={(event) => { 
                                                this.refs.SecondInput.focus(); 
                                            }}/>
                                    <TextInput ref='SecondInput'
                                            placeholder="Password" 
                                            style={styles.inputText}
                                            underlineColorAndroid='transparent'
                                            autoCapitalize = "none"
                                            secureTextEntry = {true}
                                            onSubmitEditing={(event) => { 
                                                this.refs.ThirdInput.focus(); 
                                            }}/>
                                    <TextInput ref='ThirdInput'
                                            placeholder="Cab Number" 
                                            style={styles.inputText}
                                            underlineColorAndroid='transparent'
                                            autoCapitalize = "none"/>
                                </View>
                                <Button 
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

export default LoginScreen;