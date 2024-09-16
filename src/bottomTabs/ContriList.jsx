import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MonthPicker from 'react-native-month-year-picker'
import service from '../appwrite/config';
import { Query } from 'appwrite';
import {
  responsiveFontSize,
  responsiveWidth
} from "react-native-responsive-dimensions";

const ContriList = () => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [monthlyBudget, setMonthlyBudget] = useState(0)
    const [monthlyExpen, setMonthlyExpen] = useState(0)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); 
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const styles = StyleSheet.create({
      MonthlyContainer2: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          shadowColor: '#000',
          elevation: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginVertical: 20,
          marginHorizontal: 20,
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 20,
      },
      MonthlyText: {
          color: 'gray',
          fontSize: responsiveFontSize(1.7),
          width:'100%',
          fontWeight: 'normal'
      },
      MonthlyText2: {
          color: 'white',
          fontSize: responsiveFontSize(2.7),
          fontWeight: 'bold',
      },
  });
  
    
    const onChange = (event, newDate) => {
        setShowPicker(false);
        if (newDate) {
           setDate(newDate);
        }
    };

const handelClick = async () => {
    console.log(`Selected month: ${date.getMonth() + 1}`); // For debugging

    const queryStartDate = Query.greaterThanEqual('Date', startOfMonth.toISOString());
    const queryEndDate = Query.lessThanEqual('Date',endOfMonth.toISOString());
    const limit = Query.limit(100000)

       await Promise.all([

        service.getExtendedContriList2([
            limit,
            queryStartDate,
            queryEndDate 
        ]).then((res) => {
            setMonthlyBudget(res)
            console.log(res, 'contri list')
        })
        .catch((err) => console.log(err)),

        service.getExtendedRasanList3([
            limit,
            queryStartDate,
            queryEndDate 
        ]).then((res) => {
            setMonthlyExpen(res)
            console.log(res, 'rasan list')
        })
        .catch((err) => console.log(err)
        )
    ]);
};


  return (
    <View style={{backgroundColor:'#161622', height:'100%', width:'100%'}}>
    <View style={{height: 250, paddingHorizontal: 20}}>
        {/* Start Date */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
            {/* Button to choose month */}
            <View style={{flex: 1, marginRight: 10}}>
                <TouchableOpacity 
                    style={{
                        backgroundColor: '#C68FE6', 
                        paddingHorizontal: 10, 
                        paddingVertical: 15, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: 8, 
                    }} 
                    onPress={() => setShowPicker(true)}
                >
                    <Text style={{color: '#fff', fontSize: responsiveFontSize(2), width:'100%', textAlign:'center'}}>Choose Month</Text>
                </TouchableOpacity>
                {/* Month Picker */}
                {showPicker && (
                    <MonthPicker
                        onChange={onChange}
                        value={date}
                        minimumDate={new Date(2024, 0)}
                        maximumDate={new Date(2030, 11)}
                    />
                )}
            </View>

            {/* Selected Month Display */}
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{
                    borderWidth: 1, 
                    paddingHorizontal: 20, 
                    paddingVertical: 15, 
                    width: '100%', 
                    borderColor: '#2c2c43', 
                    borderRadius: 8
                }}>
                    <Text style={{color:'#fff', textAlign:'center', fontSize: responsiveFontSize(2)}}>
                        {`${date.getMonth() + 1} / ${date.getFullYear()}`}
                    </Text>
                </View>
            </View>
        </View>

        {/* Submit Button */}
        <View style={{alignItems: 'center', marginTop: 30}}>
            <TouchableOpacity 
                style={{
                    justifyContent: 'center',
                    backgroundColor: '#C7253E',
                    width: 150, // Increased width for better visibility
                    height: 50,
                    borderRadius: 100,
                }} 
                onPress={handelClick}
            >
                <Text style={{textAlign:'center', color:'#ffffff', fontSize: responsiveFontSize(2), width:'100%'}}>Get List</Text>
            </TouchableOpacity>
        </View>
    </View>

    {/* Conditional Display of Budget & Expense */}
    {monthlyBudget === 0 && monthlyExpen === 0 ?
    <Text style={{textAlign:'center', color:'gray'}}>Nothing to show</Text>
    :
    <View style={styles.MonthlyContainer2}>
            <View style={{width: responsiveWidth(50)}}>
                <Text style={styles.MonthlyText}>Monthly Expense</Text>
                <Text style={styles.MonthlyText2}>{`₹${monthlyExpen}`}</Text>
            </View>
            <View style={{width: responsiveWidth(50)}}>
                <Text style={styles.MonthlyText}>Monthly Contri</Text>
                <Text style={styles.MonthlyText2}>{`₹${monthlyBudget}`}</Text>
            </View>
        </View>
    }
        
    </View>


  )
}

export default ContriList

