import React, {Component} from 'react';
import { View, 
         Text, 
         StyleSheet, 
         ImageBackground, 
         StatusBar, 
         TextInput, 
         Button, 
         TouchableNativeFeedback } from 'react-native';

import backgroundImage from '../../assests/background.png';

class LoginScreen extends Component{
    constructor(props){
        super(props);
    }

    onPressHandler() {

    }

    render(){
        return(
            <ImageBackground source={backgroundImage} 
                             style={styles.backgroundImage}>
                <View>
                <StatusBar backgroundColor="#04724b" 
                           barStyle="dark-content" 
                           translucent={true} />
                    <View>
                        <TextInput placeholder="Username" 
                                   style={styles.inputText} 
                                   underlineColorAndroid='transparent'/>
                        <TextInput placeholder="Password" 
                                   style={styles.inputText}
                                   underlineColorAndroid='transparent'/>
                        <TextInput placeholder="Password" 
                                   style={styles.inputText}
                                   underlineColorAndroid='transparent'/>
                    </View>
                    {/* <TouchableNativeFeedback onPress={this.onPressHandler}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    
                    </TouchableNativeFeedback> */}
                </View>
             </ImageBackground>
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
        width: 320,
        marginTop : 20,
        borderWidth : 1,
        borderRadius : 30,
        height : 45
    },
    touchableContainer : {
        marginTop : 30,
        backgroundColor : "#04724b"
    }
});

export default LoginScreen;