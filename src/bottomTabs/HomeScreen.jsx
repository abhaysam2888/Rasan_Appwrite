import { RefreshControl, StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList, Linking, } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import service from '../appwrite/config'
import { getData, updateData, setQueryLimit, setMonthlyExp } from '../../store/getDataSlice'
import { Query } from 'appwrite'
import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid, Alert } from 'react-native'
import {
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { getSystemVersion } from 'react-native-device-info'; 
const HomeScreen = ({ navigation }) => {
  // checking the android version
  const systemInfo = parseInt(getSystemVersion())
  
  // notification
  // Request permission for push notifications
  const requestNotificationPermission = async () => {
    try {
      if (systemInfo >= 14) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted.');
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        // Permission denied, show explanation and let user manually retry
        Alert.alert(
          'Permission Required',
          'Notification permission is required to send you updates. You can try again or cancel.',
          [
            {
              text: 'Try Again',
              onPress: async () => {
                // Add a short delay before retrying the permission to avoid flickering
                setTimeout(async () => {
                  const retry = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                  );
                  if (retry === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permission granted on retry.');
                  } else {
                    console.log('Permission denied on retry.');
                  }
                }, 500); // 500ms delay to avoid flickering
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // Permission permanently denied, inform the user to enable it manually
        Alert.alert(
          'Permission Denied Permanently',
          'You have permanently denied notification permissions. To enable notifications, please go to your app settings and enable the permission manually.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
        console.log('Notification permission denied permanently.');
      }
    }
    } catch (err) {
      console.warn(err);
    }
  };
  
  // notification data handeled
  useEffect(() => {
    
    requestNotificationPermission();
    messaging().requestPermission()
      .then(authStatus => {
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
          // Get the device token
          messaging().getToken()
            .then(token => {
              console.log('Device FCM Token:', token);
            });
        }
      });

      // kill state notification
      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened from kill state:', remoteMessage);

          const imageUrl = remoteMessage?.data?.image;
          const screenName = remoteMessage?.data?.screen;

          // Navigate to SafiTab with image data if the notification has the image
          if (screenName === 'SafiScreen' && imageUrl) {
            navigation.navigate('SafiScreen', { image: imageUrl });
          }
        }
      });

      // background state notification
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened from background state:', remoteMessage);

          const imageUrl = remoteMessage?.data?.image;
          const screenName = remoteMessage?.data?.screen;

          // Navigate to SafiTab with image data if the notification has the image
          if (screenName === 'SafiScreen' && imageUrl) {
            navigation.navigate('SafiScreen', { image: imageUrl });
          }
        }
  })
  // when app is opened
      messaging().onMessage( async remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened from opened state:', remoteMessage);

          const imageUrl = remoteMessage?.data?.image;
          const screenName = remoteMessage?.data?.screen;

          // Navigate to SafiTab with image data if the notification has the image
          if (screenName === 'SafiScreen' && imageUrl) {
            navigation.navigate('SafiScreen', { image: imageUrl });
          }
        }
  })
  }, []);
  
  const dispatch = useDispatch()
  const [disabel, setDisabel] = useState(false)
  // refresh control goes here
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [monthlyBudget, setMonthlyBudget] = useState()
  const [role, setRole] = useState('')

  // all list get here from store
  const rasanList = useSelector((state) => state.data.rasanArray)
  const limit = useSelector((state) => state.data.queryLimit)
  const monthlyExp = useSelector((state) => state.data.getMonthlyExpenses)
  const authUser = useSelector((state) => state.userData.authUser)
  
  useEffect(() => {
    if (authUser.length !== 0) {
      const isAdmin = authUser.labels.includes('admin');
      if (isAdmin) {
        setRole('admin');
      }
    }
  }, [authUser, setRole]);
  
  // all list fetch here
  useEffect(() => {
    const data = async () => {
      const [list, price, budget] = await Promise.all([
        service.getRasanLists(Query.limit(limit) || 100),
        service.getExtendedRasanList2(),
        service.getExtendedContriList()
    ]);

      if (list.total === 0) {
        setLoading(false)
        dispatch(getData(list.total))
      }

      if (budget > 0) {
        setMonthlyBudget(budget)
      }
      dispatch(setMonthlyExp(price))
      if (list) {
        setLoading(true)
        dispatch(getData(list.documents))
        setLoading(false)
        if (list.total < limit) {
          setDisabel(true)
        }
      }
    }
    data()
  }, [limit, refresh, setRefresh])
  
  // list query here
  const handelQuery = () => {
    dispatch(setQueryLimit())
  }

  const { width } = Dimensions.get('window')

  const onRefresh = useCallback(() => {
    setRefresh(true)
    setDisabel(false)
    requestNotificationPermission();
    setTimeout(() => {
      setRefresh(false)
    }, 1000)
  }, [])

  // navigation goes here
  const addItem = () => {
    navigation.navigate('AddItem')
  }
  const navigateRasanTab = () => {
    navigation.navigate('EditItems')
  }

  const moneyLeft = monthlyBudget - monthlyExp;

  // Calculate percentages safely
  const expensePercentage = isNaN((monthlyExp / monthlyBudget) * 100)
    ? 0
    : (monthlyExp / monthlyBudget) * 100;
  const leftPercentage = isNaN((moneyLeft / monthlyBudget) * 100)
    ? 0
    : (moneyLeft / monthlyBudget) * 100;

    // current Date
    const currentDate = new Date();
    let month = '';
    switch (currentDate.getMonth() + 1) {
      case 1:
        month = 'January'
        break;
      case 3:
        month = 'Febuary'
        break;
      case 3:
        month = 'March'
        break;
      case 4:
        month = 'April'
        break;
      case 5:
        month = 'May'
        break;
      case 6:
        month = 'June'
        break;
      case 7:
        month = 'July'
        break;
      case 8:
        month = 'August'
        break;
      case 9:
        month = 'September'
        break;
      case 10:
        month = 'October'
        break;
      case 11:
        month = 'November'
        break;
      case 12:
        month = 'December'
        break;
      default:
        month = 'error'
        break;
    }

  // header comp
  const HeaderComp = () => {
    return(
      <>
      <View style={styles.container1}>
        <View>
          <Text style={styles.headerText}>
            Expenses
            💵
          </Text>
        </View>
        <View>
          <Text style={[styles.headerText2, {fontSize: 15, marginTop: 10, color:'gray'}]}>{`${month} ${currentDate.getFullYear()}`} ♻️</Text>
          <Text style={styles.headerText2}>{`₹${monthlyExp}`}</Text>
        </View>
      </View>
      <View style={styles.MonthlyContainer}>
      <View style={styles.MonthlyContainer2}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.MonthlyText, {textAlign: 'left'}]}>Left To spend</Text>
          <Text style={[styles.MonthlyText2, {textAlign: 'left'}]}>{`₹${moneyLeft || 0}`}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.MonthlyText, {textAlign: 'right'}]}>Monthly budget</Text>
          <Text style={[styles.MonthlyText2, {textAlign: 'center'}]}>{`₹${monthlyBudget || 0}`}</Text>
        </View>
      </View>
      <View style={styles.rangeContainer}>
    <View
      style={[
        styles.rangeSegment,
        {
          flex: expensePercentage,
          backgroundColor: '#ff6347',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        },
      ]}
    >
      {expensePercentage > 10 && (
        <Text style={styles.labelText}>{expensePercentage.toFixed(1)}%</Text>
      )}
    </View>
    <View
      style={[
        styles.rangeSegment,
        {
          flex: leftPercentage,
          backgroundColor: '#90ee90',
          borderTopEndRadius: 10,
          borderBottomEndRadius: 10,
        },
      ]}
    >
      {leftPercentage > 10 && (
        <Text style={styles.labelText}>{leftPercentage.toFixed(1)}%</Text>
      )}
    </View>
  </View>
      </View>
      <Text style={styles.rasanListText}>Rasan List 🍽</Text>
      <View style={styles.rasanListHeader}>
        <View>
          <Text style={styles.listHeaderText}>Item</Text>
        </View>
        <View>
          <Text style={styles.listHeaderText}>Quantity</Text>
        </View>
        <View>
          <Text style={styles.listHeaderText}>Price</Text>
        </View>
      </View>
      </>
    )
  }

  // footer comp
  const FooterComp = () => {
    return(
      <> 
        <View style={styles.buttonContainer}>
        {
          !disabel && rasanList !== 0? 
          <TouchableOpacity style={[styles.Buttons,{backgroundColor:'gray', opacity: 0.7, borderRadius: 100}]} onPress={handelQuery}>
          <Text style={[styles.ButtonsText,{fontSize:13, paddingHorizontal:5, paddingVertical:10}]}>Load More</Text>
        </TouchableOpacity>
        :
        <Text style={{color: 'gray'}}>No More Items </Text>
        }
        </View>
        
        { 
        role === 'admin' && authUser.length !== 0 ?
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.Buttons,{width: width * 0.4,paddingVertical:15}]} onPress={addItem}>
            <Text style={styles.ButtonsText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.Buttons,{width: width * 0.4,paddingVertical:15}]} onPress={navigateRasanTab}>
            <Text style={styles.ButtonsText}>Edit Item</Text>
          </TouchableOpacity>
        </View> : null}
      </>
    )
  }

  // loading comps
  const DataSkeleton = () => {
    return (
      <View style={styles.rasanListContent}>
      <View style={styles.rasanListContentInside}>
        <View style={[styles.skeletonItem, { flex: 2 }]} />
        <View style={[styles.skeletonItem, { flex: 1 }]} />
        <View style={[styles.skeletonItem, { flex: 1 }]} />
      </View>
    </View>
    )
  }

  // handel press for sending data to update
  const handelPress = (data) => {
    if (role  === 'admin' && authUser.length !== 0) {
      dispatch(updateData(data))
      navigation.navigate('Item')
    } 
  }
