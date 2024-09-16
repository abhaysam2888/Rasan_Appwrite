import React, { useCallback, useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import service from '../appwrite/config'
import { useDispatch, useSelector } from 'react-redux';
import { Query } from 'appwrite';
import Snackbar from 'react-native-snackbar';
import { getData } from '../../store/getDataSlice';
import { responsiveFontSize } from 'react-native-responsive-dimensions';


const validationSchema = Yup.object().shape({
    documents: Yup.array().of(
        Yup.object().shape({
            Item: Yup.string().required('Item is required'),
            Price: Yup.number().required('Price is required').typeError('Must be number'),
            Quantity: Yup.string().required('Quantity is required'),
        })
    ),
});

const EditItem = ({navigation}) => {
    const dispatch = useDispatch()
    const limit = useSelector((state) => state.data.queryLimit)
    const product = useSelector((state) => state.data.updateRasanArray)
    
    const {width} = Dimensions.get('window')
    const [disabel, setDisabel] = useState(false)

    // refresh control
    const [refresh, setrefresh] = useState(false)

    const onRefresh = useCallback(() => {
    setrefresh(true)
    setTimeout(() => {
      setrefresh(false)
    },1000)
    },[])

    // initial state
    const initialValues = {
        documents: [{ Item: product.Item, Price: product.Price, Date: product.Date, Quantity: product.Quantity, Category: product.Category }],
    };

    const handleSubmit = async(values) => {
        setDisabel(true)
            const formatedValues = values.documents.map(doc => ({
                ...doc,
                Price: parseFloat(doc.Price),
            }))

       const data = await service.updateRasanList(product.$id,
        {
        ...formatedValues[0]
       }).then((res) => {
        Snackbar.show({
            text: 'Item Updated SucessFull',
            duration: Snackbar.LENGTH_SHORT,
            textColor: 'white',
            backgroundColor: 'green'
        })
        setTimeout(() => {
            const data = async () => {
                await service.getRasanLists(Query.limit(limit) || 100)
                .then((res) => {
                    dispatch(getData(res.documents))
                    setDisabel(false)
                    navigation.navigate('HomeStack')
                })
                .catch((err) => {
                    console.log(err);
                })
              }
              data()
           },1000)
       }).catch(() => {
        Snackbar.show({
            text: 'Error occur',
            duration: Snackbar.LENGTH_SHORT,
            textColor: 'white',
            backgroundColor: 'red'
        })
       })
    };
    return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh}/>}>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
                <View>
                    <FieldArray name="documents">
                        {() => (
                            <View>
                                {Array.isArray(values.documents) && values.documents.map((document, index) => (
                                    <View key={index} style={styles.formGroup}>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Item</Text>
                                    <View>
                                        <TextInput
                                            style={[styles.input,{width:width*0.5}]}
                                            placeholder="Item"
                                            placeholderTextColor={'gray'}
                                            onChangeText={handleChange(`documents.${index}.Item`)}
                                            value={document.Item}
                                        />
                                        {errors.documents?.[index]?.Item && touched.documents?.[index]?.Item && (
                                            <Text style={styles.error}>{errors.documents[index].Item}</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Price</Text>
                                    <View>
                                    <TextInput
                                            style={[styles.input,{width:width*0.5}]}
                                            placeholder="Price"
                                            placeholderTextColor={'gray'}
                                            onChangeText={handleChange(`documents.${index}.Price`)}
                                            value={document.Price?.toString()}
                                            keyboardType='numeric'
                                        />
                                        {errors.documents?.[index]?.Price && touched.documents?.[index]?.Price && (
                                            <Text style={styles.error}>{errors.documents[index].Price}</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Date</Text>
                                    <TextInput
                                        style={[styles.input,{width:width*0.5}]}
                                        placeholderTextColor={'gray'}
                                        placeholder="Date"
                                        onChangeText={handleChange(`documents.${index}.Date`)}
                                        value={new Date(product.Date).toDateString()}
                                        readOnly
                                    />
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Quantity</Text>
                                    <View>
                                        <TextInput
                                            style={[styles.input,{width:width*0.5}]}
                                            placeholder="Quantity"
                                            placeholderTextColor={'gray'}
                                            onChangeText={handleChange(`documents.${index}.Quantity`)}
                                            value={document.Quantity}
                                        />
                                        {errors.documents?.[index]?.Quantity && touched.documents?.[index]?.Quantity && (
                                            <Text style={styles.error}>{errors.documents[index].Quantity}</Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.verticalAlign}>
                                    <Text style={styles.verticalAlignText}>Category</Text>
                                    <TextInput
                                        style={[styles.input,{width:width*0.5}]}
                                        placeholder="Category"
                                        placeholderTextColor={'gray'}
                                        onChangeText={handleChange(`documents.${index}.Category`)}
                                        value={document.Category}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </FieldArray>
            <TouchableOpacity disabled={disabel} onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.buttonText}>Update Values</Text>
            </TouchableOpacity>
            </View>
            )}
        </Formik>
    </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#0C0C0C',
    },
    formGroup: {
        marginBottom: 20,
        backgroundColor: '#2E073F',
        padding: 10,
        borderRadius: 10
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        color: '#000',
    },
    verticalAlign: {
        flex:1, 
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent:'space-between'
    },
    verticalAlignText:{
        color: 'white', 
        fontSize:responsiveFontSize(2.1),
        maxWidth:90,
        width: '100%'
    },
    submitButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});

export default EditItem;
