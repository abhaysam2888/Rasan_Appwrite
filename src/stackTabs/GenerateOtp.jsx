import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react'
import authService from '../appwrite/users'

const GenerateOtp = ({ navigation }) => {

  const [phoneNumber, setPhoneNumber] = useState("")

    const handleLogin = () => {
        if (phoneNumber.length === 10) {
          authService.generateOtp(`+91${phoneNumber}`).
          then((res) => {
            Alert.alert('otp sent', `Phone Number: ${phoneNumber}`);
            navigation.navigate('Login')
            console.log(res);
          }).catch((err) => {
            Alert.alert(err.type)
          })
          
        } else {
          Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
        }
    };
    
  return (
    <View style={styles.container}>
      <View style={{top:50, position:'absolute', left:0, right: 0,}}>
        <Text style={styles.header}>Login</Text>
        <Image
        source={require('../assets/loginScreen.png')}
        style={{width: 230, height: 230, objectFit:'contain', margin:'auto'}}
        />
      </View>
      <View style={{marginTop:100}}>
      <Text style={styles.header2}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        maxLength={10}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholderTextColor={'#7b7b8b'}
      />

      <TouchableOpacity onPress={handleLogin} style={{borderRadius:10, backgroundColor:'#fe8d00', paddingVertical:10}}>
        <Text style={{textAlign:'center', fontSize:20, color: 'black', fontWeight:'bold'}}>Generate Otp</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default GenerateOtp

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color:'#ffffff',
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