console.log(authUser);

  // skeleton data
  const skeletonPlaceholderData = Array(5).fill({});
  
  return (
       loading ? 
       <FlatList
       ListHeaderComponent={HeaderComp}
       data={skeletonPlaceholderData} // Use the placeholder data
       keyExtractor={(item, index) => index.toString()}  // Use index as key
       refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}
       style={{backgroundColor: '#161622'}}
       renderItem={() =>  
           <DataSkeleton />
       }
       ListFooterComponent={FooterComp}/> 
        :
       <FlatList
        ListHeaderComponent={HeaderComp}
        data={rasanList}
        style={{backgroundColor: '#161622'}}
        keyExtractor={item => item.$id}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}
        renderItem={({ item }) =>  
            <TouchableOpacity style={styles.rasanListContent} onPress={() => handelPress(item)}>
            <View style={styles.rasanListContentInside}>
              <Text style={[styles.listContentText,{textAlign:'left'}]} numberOfLines={1}>{item.Item}</Text>
            
              <Text style={[styles.listContentText,{textAlign:'center'}]}>{item.Quantity}</Text>
            
              <Text style={[styles.listContentText,{textAlign:'right'}]}>{item.Price}</Text>
            </View>
          </TouchableOpacity>
        }
        ListFooterComponent={FooterComp}/>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 35,
    paddingVertical: 10,
    fontWeight: 'bold'
  },
  headerText2: {
    color: 'white',
    textAlign: 'center',
    fontSize: 50
  },
  MonthlyContainer: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowRadius: 5,
    elevation: 1,
    padding: responsiveWidth(0.05), 
  },
  MonthlyContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20,
    gap:20,
    marginVertical: 10,
  },
  MonthlyText:{
    color: 'gray',
    fontSize: responsiveFontSize(2),
  },
  MonthlyText2: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginTop: 5,
  },
  rangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 30, 
    overflow: 'hidden',
    marginVertical: 10,
    borderRadius: 10, 
  },
  rangeSegment: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  labelText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: 5,
  },
  
  rasanListText: {
    fontSize: responsiveFontSize(4),
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  rasanListHeader: {
    borderWidth: 1,
    borderColor: '#2c2c43',
    marginLeft: 10,    
    marginRight: 10,    
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rasanListContent: {
    borderWidth: 1,
    borderColor: '#2c2c43',
    marginLeft: 15,    
    marginRight: 15,
    borderTopWidth: 0,
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10,
    paddingBottom: 20,
  },
  rasanListContentInside: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  listHeaderText: {
    fontSize:responsiveFontSize(2.5), 
    color: '#fff', 
    fontWeight:'bold',
  },
  listContentText: {
    flex:1,
    fontSize:18, 
    color: 'gray',
  },
  buttonContainer: {
    justifyContent: 'space-around', 
    alignItems: 'center', 
    flexDirection: 'row', 
    marginTop: 10,
    marginBottom: 100,
  },
  Buttons: {
    backgroundColor: '#7A1CAC', 
    paddingHorizontal: 10,  
    borderRadius: 10,
  },
  ButtonsText: {
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16,
  },
  rasanListContentInside: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  skeletonItem: {
    height: 18,
    borderRadius: 4,
    backgroundColor: 'pink',
    marginRight: 10,
  },

})
