import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react'
import authService from '../appwrite/users'
import { useDispatch, useSelector } from 'react-redux';
import { setauthStatus } from '../../store/getUserData';


const LoginScreen = ({navigation}) => {
    const [otp, setOtp] = useState("")
    const dispatch = useDispatch()
    const authStatus = useSelector((state) => state.userData.authStatus)

    if (authStatus) {
      navigation.navigate('HomeStack')
    }

    const handleLogin = () => {
        if (otp.length === 6) {
          authService.login(`${otp}`).
          then(() => {
            Alert.alert('Login Sucessfull');
            dispatch(setauthStatus(true))
            navigation.navigate('HomeStack')
          }).catch((res) => {
            console.log(res);
            Alert.alert('wrong Otp')
            dispatch(setauthStatus(false))
          })
          
        } else {
          Alert.alert('Invalid otp Number', 'Please enter a valid 6-digit Otp number.');
        }
    };

    return(
        <View style={styles.container}>
          <View style={{top:50, position:'absolute', left:0, right: 0,}}>
        <Text style={styles.header}>Login</Text>
        <Image
        source={require('../assets/loginScreen.png')}
        style={{width: 230, height: 230, objectFit:'contain', margin:'auto'}}
        />
      </View>
      <View style={{marginTop:100}}>
      <Text style={styles.header2}>Verify Otp</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your otp"
        keyboardType="phone-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        placeholderTextColor={'#7b7b8b'}
      />
      <TouchableOpacity onPress={handleLogin} style={{borderRadius:10, backgroundColor:'#fe8d00', paddingVertical:10}}>
        <Text style={{textAlign:'center', fontSize:20, color: 'black', fontWeight:'bold'}}>Verify Otp</Text>
      </TouchableOpacity>
      </View>
    </View>
    )
}


export default LoginScreen

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color:'#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
    header2: {
      fontSize: 18,
      color:'#ffffff',
      fontWeight: 'medium',
      textAlign: 'left',
      marginBottom: 15
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#161622',
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      color:'white',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
      backgroundColor: '#1e1e2d',
      fontSize: 16,
    },
})