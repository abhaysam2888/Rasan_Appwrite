import {StatusBar, View, StyleSheet, Text, TouchableOpacity, Dimensions, Button, KeyboardAvoidingView, Image} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { NavigationContainer, } from '@react-navigation/native'
import {useDispatch, useSelector} from 'react-redux'
import {addEventListener} from '@react-native-community/netinfo'
import Snackbar from 'react-native-snackbar'
import messaging from '@react-native-firebase/messaging'
import authService from './appwrite/users'
import { setauthStatus, setauthUser } from '../store/getUserData'
// @ts-ignore
import BottomSheet from 'react-native-simple-bottom-sheet'
import  Icon  from 'react-native-vector-icons/FontAwesome'
import StackNavigation from './stackTabs/StackNavigation'
import service from './appwrite/config'
import { Query } from 'appwrite'
import { responsiveFontSize } from 'react-native-responsive-dimensions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const App = () => {
  const dispatch = useDispatch()
  const {heigth} = Dimensions.get('window')
  const authUser = useSelector((state) => state.userData.authUser)
  const [contri, setContri] = useState(0)
  const authStatus = useSelector((state) => state.userData.authStatus)   
  const contriUpdate = useSelector((state) => state.data.updateContri)   

  // bottom sheet
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false)

  const storeAuthStatus = async (value) => {
    try {
      await AsyncStorage.setItem('authStatus', value);
    } catch (e) {
      // saving error
      console.error('Error storing data', e);
    }
  };

  const getAuthStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('authStatus');
      if (value !== null && value === 'true') {
        dispatch(setauthStatus(true));
      }else if (value !== null && value === 'false'){
        dispatch(setauthStatus(false));
      }
    } catch (e) {
      // error reading value
      dispatch(setauthStatus(false));
      console.error('Error reading data', e);
    }
  };
  
  

useEffect(() => {
  // Function to subscribe to the topic
  const subscribeToTopic = async () => {
    try {
      await messaging().subscribeToTopic('all_users');
      console.log('Subscribed to topic: all_users');
    } catch (error) {
      console.log('Subscription error: ', error);
    }
  };

  // Call the function when the app loads
  subscribeToTopic();
}, []);

// check user is authorize or  not
useEffect(() => {
  const checkUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res && res.$id) {
        dispatch(setauthUser(res));
        storeAuthStatus('true')
        getAuthStatus()
      } else {
        getAuthStatus()
        storeAuthStatus('false')
      }
    } catch (err) {
      getAuthStatus()
      storeAuthStatus('false')
      console.log(err, 'error');
    }
  };

  checkUser();
},[authStatus]);

useEffect(() => {
  
  const fun = async() => {
    if (authUser?.$id) {
      try {
        const res = await service.getContriLists(Query.equal('userId', `${authUser.$id}`));
        setContri(res.documents[0].contribution_amount);
      } catch (err) {
        setContri(err.type);
      }
    }
  }
  fun() 
  console.log(contriUpdate);
  
},[authUser, contriUpdate])

  const [connected, setConnected] = useState(false)
  const [prevConnected, setPrevConnected] = useState(null) // To track the previous state

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (prevConnected !== null && state.isConnected !== prevConnected) {
        setConnected(state.isConnected)
      }
      setPrevConnected(state.isConnected) // Update the previous state
    });
    return () => {
      unsubscribe(); // Clean up the event listener on unmount
    };
  }, [prevConnected])

  useEffect(() => {
    if (prevConnected !== null) {
      Snackbar.show({
        text: connected ? 'Connected to Internet' : 'No Internet Connection',
        backgroundColor: connected ? 'green' : 'red',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }, [connected])


  // logout 
  const logout = () => {
      authService.logout().then(() => {
      storeAuthStatus('false')
      dispatch(setauthUser([]))
      setOpen(false)
    })
  }

  return (    
    <>
    <NavigationContainer>
    <StatusBar backgroundColor={'#161622'}/>
     {authUser.length !== 0 &&
       <View style={styles.headerCont}>
       <View>
         <Image
         source={require('../src/assets/logo.png')}
         style={{width: 30, height: 30, objectFit:'contain'}}
         />
       </View>
       <View>
         <TouchableOpacity onPress={() => (panelRef.current.togglePanel(), setOpen(true))}>
           <Text>
             <Icon name='user' size={30} color={'white'}/>
           </Text>
         </TouchableOpacity>
       </View>
     </View>
     }
    
    <StackNavigation/>
    {authUser.length !== 0 && 
      <KeyboardAvoidingView>
    <BottomSheet 
    ref={ref => panelRef.current = ref}
    isOpen={open} 
    sliderMinHeight={0} 
    sliderMaxHeight={heigth}
    wrapperStyle={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >

    <View style={{ padding: 20 }}>
      <Text style={{color:'#2c2c43', fontSize:responsiveFontSize(2.2), fontWeight:'bold', marginBottom:20}}>Username: {authUser.name || 'no name'}</Text>
      <Text style={{color:'#2c2c43', fontSize:responsiveFontSize(2.2), fontWeight:'bold', marginBottom:20}}>User Phone Number: {authUser.phone || 'no number'}</Text>
      <Text style={{color:'#2c2c43', fontSize:responsiveFontSize(2.2), fontWeight:'bold', marginBottom:20}}>User Role: {authUser.labels[0] || 'specific role'}</Text>
      <Text style={{color:'#2c2c43', fontSize:responsiveFontSize(2.2), fontWeight:'bold', marginBottom:20}}>User Contri: {contri || 0}</Text>
      
      <Button title='logout' onPress={logout}/>
    </View>
    </BottomSheet>
    </KeyboardAvoidingView>
    }
    </NavigationContainer>
    </>
  )
}

const styles = StyleSheet.create({
  headerCont: {
    backgroundColor:'#161622',
    justifyContent:'space-between',
    paddingHorizontal:20,
    flexDirection:'row',
    paddingBottom: 10,
    alignContent:'center',
    borderBottomColor:'gray',
    borderTopColor:'#161622',
    borderRightColor:'#161622',
    borderLeftColor:'#161622',
    borderWidth:0.5
  },
})

export default App