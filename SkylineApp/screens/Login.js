import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    ImageBackground,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Axios from 'axios';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import * as Updates from 'expo-updates'

const { width } = Dimensions.get('screen');

const { height } = Dimensions.get('screen');

const Login = ({navigation}) => {

    const [data, setData] = React.useState({
        emailAddress: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const { colors } = useTheme();

    //const { signIn } = React.useContext(React.createContext());

    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                emailAddress: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                emailAddress: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
       
    //    if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
     //   } 
        /*
        else {
        

            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
         }*/
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (emailAddress, password) => {
       Axios.post('http://65.1.131.197:3000/api/user/mobile_login', {
            emailAddress: emailAddress,
            password: password
          })
          .then(function (response) {
            if (response.data.success === true) {
               AsyncStorage.setItem('user',response.data.id)
               AsyncStorage.setItem('email',response.data.email)
               navigation.navigate('App')
               Updates.reloadAsync()
            }
    
              else{
                Alert.alert(JSON.stringify(response.data.message));
            }
            
        })
          .catch(function (error) {
            console.log(error);
          });


    }
    return (
        <ImageBackground 
        source={{uri:'https://cdn3.shopvii.com/759/605/home_banner_new2.jpg'}}
        style={styles.container}
      >
          <StatusBar backgroundColor='#314050' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome To SKYLINE!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Email Address"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            </Animatable.View>
            }
            

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>
            }
            

            <TouchableOpacity>
                <Text style={{color: '#314050', marginTop:15}}>Forgot password?</Text>
            </TouchableOpacity>
            <View style={styles.button}>

            <TouchableOpacity style={styles.container3}            
            onPress={() => {loginHandle( data.emailAddress, data.password )}}
             >
      <Text style={styles.text2}>Sign In</Text>
    </TouchableOpacity>

        
            </View>
        </Animatable.View>
      </ImageBackground>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#314050'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: height/30,
        paddingBottom: height/15
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: width/30,
    },
    button: {
        alignItems: 'center',
        marginTop: height/20
    },
    signIn: {
        width: '100%',
        height: height/30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: width/30,
        fontWeight: 'bold'
    },
    container3: {
        backgroundColor: "rgba(29,161,242,1)",
        borderRadius: 10,
        width: width/1.2,
        height: height/15,
        justifyContent: "center"
      },
      text2: {
        color: "rgba(255,255,255,1)",
        fontSize: width/25,
        
        fontWeight:"bold",
        alignSelf: "center"
      }
  });