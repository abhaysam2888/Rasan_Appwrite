import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import service from '../appwrite/config'
import { setuserData, setuserList } from '../../store/getUserData';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const MembersScreen = ({navigation}) => {
  const userData = useSelector((state) => state.userData.userList)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const handelPress = (data) => {
    navigation.navigate('AddAmount')
    dispatch(setuserData(data))
  }

  useEffect(() => {
    service.getUserLists().
    then((res) => {
      if (res) {
       dispatch(setuserList(res.documents))
      }
      if (userData) {
        setLoading(false)
      }
    }).catch((err) => {
      alert(err.type)
      console.log(err)
  })
  },[])

  const LoadingSkeleton = () => {
    return (
      <View style={{backgroundColor: '#161622', height: '100%', width: '100%'}}>
      <TouchableOpacity style={styles.card2}>
        <View style={styles.skeletonName}></View>
        <View style={styles.skeletonUserId}></View>
      </TouchableOpacity>
      </View>
    );
  };

    // refresh control goes here
    const [refresh, setRefresh] = useState(false)

    const onRefresh = useCallback(() => {
      setRefresh(true)
      setTimeout(() => {
        setRefresh(false)
      }, 1000)
    }, [])
  
  return (
    loading ? 
    <LoadingSkeleton/>
    : 
    <FlatList
      data={userData}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}
      keyExtractor={(item) => item.$id}
      style={{backgroundColor: '#161622'}}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handelPress(item)}>
          <Text style={styles.name}>{item.username}</Text>
          <Text style={styles.userId}>ID: {item.userId}</Text>
        </TouchableOpacity>
      )}
    />
  )
}

export default MembersScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000', 
    blurRadius: 5,
    borderRadius: 8,
    marginVertical: 5,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userId: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  card2: {
    width: '100%',
    height: 100,
    backgroundColor: '#161622',
    borderRadius: 8,
    borderColor: '#2c2c43',
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
  },
  skeletonName: {
    width: '80%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  skeletonUserId: {
    width: '60%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  '@keyframes loading': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
})
