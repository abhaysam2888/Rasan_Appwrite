import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import service from '../appwrite/config'
import { Query } from 'appwrite'
import { getData } from '../../store/getDataSlice'
import Snackbar from 'react-native-snackbar'
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'

const Items = ({navigation}) => {
    const updateData = useSelector((state) => state.data.updateRasanArray)
    const dispatch = useDispatch()
    const {width} = Dimensions.get('window')
    const isoString = updateData.Date;
    const date = new Date(isoString)
    const limit = useSelector((state) => state.data.queryLimit)
    const [disabel, setDisabel] = useState(false)

    const deleteItem = (Id) => {
      setDisabel(true)
      const deleteDocument = service.deleteRasanList(Id)
        if (deleteDocument) {
          Snackbar.show({
            text: 'SucessFull Deleted',
            duration: Snackbar.LENGTH_SHORT,
            textColor: 'red'
          });
        }
      setTimeout(() => {
        const data = async () => {
            await service.getRasanLists(Query.limit(limit) || 100)
            .then((res) => {
                dispatch(getData(res.documents))
                navigation.goBack('HomeStack')
            })
            .catch((err) => console.log(err))
          }
          data()
       },1000)
    }

    const handelPress = () => {
      navigation.navigate('EditItem')
    }
    
  return (
    <View style={{backgroundColor:'#161622', height:'100%'}}>
    <View style={styles.card}>
  <View style={styles.cardHeader}>
    <Text style={styles.cardCategory}>Category: {updateData.Category || 'nothing'}</Text>
    <Text style={styles.cardDate}>Date: {date.toLocaleDateString()}</Text>
  </View>
  <View style={styles.cardContent}>
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>Item: {updateData.Item}</Text>
      <Text style={styles.itemPrice}>Price: Rs.{updateData.Price}</Text>
    </View>
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>Quantity: {updateData.Quantity}</Text>
    </View>
  </View>
    </View>
    <View style={styles.buttonContainer}>
        <TouchableOpacity 
        style={[styles.Buttons,{width: width * 0.4,paddingVertical:15}]} 
        onPress={() => handelPress()}>
          <Text style={styles.ButtonsText}>Edit Item</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={[styles.Buttons,{width: width * 0.4,paddingVertical:15, backgroundColor: 'red'}]} 
        disabled={disabel} 
        onPress={() => deleteItem(updateData.$id)}>
          <Text style={styles.ButtonsText}>Delete Item</Text>
        </TouchableOpacity>
    </View>
    </View>

  )
}

export default Items

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#161622',
        borderRadius: 10,
        borderColor: '#2c2c43',
        borderWidth: 3,
        padding: 15,
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
        color: 'white'
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
})