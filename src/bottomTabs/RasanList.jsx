import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DatePicker from 'react-native-date-picker'
import service from '../appwrite/config'
import { Query } from 'appwrite'
import { setExtraQueryLimit, setExtraRasanArray, updateData } from '../../store/getDataSlice'
import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveScreenWidth
} from "react-native-responsive-dimensions";


const RasanList = ({navigation}) => {

    // all state
    const [startingdate, setStartingdate] = useState(new Date());
    const [StartOpen, setStartOpen] = useState(false);
    const [endingdate, setEndingdate] = useState(new Date());
    const [endOpen, setEndOpen] = useState(false);    
    const [disabel, setDisabel] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [noResult, setNoResult] = useState(false); 
    const [role, setRole] = useState('')
    
    const styles = StyleSheet.create({
      card: {
        backgroundColor: '#161622',
        borderRadius: 10,
        padding: 15,
        borderColor: '#2c2c43',
        borderWidth:2,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      cardCategory: {
        fontSize: responsiveFontSize(2.1),
        fontWeight: 'bold',
        color:'white',
      },
      cardDate: {
        fontSize: responsiveFontSize(1.7),
        color: 'gray',
      },
      cardContent: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
      },
      itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
      },
      itemText: {
        fontSize: responsiveScreenFontSize(1.9),
        color: '#fff',
        width: responsiveScreenWidth(40)
      },
      itemPrice: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: '#fff',
        width: responsiveScreenWidth(40),
        textAlign: 'right'
      },
      buttonContainer: {
        justifyContent: 'space-around', 
        alignItems: 'center', 
        flexDirection: 'row', 
        marginTop: 10,
        marginBottom: 20,
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
      }
    });

    // refresh control
    const onRefresh = useCallback(() => {
      setRefresh(true)
      setDisabel(false)
      setTimeout(() => {
        setRefresh(false)
      }, 1000)
    }, [])

    // store values
    const limit = useSelector((state) => state.data.extraqueryLimit)
    const product = useSelector((state) => state.data.getExtraRassanArray)
    const dispatch = useDispatch()
 
     // all list fetch here
    const data = async (listLimit) => {
      // Set starting date to 12:00 AM
      const startDate = new Date(startingdate);
      startDate.setHours(0, 0, 0, 0);

      // Set ending date to 11:59 PM
      const endDate = new Date(endingdate);
      endDate.setHours(23, 59, 59, 999);  

      // query
      const queryLimit = Query.limit(listLimit || 100);
      const queryStartDate = Query.greaterThanEqual('Date', startDate.toISOString());
      const queryEndDate = Query.lessThanEqual('Date', endDate.toISOString());
      

      const list = await service.getExtendedRasanList([queryLimit, queryStartDate, queryEndDate]);
      if (list.total === 0) {
        setNoResult(true)
      }
      if (list.total !== 0) {
        setNoResult(false)
      }
      if (list) {
        dispatch(setExtraRasanArray(list.documents))
        if (list.total < limit) {
          setDisabel(true)
        }
      }
    }
  
  // list query here
  const handelFetch = () => {
      data(limit)
  }
  const handelQuery = () => {
      dispatch(setExtraQueryLimit())
  }

  useEffect(() => {
    if (mounted) { 
      data(limit);
    } else {
      setMounted(true); 
    }
  },[limit])


  const HeaderComp = () => {
    return(
      <>
      <View style={{height:250}}>
        {/* start date */}
      <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, position:'relative',}}>
          <View>
            <TouchableOpacity style={{backgroundColor: '#7695FF', paddingHorizontal:10, paddingVertical: 20}} title="Open" onPress={() => setStartOpen(true)}>
              <Text style={{color: '#fff'}}>
                Choose Start Date
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={StartOpen}
              date={startingdate}
              onConfirm={(date) => {
                setStartOpen(false)
                setStartingdate(date)
              }}
              mode='date'
              onCancel={() => {
                setStartOpen(false)
              }}
            />
          </View>
          <View>
          <View style={{borderWidth:1, paddingHorizontal:20, paddingVertical: 20, width:120, borderColor:'#2c2c43'}}>
            <Text style={{color:'#fff', textAlign:'center'}}>{startingdate.toLocaleDateString()}</Text>
          </View>
          </View>
     </View>
     {/* end Date */}
     <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, position:'absolute', top:70, left:0, right:0}}>
          <View>
            <TouchableOpacity style={{backgroundColor: '#7695FF', paddingHorizontal:13, paddingVertical: 20}} title="close" onPress={() => setEndOpen(true)}>
              <Text style={{color: '#fff'}}>
                Choose End Date
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={endOpen}
              date={endingdate}
              onConfirm={(date) => {
                setEndOpen(false)
                setEndingdate(date)
              }}
              mode='date'
              onCancel={() => {
                setEndOpen(false)
              }}
            />
          </View>
          <View>
          <View style={{borderWidth:1, paddingHorizontal:20, paddingVertical: 20, width:120, borderColor:'#2c2c43'}}>
            <Text style={{color:'#fff', textAlign:'center'}}>{endingdate.toLocaleDateString()}</Text>
          </View>
          </View>
     </View>
     {/* submit button */}
     <View style={{position:'absolute', top:170, left:0, right:0}}>
        <TouchableOpacity style={{justifyContent:'center', backgroundColor:'#C7253E', width:100, height:50, margin:'auto', borderRadius:100}} onPress={handelFetch}>

         <Text style={{textAlign:'center', color:'#ffffff'}}>Get List</Text>

        </TouchableOpacity>
     </View>
      </View>
      </>
    )
  }

  const footerComp = () => {
    return(
      <View>
        {
          noResult ? <Text style={{color: 'gray', textAlign:'center'}}>No Result Try with another Date</Text> : null
        }
        {
          product.length !== 0 ? 
          <View style={styles.buttonContainer}>
        {
        !disabel ? 
        <TouchableOpacity style={[styles.Buttons,{backgroundColor:'gray', opacity: 0.7, borderRadius: 100}]} onPress={handelQuery}>
        <Text style={[styles.ButtonsText,{fontSize:13, paddingHorizontal:5, paddingVertical:10}]}>Load More</Text>
      </TouchableOpacity>
      :
      <Text style={{color: 'gray'}}>No More Items </Text>
      }
        </View>
          : null
        }
      </View>
    )
  }
  // auth user 
  const authUser = useSelector((state) => state.userData.authUser)
  useEffect(() => {
    if (authUser.length !== 0) {
      const isAdmin = authUser.labels.includes('admin');
      if (isAdmin) {
        setRole('admin');
      }
    }
  }, [authUser, setRole]);
  // sending data for modification
  const handelPress = (data) => {
    if (role === 'admin') {
      dispatch(updateData(data))
      navigation.navigate('Item')
    }
  }

  return (
    <>
     {/* cards goes here */}
     <FlatList
     refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}
     ListHeaderComponent={HeaderComp}
     data={product}
     style={{backgroundColor:'#161622'}}
     key={item => item.$id}
     renderItem={({item}) => (
      <TouchableOpacity style={styles.card} onPress={() => handelPress(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardCategory}>Category: {item.Category || 'nothing'}</Text>
          <Text style={styles.cardDate}>Date: {new Date(item.Date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Item: {item.Item}</Text>
            <Text style={styles.itemPrice}>Price: Rs.{item.Price}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Quantity: {item.Quantity}</Text>
          </View>
        </View>
      </TouchableOpacity>
  )}
  ListFooterComponent={footerComp}
     />
    </>
  )
}

export default RasanList


