import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import service from '../appwrite/config';
import { Query } from 'appwrite';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { setgetContri } from '../../store/getDataSlice';

const AddMemberContri = () => {
  const userData = useSelector((state) => state.userData.userData)
  const dispatch = useDispatch()
  const [amount, setAmount] = useState()
  const [contri, setContri] = useState([])
  const [role, setRole] = useState('')
  
  const currentMonth = new Date().getMonth() + 1
  const currentDate = new Date().toISOString()

  const authUser = useSelector((state) => state.userData.authUser)
  useEffect(() => {
    if (authUser.length !== 0) {
      const isAdmin = authUser.labels.includes('admin');
      if (isAdmin) {
        setRole('admin');
      }
    }
    
  }, [authUser, setRole]);

  useEffect(() => {
    const list = async() => {
      const item = await service.getContriLists(Query.equal('userId', `${userData.userId}`))
      setContri(item.documents) 
    }
    list()
  },[currentMonth, userData.userId, setContri, contri])
  
  

  const handelPress = async() => {
    try {

      const response = await service.getContriLists(Query.equal('userId', `${userData.userId}`),Query.equal('month', `${currentMonth}`))


      if (response.documents.length > 0) {
        // Document exists, update it
        const documentId = response.documents[0].$id;
        const Date = response.documents[0].Date;
        const month = response.documents[0].month;
        const userId = response.documents[0].userId;
        await service.updateContriList(documentId,{
          contribution_amount: parseInt(amount),
          Date: Date,
          month: month,
          userId: userId,
        });
        dispatch(setgetContri())
        console.log('Document updated:', month);
      } else{
        // No document found, create a new one
        await service.createContriAmount({
          userId: userData.userId,
          contribution_amount: parseInt(amount),
          Date: currentDate,
          month: currentMonth.toString(),
        });
        console.log('New document created for the month:', currentMonth);
      }
      setContri(response.documents);
    } catch (error) {
      console.log(err ,'err in add conti amount');  
    }

  }

  return (
    userData.length !== 0 ?
    <View style={{backgroundColor: '#161622', height: '100%', width: '100%', paddingTop: 20}}>
    <View style={styles.card}>

      <View style={{alignItems:'center', flexDirection:'row',justifyContent:'space-between', marginBottom:10}}>

      <Text style={styles.userName}>{userData.username}</Text>
      {contri.length !== 0 ? <Text style={{color:'gray'}}>{`₹${contri[0].contribution_amount}`}</Text> : <Text style={{color:'gray'}}>0</Text>}
      </View>
        {
          role === 'admin' ?
          <View>
            <Text style={{color:'gray',marginTop:10}}>Update Contribution Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contribution amount"
        value={amount}
        placeholderTextColor={'gray'}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={[styles.button, !amount && styles.buttonDisabled]}
        onPress={() => {
          setAmount('');
          handelPress()
        }}
        disabled={!amount}
      >
        <Text style={styles.buttonText}>Add Contribution</Text>
      </TouchableOpacity>
          </View>
           : null}
    </View>
    </View>  : null
  )
}

export default AddMemberContri

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 16,
        paddingBottom: 16,
      },
      card: {
        backgroundColor: '#161622',
        padding: 16,
        borderWidth: 2,
        borderColor: '#2c2c43',
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      userName: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        color: 'white'
      },
      input: {
        borderColor: '#2c2c43',
        borderWidth: 1.5,
        borderRadius: 4,
        paddingHorizontal: 10,
        height: responsiveHeight(6),
        marginBottom: 22,
        color: 'white'
      },
      button: {
        backgroundColor: '#6200ee',
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: 'center',
      },
      buttonDisabled: {
        backgroundColor: '#ccc',
      },
      buttonText: {
        color: '#000',
        fontWeight: 'bold',
      },
})