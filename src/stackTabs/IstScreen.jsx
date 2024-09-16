import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

const IstScreen = ({navigation}) => {
  const authStatus = useSelector((state) => state.userData.authStatus)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (authStatus && isFocused) {
      // Navigate to HomeScreen if authenticated
      navigation.navigate('HomeStack')
    }
  }, [authStatus, isFocused])

  return (
    <View style={styles.container}>
      <View style={{rowGap:'25%'}}>
      <Image
        source={require('../assets/logo.png')}   
        style={{width: 100, height: 100, objectFit: 'contain', margin: 'auto',}}
      />
      <Image
        source={require('../assets/vegetables.png')}   
        style={{width: 300, height: 300, objectFit: 'contain', margin: 'auto',}}
      />
      </View>
      <View style={{paddingHorizontal: 30}}>
        <TouchableOpacity 
          style={{borderRadius: 10, backgroundColor: '#fe8d00', paddingVertical: 10}} 
          onPress={() => {
            if (authStatus) {
              navigation.navigate('HomeStack')
            } else {
              navigation.navigate('GenerateOtp')
            }
          }}
        >
          <Text style={{textAlign: 'center', fontSize: 18, color: 'black', fontWeight: 'bold'}}>
            Continue with Number
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default IstScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    height: '100%',
  },
})
